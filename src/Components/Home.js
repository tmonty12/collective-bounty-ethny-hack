import ConnectWallet from './ConnectWallet'
import { Container, Card } from 'react-bootstrap'
import { ethers } from 'ethers'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'

const bountyFactoryAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'

function Home({ connectBtnText, chainId }) {
    const [bounties, setBounties] = useState([])

    const getBounties = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const numBounties = (await bountyFactory.numBounties()).toNumber()
        let bounties = []
        for (let i=0; i < numBounties; i++) {
            const bountyAddress = await bountyFactory.bounties(i)
            const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
            let deadline = (await bounty.deadline()).toNumber()
            const options = { day: '2-digit', year: 'numeric', month: '2-digit', hour:'2-digit', minute: '2-digit'}
            deadline = (new Date(deadline*1000)).toLocaleDateString('en-US', options)
            const request = (await bounty.request()).toString()
            const balance = parseInt((await bounty.getBalance()).toString()) / (10**18)

            bounties.push(
                <Link to={`/bounty/${i}`} style={{ textDecoration: 'none', color: 'black'}}>
                    <Card style={{ marginTop: '20px' }}>
                        <Card.Body>
                            <Card.Title>
                                {request}
                            </Card.Title>
                            <div><strong>Deadline: </strong>{deadline}</div>
                            <div><strong>Current Stake: </strong>{balance} ETH</div>
                        </Card.Body>
                    </Card>
                </Link>
            )
        }
        setBounties(bounties)
    }

    useEffect(() => {
        getBounties()
    }, [])

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                {bounties}
            </ConnectWallet>
        </Container>
    )
}

export default Home;