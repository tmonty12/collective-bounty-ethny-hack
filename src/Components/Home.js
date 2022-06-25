import ConnectWallet from './ConnectWallet'
import Container from 'react-bootstrap/Container'
import { ethers } from 'ethers'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import Bounty from '../artifacts/contracts/Bounty.sol/Bounty.json'
import { Button } from 'react-bootstrap'

const bountyFactoryAddress = '0x2279B7A0a67DB372996a5FaB50D91eAA73d2eBe6'

function Home({ connectBtnText, chainId }) {
    const getBounties = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const numBounties = (await bountyFactory.numBounties()).toNumber()
        console.log(numBounties)
        for (let i=0; i < numBounties; i++) {
            const bountyAddress = await bountyFactory.bounties(i)
            const bounty = new ethers.Contract(bountyAddress, Bounty.abi, signer)
            let deadline = (await bounty.deadline()).toNumber()
            deadline = new Date(deadline*1000)
            console.log(deadline.toString())
        }
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <div>Welcome Home</div>
                <Button onClick={getBounties}>Get Bounties</Button>
            </ConnectWallet>
        </Container>
    )
}

export default Home;