import metamaskLogo from '../MetaMask_Fox.svg.png';
import hardhatLogo from '../hardhat-logo-888739EBB4-seeklogo.com.png'

function ConnectWallet({chainId, connectBtnText, children}) {
    const localhostChainId = '0x539';
    const goerliChainId = '0x5';

    if (connectBtnText === 'Connect Wallet') {
        return (
            <div style={{ textAlign: 'center', paddingTop: '40px'}}>
                <h1>Please Connect Wallet</h1>
                <img src={metamaskLogo} alt="Metamask logo" style={{ width: '200px'}}/>
            </div>
            
        )
    } else if (chainId !== localhostChainId && process.env.REACT_APP_CHAIN === 'localhost') {
        return (
            <div style={{ textAlign: 'center', paddingTop: '40px'}}>
                <h1>Please Connect to Hardhat Local</h1>
                <img src={hardhatLogo} alt="Hardhat logo" style={{ width: '200px', paddingTop: '20px'}}/>
            </div>
        )
    } else if (chainId !== goerliChainId && process.env.REACT_APP_CHAIN === 'goerli') {
        return (
            <div style={{ textAlign: 'center', paddingTop: '40px'}}>
                <h1>Please Connect to Goerli</h1>
                <img src={hardhatLogo} alt="Hardhat logo" style={{ width: '200px', paddingTop: '20px'}}/>
            </div>
        )
    } else {
        return (
            <>{children}</>
        )
    }
}

export default ConnectWallet;