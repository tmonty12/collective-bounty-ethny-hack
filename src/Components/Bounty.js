import { Container, Stack, Form, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet';
import { useEffect, useState } from 'react'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { ethers } from 'ethers';


function BountyHomepage ({bountyAddress, connectBtnText, chainId}) {
// if staked or uploaded video, can see all videos
// all videos will be separate component
// need stake button and upload video button

    const [request, setRequest] = useState('')
    const [staking, setStaking] = useState(false)
    const [stake, setStake] = useState(1)

    const getBounty = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const request = await bounty.request()
        setRequest(request)
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
                <Button type="submit">Submit</Button>
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
                <h1>{request}</h1>
                {body()}
            </ConnectWallet>
        </Container>
    )


}
export default BountyHomepage;