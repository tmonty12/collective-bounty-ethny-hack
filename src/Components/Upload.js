import { useParams, useNavigate } from 'react-router-dom'
import { Container, Card, Form, Button, Spinner } from 'react-bootstrap'
import ConnectWallet from './ConnectWallet'
import { ethers, utils } from 'ethers' 
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useEffect, useState } from 'react'
import { getUploadUrl, uploadVideo, retrieveAsset } from '../livepeer.js'
import { sleep } from '../utils.js'

const bountyFactoryAddress = process.env.REACT_APP_BOUNTY_FACTORY_ADDRESS

function Upload({ connectBtnText, chainId }){
    const [selectedVideo, setSelectedVideo ] = useState('')
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [isUploading, setIsUploading] = useState(false)
    const [bounty, setBounty] = useState(null)
    const [title, setTitle] = useState('')
    const [bountyDNE, setBountyDNE] = useState(false)
    const {index} = useParams()
    const navigate = useNavigate()

    const handleFileInput = (e) => {
        setSelectedVideo(e.target.files[0])
    }

    const checkBountyExists = async () =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)

        if (index < 0 || index >= (await bountyFactory.getNumBounties()).toNumber()){
            setBountyDNE(true)
        }
    }

    useEffect(() => {
        checkBountyExists()
        // check if already submitted video
        window.ethereum.request({ method: "eth_accounts" }).then(async (accounts) => {
            if (accounts.length !== 0) {
                const currentAddress = utils.getAddress(accounts[0]);
                const provider = new ethers.providers.Web3Provider(window.ethereum)
                const signer = provider.getSigner()
                const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
                const bountyAddress = await bountyFactory.bounties(index)
                const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
                setBounty(bounty)
                setHasSubmitted(parseInt((await bounty.videoSubmissions(currentAddress))) === 1)
            }
        })
    }, [])

    const onSubmitForm = async (e) => {
        e.preventDefault()

        if (hasSubmitted === false) {
            await getUploadUrl(title)
            .then(async data => {
                const assetId = data.asset.id
                const createVideo = await bounty.uploadVideo(assetId, title)
                await createVideo.wait()
                
                
                setIsUploading(true)
                uploadVideo(data.url, selectedVideo)
                    .then(async data => {
                        let doneUploading = false
                        while (!doneUploading) {
                            const res = await retrieveAsset(assetId);
                            if (res.status.phase === 'ready') {
                                doneUploading = true;
                            }
                            await sleep(1000)
                        }
                        navigate(`/bounty/${index}`, {replace: true })
                    })
            });
        }
    }

    const renderBody = () => {
        if (bountyDNE) {
            return  (
                <div style={{ textAlign: 'center', marginTop: '40px'}}>
                    <h1>Bounty does not exist</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>block</span>
                </div>
            )
        } else if (hasSubmitted) {
            return  (
                <div style={{ textAlign: 'center', marginTop: '40px'}}>
                    <h1>You have already submitted a video</h1>
                </div>
            )
        } else if (isUploading) {
            return  (
                <div style={{ textAlign: 'center', marginTop: '40px'}}>
                    <Spinner animation='border' role='status'>
                        <span className='visually-hidden'>Loading...</span>
                    </Spinner>
                </div>
            )
        } else {
            return (
                    <Card style={{ marginTop: '20px' }}>
                        <Card.Body>
                            <Card.Title>Video Upload</Card.Title>
                            <Form onSubmit={onSubmitForm}>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Label>Title</Form.Label>
                                    <Form.Control type="text" value={title} onChange={({target}) => setTitle(target.value)}></Form.Control>
                                </Form.Group>
                                <Form.Group className="mb-3" controlId="request">
                                    <Form.Control type="file" onChange={handleFileInput}></Form.Control>
                                </Form.Group>
                                <Button type="submit" onSubmit={onSubmitForm}>Submit</Button>
                            </Form>
                        </Card.Body>
                    </Card>
            )
        }
    }

    const renderBackButton = () => {
        if (isUploading || bountyDNE || hasSubmitted) {
            return <></>
        } else {
            return <Button onClick={() => navigate(-1)}><span className="material-symbols-outlined">arrow_back</span></Button>
        }
    }

    return (
        <Container>
            <div style={{ display: 'flex', justifyContent: 'center'}}>
                <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                    {renderBody()}  
                </ConnectWallet>
            </div>
            {renderBackButton()}
        </Container>
    )
}

export default Upload;