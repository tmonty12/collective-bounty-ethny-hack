import ConnectWallet from './ConnectWallet'
import BountyCard from './BountyCard'
import { Container} from 'react-bootstrap'
import { ethers } from 'ethers'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import '../Home.css'

const bountyFactoryAddress = process.env.REACT_APP_BOUNTY_FACTORY_ADDRESS

function Home({ connectBtnText, chainId }) {
    const [bounties, setBounties] = useState(null)

    const displayBounties = () => {
        if (bounties === null){
            return <div></div>
        }
        else if (bounties.length >= 1) {
            return (
                <>{bounties}</>
                    
            )
        } else {
            return (
                <div style={{ textAlign: 'center', marginTop: '40px'}}>
                    <h1>No open bounties</h1>
                    <Link to="/bounty/create"><span className="material-symbols-outlined" style={{ fontSize: '50px'}}>add_box</span></Link>
                </div>
            )
        }
    }

    const onExecuteBounty = async (idx) => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const bountyAddress = await bountyFactory.bounties(idx)
        const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
        const execute = await bounty.execute()
        await execute.wait()
        getBounties()
    }

    const getBounties = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const numBounties = (await bountyFactory.getNumBounties()).toNumber()
        let bounties = []
        for (let i=0; i < numBounties; i++) {
            const bountyAddress = await bountyFactory.bounties(i)
            const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
            const executed = (await bounty.executed())
            if (executed){
                continue;
            }
            let deadline = (await bounty.deadline()).toNumber()
            const options = { day: '2-digit', year: 'numeric', month: '2-digit', hour:'2-digit', minute: '2-digit'}
            const deadlineString = (new Date(deadline*1000)).toLocaleDateString('en-US', options)
            deadline = new Date(deadline*1000)
            const request = (await bounty.request()).toString()
            const balance = parseInt((await bounty.getBalance()).toString()) / (10**18)

            bounties.push(
                <BountyCard key={i} i={i} request={request} balance={balance} deadline={deadline} deadlineString={deadlineString} onExecuteBounty={onExecuteBounty}/>
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
                {displayBounties()}
            </ConnectWallet>
        </Container>
    )
}

export default Home;