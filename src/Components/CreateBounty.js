import { Container, Form, Card, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet';
import { useState } from 'react'

function CreateBounty({connectBtnText, chainId}) {
    const [request, setRequest] = useState('')
    const [date, setDate] = useState(0)
    const [time, setTime] = useState(0)
    const [stake, setStake] = useState(0)


    const onSubmitForm = (e) => {
        e.preventDefault()

        const deadlineTime = Date.parse(date + ' ' + time);
        const currentTime = Date.now()
        console.log(deadlineTime, currentTime)
        console.log((deadlineTime-currentTime)/60000)
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <Card>
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
            </ConnectWallet>
        </Container>
    )
}

export default CreateBounty;