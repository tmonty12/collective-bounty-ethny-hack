import ConnectWallet from './ConnectWallet'
import Container from 'react-bootstrap/Container'
import { ethers } from 'ethers'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import { Button } from 'react-bootstrap'

const bountyFactoryAddress = '0x5FC8d32690cc91D4c39d9d3abcBD16989F875707'

function Home({ connectBtnText, chainId }) {
    const getBounty = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const numBounties = (await bountyFactory.numBounties()).toNumber()
        console.log(numBounties)
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <div>Welcome Home</div>
                <Button onClick={getBounty}>Get Bounties</Button>
            </ConnectWallet>
        </Container>
    )
}

export default Home;