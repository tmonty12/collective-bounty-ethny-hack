import { Container, Stack, Form, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet';
import Videos from './Videos';
import { useEffect, useState } from 'react'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import { ethers, utils } from 'ethers';
import { useParams } from 'react-router-dom';
import VideoUpload from './VideoUpload';

const bountyFactoryAddress = '0x2DAa635a02C92E40453157e946269ac43376DF2f'

function BountyHomepage({ connectBtnText, chainId }) {
    const [bountyDisplay, setBountyDisplay] = useState(<div></div>)
    const [bountyAddress, setBountyAddress] = useState("")
    const [staking, setStaking] = useState(false)
    const [stake, setStake] = useState(1)
    const [staked, setStaked] = useState(false)
    const [uploading, setUploading] = useState(false)
    const [uploaded, setUploaded] = useState(false)
    const [deadline, setDeadline] = useState("")
    const [executed, setExecuted] = useState(false)

    const {index} = useParams()

    const getBounty = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)

        const bountyAddress = await bountyFactory.bounties(index)
        setBountyAddress(bountyAddress)
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        let deadline = (await bounty.deadline()).toNumber()
        const options = { day: '2-digit', year: 'numeric', month: '2-digit', hour:'2-digit', minute: '2-digit'}
        setDeadline(new Date(deadline*1000))
        deadline = (new Date(deadline*1000)).toLocaleDateString('en-US', options)
        const request = (await bounty.request()).toString()
        const balance = parseInt((await bounty.getBalance()).toString()) / (10**18)
        // setExecuted(await bounty.executed())

        // check if already staked
        window.ethereum.request({ method: "eth_accounts" })
        .then(async (accounts) => {
        if (accounts.length !== 0) {
            const currentAddress = utils.getAddress(accounts[0]);
            const stakers = await bounty.getStakers()
            setStaked(stakers.includes(currentAddress))
            console.log(stakers)
        }
        })

        // check if uploaded a video
        const videoObjects = await bounty.getVideos()
        for (let i=0; i < videoObjects.length; i++) {
            window.ethereum.request({ method: "eth_accounts" })
            .then(async (accounts) => {
            if (accounts.length !== 0) {
                const currentAddress = utils.getAddress(accounts[0]);
                if (videoObjects[i].submissionAddr == currentAddress) {
                    setUploaded(true)
                }
            }
            })
        }
        
        setBountyDisplay(
            <div>
                <h1>{request}</h1>
                <div><strong>Deadline: </strong>{deadline}</div>
                <div><strong>Current Stake: </strong>{balance} MATIC</div>
            </div>
        )
    }

    const onSubmitStakeForm = async (e) => {
        e.preventDefault()

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const createStake = await bounty.stake({value: ethers.utils.parseEther(stake.toString())})
        await createStake.wait()
        window.location.reload()
    }

    const executeContract = async() => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const tallyVotes = await bounty.tallyVotes()
        await tallyVotes.wait()
        window.location.href = "/"
    }

    // const executeButton = {
    //     <Button onClick={executeContract}>Execute Contract</Button>
    // }

    function body() {
        const pastDeadline = Date.now() > deadline
        if (staked) {
            return (
                <div>
                    <h3>Submitted Videos</h3>
                    {pastDeadline && <Button onClick={executeContract}>Execute Contract</Button>}
                    <Videos bountyAddress={bountyAddress} />
                </div>
            )
        }
        else if (staking) {
            return (
            <Form onSubmit={onSubmitStakeForm}>
                <Form.Group className="mb-3" controlId="stake request">
                        <Form.Label>Amount to stake</Form.Label>
                        <Form.Control type="number" value={stake} onChange={({target}) => setStake(target.value)}></Form.Control>
                </Form.Group>
                <Stack direction="horizontal" gap={3}>
                    <Button type="submit">Submit</Button>
                    <Button onClick={() => setStaking(false)}>Back</Button>
                </Stack>
            </Form>)
        } else if (uploaded) {
            return <h3>Successfully uploaded!</h3>
        } else if (uploading) {
            return ( 
                <VideoUpload index={index} connectBtnText={connectBtnText} chainId={chainId} />
           )
        } 
        else {
            return (
                <Stack direction="horizontal" gap={3}>
                    <Button onClick={() => setStaking(true)}>Stake</Button>
                    <Button onClick={() => setUploading(true)}>Upload Video</Button>
                </Stack>
            )
        }
    }

    useEffect(() => {
        getBounty();
    }, [])


    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                {bountyDisplay}
                {body()}
            </ConnectWallet>
        </Container>
    )
}

export default BountyHomepage;