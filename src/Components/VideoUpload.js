import { useParams } from 'react-router-dom'
import { Container, Card, Form, Button } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet'
import { ethers } from 'ethers' 
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useEffect, useState } from 'react'
import { getUploadUrl, uploadVideo } from '../livepeer.js'

const bountyFactoryAddress = '0x9A676e781A523b5d0C0e43731313A708CB607508'

function VideoUpload({ index, connectBtnText, chainId }){
    const [selectedVideo, setSelectedVideo ] = useState('')

    const handleFileInput = (e) => {
        setSelectedVideo(e.target.files[0])
    }

    const onSubmitForm = async (e) => {
        e.preventDefault()
        
        await getUploadUrl()
            .then(async data => {
                console.log(data)

                const playbackId = data.asset.playbackId
                const videoUrl = "https://livepeercdn.com/asset/"+playbackId+"/video"

                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
                const bountyAddress = await bountyFactory.bounties(index)
                const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
                console.log(videoUrl)
                const createVideo = await bounty.upload(videoUrl)
                await createVideo.wait()

                uploadVideo(data.url, selectedVideo)
                    .then(data => {
                        console.log(data); // JSON data parsed by `data.json()` call
                    });
        });

        console.log(selectedVideo)
        // window.location.reload()
    }

    return (
        <Card style={{ marginTop: '20px' }}>
            <Card.Body>
                <Card.Title>Video Upload</Card.Title>
                <Form onSubmit={onSubmitForm}>
                    <Form.Group className="mb-3" controlId="request">
                        <Form.Control type="file" onChange={handleFileInput}></Form.Control>
                    </Form.Group>
                    <Button type="submit">Submit</Button>
                </Form>
            </Card.Body>
        </Card>
    )
}

export default VideoUpload;