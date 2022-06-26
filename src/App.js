import Home from './Components/Home.js'
import Menu from './Components/Menu.js'
import CreateBounty from './Components/CreateBounty.js'
import VideoUpload from './Components/VideoUpload.js'
import { useState, useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import BountyHomepage from './Components/Bounty.js';

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
<<<<<<< HEAD
        <Route path="/bounty/create" element={<CreateBounty connectBtnText={connectBtnText} chainId={chainId}/>}/>
        <Route path="/bounty/:id/upload" element={<VideoUpload connectBtnText={connectBtnText} chainId={chainId}/>}/>
=======
        <Route path="/bounty/create" element={ <CreateBounty connectBtnText={connectBtnText} chainId={chainId}/> }/>
        <Route path="/bounty/:index" element={<BountyHomepage connectBtnText={connectBtnText} chainId={chainId}/>} />
>>>>>>> 7f2d558dca2b7cccb360d6a9bd352c442a16fccd
      </Routes>
    </BrowserRouter>
  );
}

export default App;
