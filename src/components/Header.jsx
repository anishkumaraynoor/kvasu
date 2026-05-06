import React from 'react'
import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { Link } from 'react-router-dom';

function Header() {
  return (
    <>
         <Navbar expand="sm" className="bg-primary">
      <Container>
        <Navbar.Brand ><Link style={{textDecoration:'none', color:'white'}} to={'/'}><img src='/kvasu.jpeg' width={35} height={35}></img>College of Veterinary and Animal Sciences, Mannuthy</Link></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />        
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    </>
  )
}

export default Header