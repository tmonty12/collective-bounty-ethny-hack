import { Button, Container, Navbar, Nav } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'

function Menu({connectBtnText, setConnectBtnText}) {
  function checkIfAccountIsConnected() {
    window.ethereum.request({ method: "eth_accounts" })
    .then(async (accounts) => {
      if (accounts.length !== 0) {
        setConnectBtnText(accounts[0].slice(0,10) + '...')
      }
    })
    .catch((err) => console.log(err));
  }

  useEffect(() => {
    requestAccount()
  }, [])
  
  function requestAccount() {
    window.ethereum.request({ method: 'eth_requestAccounts' })
      .then(async (accounts) => {
        setConnectBtnText(accounts[0].slice(0,10) + '...')
      })
      .catch((err) => setConnectBtnText('Connect Wallet'))
  }

  const createBountyButton = () => {
    if (connectBtnText !== 'Connect Wallet') {
      return (
      <Link to ="/bounty/create" className="nav-link" >
        <Button>Create Bounty</Button>
      </Link>);
    }
  }

  useEffect(() => {
    checkIfAccountIsConnected();
  }, [])

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Link to="/" style={{ textDecoration: 'none' }}>
            <Navbar.Brand>Name here</Navbar.Brand>
          </Link>
          <Nav>
            {createBountyButton()}
            <Nav.Link>
              <Button onClick={requestAccount}>{connectBtnText}</Button>
            </Nav.Link>
          </Nav>
        </Container>
      </Navbar>
    </>
  );
}

export default Menu;
