import Home from './Components/Home.js'
import Menu from './Components/Menu.js'
import CreateBounty from './Components/CreateBounty.js'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BountyPage from './Components/BountyPage.js';
import Stake from './Components/Stake.js'
import Upload from './Components/Upload.js'
import PageNotFound from './Components/PageNotFound.js'

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
      <Menu connectBtnText={connectBtnText} setConnectBtnText={setConnectBtnText} />
      <Routes>
        <Route path="/" element={<Home connectBtnText={connectBtnText} chainId={chainId} />} />
        <Route path="/bounty/create" element={<CreateBounty connectBtnText={connectBtnText} chainId={chainId}/>}/>
        <Route path="/bounty/:index" element={<BountyPage connectBtnText={connectBtnText} chainId={chainId}/>} />
        <Route path="/bounty/:index/stake" element={<Stake connectBtnText={connectBtnText} chainId={chainId}/>} />
        <Route path="/bounty/:index/upload" element={<Upload connectBtnText={connectBtnText} chainId={chainId}/>} />
        <Route path="*" element={<PageNotFound/>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
