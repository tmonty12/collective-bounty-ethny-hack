function ConnectWallet({chainId, connectBtnText, children}) {
    const localhostChainId = '0x539';

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
            <>{children}</>
        )
    }
}

export default ConnectWallet;