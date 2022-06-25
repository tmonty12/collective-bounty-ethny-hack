import { useState, useEffect } from 'react'
import { Button, Container, Navbar, Nav } from 'react-bootstrap'

function Menu({connectBtnText, setConnectBtnText}) {
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
      <Nav.Link>
        <Button onClick={requestAccount}>Create Bounty</Button>
      </Nav.Link>);
    }
  }

  return (
    <>
      <Navbar bg="light" variant="light">
        <Container>
          <Navbar.Brand>Name here</Navbar.Brand>
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
