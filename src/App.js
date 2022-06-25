import Home from './Components/Home'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';

function App() {
  const [connectBtnText, setConnectBtnText] = useState('Connect Wallet')
  const [chainId, setChainId] = useState('')
  
  useEffect(() => {
    window.ethereum.request({ method: 'eth_chainId'})
      .then((chainId) => setChainId(chainId))
      .catch((err) => console.log(err))

    window.ethereum.on('accountsChanged', async (accounts) => {
      setConnectBtnText(accounts[0].slice(0,8) + '...')
    })

    window.ethereum.on('chainChanged', (chainId) => {
      setChainId(chainId)
    })
  }, [])

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home connectBtnText={connectBtnText} setConnectBtnText={setConnectBtnText} chainId={chainId} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
