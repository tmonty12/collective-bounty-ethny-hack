import { ethers, utils } from 'ethers'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useState, useEffect } from 'react'
import { Badge, Button, Card, Container } from 'react-bootstrap'


function Videos({ bountyAddress }) {
    const [videos, setVideos] = useState([])
    const [hasVoted, setHasVoted] = useState(false);

    async function vote(index) {
        // can only vote for one video right now
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const createVote = await bounty.vote(index)
        await createVote.wait()
    }

    const getVideos = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const videoObjects = await bounty.getVideos()
        console.log(videoObjects)
        let videos = []
        let voted = false
        for (let i=0; i < videoObjects.length; i++) {
            await window.ethereum.request({ method: "eth_accounts" })
            .then(async (accounts) => {
            if (accounts.length !== 0) {
                const currentAddress = utils.getAddress(accounts[0]);
                const voters = videoObjects[i].voterAddresses
                voted = voters.includes(currentAddress)
                setHasVoted(true)
            }
            })
            videos.push(
                <Card style={{ marginTop: '20px' }}>
                    <Card.Body>
                        <Card.Title>
                            <a href={videoObjects[i].assetLink}>{videoObjects[i].assetLink}</a>
                        </Card.Title>
                        {voted && <Badge bg="success">Voted</Badge>}
                        {!voted && hasVoted && <div>You have already voted for another video.</div>}
                        {!voted && !hasVoted && <Button onClick={() => vote(i)}>Vote for this video</Button>}
                    </Card.Body>
                </Card>
            )
        }
        setVideos(videos)
    }

    useEffect(() => {
        getVideos()
    }, [])

    return (
        <Container>
            {videos}
        </Container>
    )
}

export default Videos;