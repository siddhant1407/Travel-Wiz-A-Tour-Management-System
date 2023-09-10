
import styles from './itinerary.module.css';
import {useUserState, usePlaceCartState, useHotelCartState, useFlightCartState} from '../../globalState/globalState';
import Button from 'react-bootstrap/Button';
import axiosInstance from '../../API/axiosInstance';
import React, { useRef, useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
import { Link } from 'react-router-dom';
import { instanceOf } from 'prop-types';


function Itineraries() {
	const {user,setUser} = useUserState();
	const {placeCart,setPlaceCart} = usePlaceCartState();
	const {hotelCart,setHotelCart} = useHotelCartState();
	const {flightCart,setFlightCart} = useFlightCartState();
    const [emailSharing, setEmailSharing] = useState('');
    const [show, setShow] = useState(false);
    const formRef = useRef(null);
    const [validated, setValidated] = useState(false);
    const [error, setError] = useState("");
  
    // for the sharing modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const handleReset = () => {
        formRef.current.reset();
        setValidated(false);
        setEmailSharing(undefined);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try{
            console.log("ope yep mhm handling submit for sure");
            // handle it
            const { data: res } = await axiosInstance.get(`cart/share?email=${emailSharing}`);
            setValidated(true);
            handleReset();
        } catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&				//indicates a clinet side errors.
				error.response.status <= 500
			) {
				setError(error.response.data.message);		//to render error message to the user
			}
		}  

      };

    const oldDate = new Date(1500,0,1);

    if (user.ln === undefined)  {
        console.log("user not logged in");
        return (
            <>
            <div>Sorry, you must <a href='/login'>Log In</a> to use this feature.</div>
            </>
        )
    }

    // console.log(user);
    // console.log(user.ln);
    console.log("pc");
    console.log(placeCart);
    console.log("pc.places");
    console.log(placeCart.places);
    console.log("fc");
    console.log(flightCart);

    function isEmptyObject(obj) {
        // console.log("is empty?");
        // console.log(flightCart);
        // console.log(obj.user === undefined);
        for(var prop in obj) {
          // console.log(prop, obj[prop]);
          if(obj.hasOwnProperty(prop)){
            if(obj[prop] instanceof Array){
              return obj[prop].length===0
            }

          }
      }
      return true;
    }

    // Sort all the data by dates

    function ascending_date_places(a,b) { return new Date(a.visitingDate) - new Date(b.visitingDate); }
    function ascending_date_flights(a,b) { return new Date(a.date) - new Date(b.date); }
    function ascending_date_hotels_start(a,b) { return new Date(a.startDate) - new Date(b.startDate); }
    function ascending_date_hotels_end(a,b) { return new Date(a.endDate) - new Date(b.endDate); }

    // const places = placeCart.places.sort(ascending_date_places);
    const places = isEmptyObject(placeCart)? {} : placeCart.places.sort(ascending_date_places);
    const flights = isEmptyObject(flightCart)? {} : flightCart.flights.sort(ascending_date_flights);
    const hotels = isEmptyObject(hotelCart)? {} : hotelCart.hotels.sort(ascending_date_hotels_start);
    const hotelsByEnd = isEmptyObject(hotelCart)? {} : hotelCart.hotels.sort(ascending_date_hotels_end);

    const Dates = getListOfDates();

    function displayDate(date) {
        return date.toUTCString().substring(0, 16);
    }

    function datesAreSame(a,b) {
        // make sure in date format
        a = new Date(a);
        b = new Date(b);
        // set times to 0
        a.setHours(0,0,0,0);
        b.setHours(0,0,0,0);

        // compare
        return a.toDateString() === b.toDateString();
    }

    function getListOfDates() {
        const today = new Date();
        const oldDate = new Date(0);
        let startDate;
        let endDate;
        console.log(isEmptyObject(flightCart));
      
        const lengthOfCarts = (isEmptyObject(placeCart) ? 0 : placeCart.places.length) + (isEmptyObject(flightCart) ? 0 : flightCart.flights.length) + (isEmptyObject(hotelCart) ? 0 : hotelCart.hotels.length);
      
        if (lengthOfCarts === 0) {
          return [];
        } else {
          // find start date
          const splaces = isEmptyObject(placeCart) ? oldDate : new Date(placeCart.places[0].visitingDate);
          const sflights = isEmptyObject(flightCart) ? oldDate : new Date(flightCart.flights[0].date);
          const shotels = isEmptyObject(hotelCart) ? oldDate : new Date(hotelCart.hotels[0].startDate);
          const psdates = [splaces, sflights, shotels];
      
          for (let i = 0; i < 3; i++) {
            if (startDate === undefined && psdates[i] > oldDate && psdates[i] >= today) {
              startDate = psdates[i];
            } else if (psdates[i] < startDate && psdates[i] > oldDate && psdates[i] >= today) {
              startDate = psdates[i];
            }
          }
      
          // find end date
          if (lengthOfCarts === 1) {
            endDate = startDate;
          } else {
            const eplaces = isEmptyObject(placeCart) ? oldDate : new Date(placeCart.places[placeCart.places.length - 1].visitingDate);
            const eflights = isEmptyObject(flightCart) ? oldDate : new Date(flightCart.flights[flightCart.flights.length - 1].date);
            const ehotels = isEmptyObject(hotelCart) ? oldDate : new Date(hotelCart.hotels[hotelCart.hotels.length - 1].endDate);
      
            if (eplaces > eflights && eplaces > ehotels) {
              endDate = eplaces;
            } else if (eflights > eplaces && eflights > ehotels) {
              endDate = eflights;
            } else if (ehotels > eflights && ehotels > eplaces) {
              endDate = ehotels;
            }
          }
      
          startDate = new Date(displayDate(startDate));
          endDate = new Date(displayDate(endDate));
      
          const dateList = [];
      
          for (let d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
            if (d >= today) {
              dateList.push(new Date(d));
            }
          }
      
          return dateList;
        }
      }
      

    // function getListOfDates() {
    //     // console.log("getting list of dates");
    //     var startDate;
    //     var endDate;

    //     var lengthOfCarts = isEmptyObject(placeCart)? 0 : placeCart.places.length;
    //     lengthOfCarts += isEmptyObject(flightCart)? 0 : flightCart.flights.length;
    //     lengthOfCarts += isEmptyObject(hotelCart)? 0 : hotelCart.hotels.length;
    //     // console.log("caartlen " + lengthOfCarts);
    //     if(lengthOfCarts == 0) return [];

    //     else {
    //             // find start date
    //             var splaces = isEmptyObject(placeCart)? oldDate : new Date(placeCart.places[0].visitingDate);
    //             var sflights = isEmptyObject(flightCart)? oldDate : new Date(flightCart.flights[0].date);
    //             var shotels = isEmptyObject(hotelCart)? oldDate : new Date(hotelCart.hotels[0].startDate);
    //             // console.log("splaces " + splaces +"shotels " + shotels +"sflights " + sflights);
    //             var psdates = [splaces, sflights, shotels];
    //             for (var i = 0; i < 3; i++) {
    //                 if (startDate === undefined && psdates[i] > oldDate) startDate = psdates[i];
    //                 else if (psdates[i] < startDate && psdates[i] > oldDate) startDate = psdates[i];
    //             }
    //             // // find end date
    //             if (lengthOfCarts == 1) endDate = startDate;
    //             else {    
    //                 var eplaces = isEmptyObject(placeCart)? oldDate : new Date(placeCart.places[placeCart.places.length - 1].visitingDate);
    //                 var eflights = isEmptyObject(flightCart)? oldDate : new Date(flightCart.flights[flightCart.flights.length - 1].date);
    //                 var ehotels = isEmptyObject(hotelCart)? oldDate : new Date(hotelCart.hotels[hotelCart.hotels.length - 1].endDate);
    //                 // console.log("eplaces", eplaces);
    //                 // console.log("~~eplaces", new Date(placeCart.places[placeCart.places.length - 1].visitingDate));
    //                 if (eplaces > eflights && eplaces > ehotels) endDate = eplaces;
    //                 else if (eflights > eplaces && eflights > ehotels) endDate = eflights;
    //                 else if (ehotels > eflights && ehotels > eplaces) endDate = ehotels;
    //             }

    //         startDate = new Date(displayDate(startDate));
    //         endDate = new Date(displayDate(endDate));
    //         // // console.log("feeeeeeeep" + ((new Date(1,3,2020)) < (new Date(1,4,2020))));
    //         // console.log("FOOOOOOpppp" + (shotels < sflights && shotels < splaces));
    //         // console.log("start date " + startDate + "\nEnddate " + endDate);
            
    //         var dateList = [];
    //         for (var d = startDate; d <= endDate; d.setDate(d.getDate() + 1)) {
    //             dateList.push(new Date(d));
    //         }
    //         // console.log("Date list: " + dateList);
    //         return dateList;
    //     }
    // }

    const removeFlightItinerary = async (e)=>{
      try{
        const {data:res} = await axiosInstance.delete(`cart/flights/${e.target.id}?id=${user._id}`);
        console.log(res);
        setFlightCart(res.flightCart);
        window.location.reload(false);
      }catch(e){
        console.log(e);
      }
    }

    function findFlightByDate(date) {
        date = new Date(date);
        date = new Date(displayDate(date));
        if (isEmptyObject(flightCart)) {
            // console.log("this bitch empty; YEET");
            // return <div><p>bitch is empty</p></div>;
            return <></>;
        }
        return (flights.map(flight => {
            // console.log("bitch NOT empty");
            const theysame = datesAreSame(flight.date, date);
            if (theysame) {
                // setCurrFlight(flight);
                // const flightDate = new Date(flight.date);
                return (
                    <div className={styles.card__description}>
                        <p>Flight to: {flight.flight.destination} from {flight.flight.source}</p>
                        <button onClick={removeFlightItinerary} className={styles.card__btn} id={flight.flight._id}>Remove</button>

                    </div>
                );
            }
            else {
                // console.log("dates NOT same");
                return (
                    <></>
                );
            }

        }))
    }
    function findhotelsByDate(date) {
        date = new Date(date);
        date = new Date(displayDate(date));
        console.log(hotels);
        if (isEmptyObject(hotelCart)) {
            // console.log("this bitch empty; YEET");
            // return <div><p>bitch is empty</p></div>;
            return <></>;
        }
        return (hotels.map(hotel => {
            console.log("bitch NOT empty");
            const theysame = datesAreSame(hotel.startDate, date);
            console.log(theysame);
            if (!theysame) {
                // console.log("dates are same");
                console.log(theysame);
                console.log(hotel);
                // const hotelDate = new Date(hotel.date);
                return (
                    <div className={styles.card__description}>
                        <p>Name: {hotel.hotel.name}
                        <br/> Address: {hotel.hotel.address}</p>
                    </div>
                );
            }
            else {
                // console.log("dates NOT same");
                return (
                    <></>
                );
            }

        }))
    }

    function findPlaceByDate(date) {
        date = new Date(date);
        // console.log("DAAATTTEEE " + date)
        date = new Date(displayDate(date));
        // console.log("fmll " + date);
        if (isEmptyObject(placeCart)) {
            // console.log("this place cart empty; YEET");
            // return <div><p>bitch is empty</p></div>;
            return <></>;
        }
        return (places.map(place => {
            // console.log("bitch NOT empty");
            var placeDate = new Date(place.visitingDate);
            placeDate = new Date(displayDate(placeDate));
            const theysame = datesAreSame(placeDate, date);
            // console.log("fmfbgmm " + placeDate);
            if (theysame) {
                // console.log("dates are same");
                // console.log(theysame);
                return (
                    <><div className={styles.card__description}>
                    <h2 className={styles.card__title}>{place.place.name}</h2>
                  </div><div className={styles.card__btns}>
                      <Link to="/flights">
                        <button className={styles.card__btn}>Book Flights</button>
                      </Link>
                      <Link to="/hotels">
                        <button className={styles.card__btn}>Book Hotels</button>
                      </Link>
                      <button onClick={removePlaceItinerary} className={styles.card__btnr} id={place.place._id}>Remove</button>

                    </div></>
                );
            }
            else {
                // console.log("dates NOT same");
                return (
                    <></>
                );
            }

        }))
    }
    const removePlaceItinerary = async (e)=>{
      console.log(`cart/places/${e.target.id}?id=${user._id}`);

      try{
        const {data:res} = await axiosInstance.delete(`cart/places/${e.target.id}?id=${user._id}`);
        // console.log(res);
        setPlaceCart(res.placeCart);
        window.location.reload(false);
      }catch(e){
        console.log(e);
      }
    }

    //____________________________________________________________________________________________________________


    if (Dates.length === 0) {
    //   console.log("none");
      return (<div><h1>No results.</h1></div>)
    }
    else {
        // console.log("trying dates");
        return (
        <>
            <Button variant="primary" onClick={handleShow} className={styles.card__btn}>
                Share this itinerary
            </Button>

            <Modal show={show} onHide={handleClose}
                size="lg"
                aria-labelledby="contained-modal-title-vcenter"
                centered
                >
                <Modal.Header closeButton>
                <Modal.Title id="contained-modal-title-vcenter">Share with your fellow travelers!</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Form ref={formRef}  validated={validated}>
                        <Form.Group className="mb-3">
                            <Form.Label htmlFor="emailSharing">Email address</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="name@example.com"
                                id="emailSharing"
                                value={emailSharing}
                                onChange={(e) => setEmailSharing(e.target.value)}
                                autoFocus
                            />
                        </Form.Group>
                    </Form>
                    {error && <div className={styles.error_msg}>{error}</div>}
                </Modal.Body>
                <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
                <Button variant="primary" onClick={handleSubmit}>
                    Share
                </Button>
                </Modal.Footer>
            </Modal>
            <div className={styles.wrapper}>
                {Dates.map(date =>   {
                    return (
                        
                        <Card
                            date = {date}
                        /> 
                        
                    )
                }
                )}
            </div>
        </>
        );
    }
    
    function Card(props) {
      console.log('card');
      const place = findPlaceByDate(props.date);
      const flight = findFlightByDate(props.date);
      const hotel = findhotelsByDate(props.date)
    
      let cardContent;
      if (place || flight) {
        cardContent = (
          <>
      
            {place}
            
            {flight}
            {hotel}
            
          </>
        );
      }
    
      return (
        <div className={styles.card}>
          <div className={styles.card__body}>
            <p className={styles.card__date}>{displayDate(props.date)}</p>
            {cardContent}
          </div>
        </div>
      );
    }
    
}

export default Itineraries;