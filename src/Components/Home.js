import ConnectWallet from './ConnectWallet'
import Container from 'react-bootstrap/Container'

function Home({ connectBtnText, chainId }) {

    return (
        <Container>
            <ConnectWallet connectBtnText={connectBtnText} chainId={chainId}>
                <div>Welcome Home</div>
            </ConnectWallet>
        </Container>
    )
}

export default Home;