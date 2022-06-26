import { Container, Stack, Form, Button, Card } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet';
import { useEffect, useState } from 'react'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import { ethers } from 'ethers';
import { useParams } from 'react-router-dom';

const bountyFactoryAddress = '0x9fE46736679d2D9a65F0992F2272dE9f3c7fa6e0'

function BountyHomepage ({match, connectBtnText, chainId}) {
// if staked or uploaded video, can see all videos
// all videos will be separate component
// need stake button and upload video button

    const [bountyDisplay, setBountyDisplay] = useState(<div></div>)
    const [bountyAddress, setBountyAddress] = useState("")
    const [staking, setStaking] = useState(false)
    const [stake, setStake] = useState(1)

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
        deadline = (new Date(deadline*1000)).toLocaleDateString('en-US', options)
        const request = (await bounty.request()).toString()
        const balance = parseInt((await bounty.getBalance()).toString()) / (10**18)

        setBountyDisplay(
                <Card.Body>
                    <Card.Title>
                        {request}
                    </Card.Title>
                    <div><strong>Deadline: </strong>{deadline}</div>
                    <div><strong>Current Stake: </strong>{balance} ETH</div>
                </Card.Body>
        )
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        bounty.stake({value: ethers.utils.parseEther(stake.toString())})
    }

    function body() {
        if (staking) {
            return (
            <Form onSubmit={onSubmitForm}>
                <Form.Group className="mb-3" controlId="request">
                        <Form.Label>Amount to stake</Form.Label>
                        <Form.Control type="number" value={stake} onChange={({target}) => setStake(target.value)}></Form.Control>
                </Form.Group>
                <Stack direction="horizontal" gap={3}>
                    <Button type="submit">Submit</Button>
                    <Button onClick={() => setStaking(false)}>Back</Button>
                </Stack>
            </Form>)
        } else {
            return (
                <Stack direction="horizontal" gap={3}>
                    <Button onClick={() => setStaking(true)}>Stake</Button>
                    <Button>Upload Video</Button>
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