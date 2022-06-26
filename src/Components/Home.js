import ConnectWallet from './ConnectWallet'
import Container from 'react-bootstrap/Container'
import BountyHomepage from './Bounty'
import { ethers } from 'ethers'
import BountyFactory from '../artifacts/contracts/BountyFactory.sol/BountyFactory.json'
import { Button } from 'react-bootstrap'

const bountyFactoryAddress = '0x5FbDB2315678afecb367f032d93F642f64180aa3'

function Home({ connectBtnText, chainId }) {
    const getBounty = async () => {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const bountyFactory = new ethers.Contract(bountyFactoryAddress, BountyFactory.abi, signer)
        const numBounties = (await bountyFactory.numBounties()).toNumber()
        console.log(numBounties)
        // const bountyAddresses = (await bountyFactory.bounties(0))
        // console.log(bountyAddresses)
    }

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <div>Welcome Home</div>
                <Button onClick={getBounty}>Get Bounties</Button>
            <BountyHomepage bountyAddress="0xa16E02E87b7454126E5E10d957A927A7F5B5d2be" connectBtnText={connectBtnText} chainId={chainId} />
            </ConnectWallet>
        </Container>
    )
}

export default Home;