import { Container, Form, Card, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet'
import { useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate } from 'react-router-dom' 
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'

const bountyFactoryAddress = process.env.REACT_APP_BOUNTY_FACTORY_ADDRESS

function CreateBounty({connectBtnText, chainId}) {
    const [request, setRequest] = useState('')
    const [date, setDate] = useState(0)
    const [time, setTime] = useState(0)
    const [stake, setStake] = useState(0)
    const navigate = useNavigate()

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const deadlineTime = Date.parse(date + ' ' + time);
        const currentTime = Date.now()
        const timeToDeadline = Math.floor((deadlineTime-currentTime)/1000)

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const creatingBounty = await bountyFactory.createBounty(request, timeToDeadline, {value: ethers.utils.parseEther(stake.toString())})
        await creatingBounty.wait()
        const index = (await bountyFactory.getNumBounties())-1
        navigate(`/bounty/${index}`, {replace: true })
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <div style={{ display: 'flex', justifyContent: 'center'}}>
                    <Card style={{ marginTop: '40px', width: '400px', marginBottom: '40px' }}>
                        <Card.Body>
                            <Card.Title>Create Bounty Form</Card.Title>
                            <Form onSubmit={onSubmitForm}>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Label>Request</Form.Label>
                                    <Form.Control type="text" value={request} onChange={({target}) => setRequest(target.value)}></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Label>Deadline Date</Form.Label>
                                    <Form.Control type="date" value={date} onChange={({target}) => setDate(target.value)}></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Label>Deadline Time</Form.Label>
                                    <Form.Control type="time" value={time} onChange={({target}) => setTime(target.value)}></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Label>Amount to stake</Form.Label>
                                    <Form.Control type="number" value={stake} onChange={({target}) => setStake(target.value)}></Form.Control>
                                </Form.Group>
                                    <Button type="submit">Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </div>
                <Button onClick={() => navigate(-1)}><span className="material-symbols-outlined">arrow_back</span></Button>
            </ConnectWallet>
        </Container>
    )
}

export default CreateBounty;