import Menu from './Menu.js'
import Container from 'react-bootstrap/Container'

function Home({ connectBtnText, setConnectBtnText, chainId }) {
    const localhostChainId = '0x539';

    const renderHome = () => {
        if (connectBtnText === 'Connect Wallet') {
            return (
                <h1>Please Connect Wallet</h1>
            )
        } else if (chainId !== localhostChainId) {
            return (
                <h1>Please Connect to localhost</h1>
            )
        } else {
            return (
                <h1>Welcome Home</h1>
            )
        }
    }

    return (
        <>
            <Menu connectBtnText={connectBtnText} setConnectBtnText={setConnectBtnText} />
            <Container>
                {renderHome()}
            </Container>
        </>
    )
}

export default Home;