import { useParams } from 'react-router-dom'
import { Container, Card, Form, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet'
import { ethers } from 'ethers' 
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useEffect, useState } from 'react'

const bountyFactoryAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'

function VideoUpload({ connectBtnText, chainId }){
    const { id } = useParams()
    const [request, setRequest] = useState('')
    const [selectedVideo, setSelectedVideo ] = useState('')

    const getRequest = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const bountyAddress = await bountyFactory.bounties(id)
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const request = (await bounty.request()).toString()
        setRequest(request)
    }

    useEffect(() => {
        getRequest()
    },[])

    const handleFileInput = (e) => {
        setSelectedVideo(e.target.files[0])
    }

    const onSubmitForm = (e) => {
        e.preventDefault()

        console.log(selectedVideo)
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <Card style={{ marginTop: '20px' }}>
                    <Card.Body>
                        <Card.Title>Video Upload For: {request}</Card.Title>
                        <Form onSubmit={onSubmitForm}>
                            <Form.Group className="mb-3" controlId="request">
                                <Form.Control type="file" onChange={handleFileInput}></Form.Control>
                            </Form.Group>
                            <Button type="submit">Submit</Button>
                        </Form>
                    </Card.Body>
                </Card>
            </ConnectWallet>
        </Container>
    )
}

export default VideoUpload;