import { Container, Form, Card, Button } from 'react-bootstrap'
import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useNavigate, useParams, Link } from 'react-router-dom'
import ConnectWallet from './ConnectWallet'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'

const bountyFactoryAddress = process.env.REACT_APP_BOUNTY_FACTORY_ADDRESS

function Stake({ connectBtnText, chainId }) {
    const [stake, setStake] = useState(0)
    const [bountyDNE, setBountyDNE] = useState(false)
    const {index} = useParams()
    const navigate = useNavigate()

    const onSubmitForm = async (e) => {
        e.preventDefault()

        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const bountyAddress = await bountyFactory.bounties(index)
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const createStake = await bounty.stake({value: ethers.utils.parseEther(stake.toString())})
        await createStake.wait()
        navigate(`/bounty/${index}`, {replace: true })
    }

    const checkBountyExists = async () =>{
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)

        if (index < 0 || index >= (await bountyFactory.getNumBounties()).toNumber()){
            setBountyDNE(true)
        }
    }

    const renderBody = () => {
        if (bountyDNE) {
            return (
                <div style={{ textAlign: 'center', marginTop: '20px', marginBottom: '20px'}}>
                    <h1>Bounty does not exist</h1>
                    <span className="material-symbols-outlined" style={{ fontSize: '50px', color:'grey'}}>block</span>
                </div>
            )
        } else {
            return (
                <>
                    <div style={{ display: 'flex', justifyContent: 'center'}}>
                        <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                            <Card style={{ marginTop: '40px', width: '400px', marginBottom: '40px'}}>
                                <Card.Body>
                                    <Card.Title>Stake</Card.Title>
                                    <Form onSubmit={onSubmitForm}>
                                        <Form.Group className="mb-3" controlId="request">
                                            <Form.Label>Amount to stake</Form.Label>
                                            <Form.Control type="number" value={stake} onChange={({target}) => setStake(target.value)}></Form.Control>
                                        </Form.Group>
                                            <Button type="submit">Stake</Button>
                                    </Form>
                                </Card.Body>
                            </Card>
                        </ConnectWallet>
                    </div>
                    <Link to={`/bounty/${index}`}><Button ><span className="material-symbols-outlined">arrow_back</span></Button></Link>
                </>
           )
        }
    }

    useEffect(() => {
        checkBountyExists()
    }, [])

    return (
        <Container>
            {renderBody()}
        </Container>
    )
}

export default Stake;