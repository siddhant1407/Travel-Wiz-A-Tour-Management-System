// import Autocomplete from '@mui/material/Autocomplete';
import React from 'react';
import Container from 'react-bootstrap/Container';

import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import Offcanvas from 'react-bootstrap/Offcanvas';
import logo from '../Images/logo.gif';
import axiosInstance from '../../API/axiosInstance';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
// import Stack from '@mui/material/Stack';
// import TextField from '@mui/material/TextField';
import './navbar.module.css'
// this import is required to use global state
import {useUserState, usePlaceCartState, useHotelCartState, useFlightCartState} from '../../globalState/globalState';
import { useNavigate } from 'react-router-dom';


const NavigationBar = React.memo(()=> {
  //use these following 4 lines to get access to global state, this is similar to useState()
  const {user, setUser} = useUserState();
  const {placeCart,setPlaceCart} = usePlaceCartState();
	const {hotelCart,setHotelCart} = useHotelCartState();
	const {flightCart,setFlightCart} = useFlightCartState();
	const navigate = useNavigate();

  console.log(user);
  console.log(placeCart);
  console.log(hotelCart);
  console.log(flightCart);
  const UserDetails = ()=>{
    if(user.verified){
      return (
        <NavDropdown.Item as={Navbar.Text}>
            <div>
              <Navbar.Text style={{fontSize:20,color:"black"}}>{user.ln}</Navbar.Text>
              <VerifiedUserIcon style={{color:"blue"}}/>
            </div>
        </NavDropdown.Item>
      );
    }else{
      return (
        <NavDropdown.Item as={Navbar.Text}>
            <div>
              <Navbar.Text style={{fontSize:20,color:"black"}}>{user.ln}</Navbar.Text>
            </div>
            <p>User is not verified</p>
        </NavDropdown.Item>
      )
    }
  }
  const DropDown = ()=>{
    
      const logout=async (event)=>{
        event.preventDefault();
        console.log("app logout");
        try{
          console.log("user logout");
          let response = await axiosInstance.get('/logout');
          if(response.status===200){
            setUser({});
            setFlightCart({});
            setHotelCart({});
            setPlaceCart({});
          }else{
            throw new Error("Error occured");
          }
        }catch(err){
          console.log(err.stack);
        }
        navigate("/");
        window.location.reload(false);
      }
      if(JSON.stringify(user)===JSON.stringify({})){
      return (
        <NavDropdown
          title="Account"
          id={`offcanvasNavbarDropdown-expand-${'lg'}`}
        >
          {/* when already signed in these should say "Your Info" "Sign out" and "Settings" */}
          <NavDropdown.Item href="/login">Log In</NavDropdown.Item>
          <NavDropdown.Item href="/signup">
            Sign In
          </NavDropdown.Item>
        </NavDropdown>
      );
    }else{
      return(
        <NavDropdown
          title={<AccountCircleIcon/>}
          id={`offcanvasNavbarDropdown-expand-${'lg'}`}
        >
          {/* when already signed in these should say "Your Info" "Sign out" and "Settings" */}
          <UserDetails/>
          <NavDropdown.Item onClick={logout}>
            Log out
          </NavDropdown.Item>
          <NavDropdown.Divider />
          <NavDropdown.Item href="/settings">
            Settings
          </NavDropdown.Item>
        </NavDropdown>
      )
    }
  }
    return (
      <>
        <head>
          <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.1.3/dist/css/bootstrap.min.css" integrity="sha384-1BmE4kWBq78iYhFldvKuhfTAU6auU8tT94WrHftjDbrCEXSU1oBoqyl2QvZ6jIW3" crossorigin="anonymous"/>
        </head>
        <Navbar bg="dark" variant="dark">
          <Container>
          <Navbar.Brand href="/">
          <img src={logo} 
              width="30"
              height="30"
              className="d-inline-block align-top" />{' '}
            Travel Wizard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-${'lg'}`} />
            <Navbar.Offcanvas
              id={`offcanvasNavbar-expand-${'lg'}`}
              aria-labelledby={`offcanvasNavbarLabel-expand-${'lg'}`}
              placement="end"
            >
              <Offcanvas.Header closeButton>
                <Offcanvas.Title id={`offcanvasNavbarLabel-expand-${'lg'}`}>
                  Offcanvas
                </Offcanvas.Title>
              </Offcanvas.Header>

              <Offcanvas.Body>
                <Nav className="justify-content-end flex-grow-1 pe-3">
                  <NavDropdown title="Your Itinerary" id={`offcanvasNavbarDropdown-expand-${'lg'}`}>
                    <NavDropdown.Item href="/itinerary">My Itinerary</NavDropdown.Item>
                    <NavDropdown.Item href="/itinerary">Shared Itinerary</NavDropdown.Item>
                  </NavDropdown>
                  {/* <Nav.Link href="/itinerary">Your Itinerary</Nav.Link> */}
                  <Nav.Link href="/flights">Flights</Nav.Link>
                  <Nav.Link href="/hotels">Hotels</Nav.Link>
                  <DropDown></DropDown>
                </Nav>
              </Offcanvas.Body>
            </Navbar.Offcanvas>
        </Container>
        </Navbar>
      </>
      );
  })
  
  export default NavigationBar;