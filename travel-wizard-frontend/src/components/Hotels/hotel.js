import { useLocation } from 'react-router-dom';
import styles from "./hotel.module.css";
import Button from 'react-bootstrap/Button';
import React, { useState,useEffect,useLayoutEffect } from 'react';
import axiosInstance from '../../API/axiosInstance';
import {useHotelCartState, useUserState} from '../../globalState/globalState';
import Modal from 'react-bootstrap/Modal';
import Form from 'react-bootstrap/Form';
// import {  } from 'react';

const currencies = [
    { name: "USD", rate: 1 },
    { name: "INR", rate: 75.23 },
    { name: "EUR", rate: 0.82 },
    { name: "JPY", rate: 109.99 },
    { name: "CAD", rate: 1.25 },
    { name: "AUD", rate: 1.31 },

  ];

function Hotel() {
    
    const location = useLocation();
    const { hotel, checkIn, checkOut } = location.state;
    
    
    const formattedLoremIpsum = "\tLorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Aenean sed adipiscing diam donec adipiscing tristique risus nec. Varius vel pharetra vel turpis nunc eget lorem dolor. Orci eu lobortis elementum nibh tellus molestie. Vulputate mi sit amet mauris commodo. Duis convallis convallis tellus id interdum velit laoreet id donec. Pellentesque pulvinar pellentesque habitant morbi. Dolor sit amet consectetur adipiscing elit pellentesque habitant morbi tristique. Aliquam malesuada bibendum arcu vitae elementum curabitur. Tincidunt arcu non sodales neque sodales ut etiam. Arcu bibendum at varius vel pharetra vel. Sagittis purus sit amet volutpat consequat mauris nunc.\n\n\tDui vivamus arcu felis bibendum ut. Mattis nunc sed blandit libero volutpat sed cras ornare arcu. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. A diam sollicitudin tempor id eu nisl nunc mi ipsum. At augue eget arcu dictum. Volutpat est velit egestas dui id ornare arcu odio. Etiam erat velit scelerisque in dictum non consectetur. Condimentum id venenatis a condimentum vitae sapien pellentesque habitant. Lobortis elementum nibh tellus molestie nunc non blandit massa enim. Morbi quis commodo odio aenean sed adipiscing diam donec adipiscing. Imperdiet dui accumsan sit amet nulla facilisi morbi tempus. Amet risus nullam eget felis. Amet justo donec enim diam. Placerat in egestas erat imperdiet sed euismod.";
    const [isSaved,setSaved] = useState([]);
    const [isBooked,setBooked] = useState([]);
    const [show, setShow] = useState(false);
    const [creditConfirmed, setCreditConfirmed] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(hotel.rooms[0]);
    const [cardNumber, setCardNumber] = useState('');
    const [month, setMonth] = useState('');
    const [year, setYear] = useState('');
    const [cvv, setCvv] = useState('');
	const {hotelCart,setHotelCart} = useHotelCartState();
    const [showSelect,setShowSelect] = useState(false);
    const [rating,setRating] = useState(3);
    const [comment,setComment] = useState("");
    const {user,setUser} = useUserState();
    const [selectedCurrency, setSelectedCurrency] = useState(currencies[0]);

    console.log(hotel);
    // useEffect(()=>{
    //     // if(!(hotel.rooms[0].roomType instanceof String)) {
    //     //     return ;
    //     // }
        
    //     for(let i=0; i<hotel.rooms.length; i++) {
    //         axiosInstance.get(`roomType/${hotel.rooms[i].roomType}`).then((response)=>{
    //             console.log(response);
    //             hotel.rooms[i].roomType = response.data.roomType;
    //         }).catch((error)=>{
    //             console.log(error);
    //         })
    //     }
    //     // console.log(hotel.rooms[0]);
    //     setShowSelect(true);
    //     // setRoomType(false);
    // },[getRoomType]);
    const postReview = async (e)=>{
        e.preventDefault();
        if(!user.fn){
            alert("You must login first to post review");
            return ;
        }
        try{
            let {data:res} = await axiosInstance.post(`hotels/review/${hotel._id}`,{username:user.fn,comment:comment,rating:rating});
            console.log(res);
            if(res.status!=200){
                throw new Error(res.message);
            }
            hotel.reviews.push(res.newReview);
        }catch(e){
            console.log(e);
        }
    }
    const save = async (e) => {
        e.preventDefault();
        console.log("SELETEDDD RROOOOMMMM ");
        console.log(selectedRoom);
        console.log(`saving:
          hotelID: ${hotel._id},
          roomID: ${selectedRoom._id},
          start date: ${checkIn},
          end date: ${checkOut},
          `);
        try{
            // TODO: save to itenerary, we need hotelId, roomId thats selected, startDate and endDate.
            const {data:res} = await axiosInstance.post("cart/hotels", {
                hotelId: hotel._id,
                roomId: selectedRoom._id,
                startDate: checkIn.toJSON(),
                endDate: checkOut,
              });
            if(res.status!=200){
                throw new Error(res.message)
            }
            setHotelCart(res.hotelCart);
            console.log("done");
            setSaved(69);
        }catch(e){
          console.log(e);
        }
    }

    const book = async (e) => {
        e.preventDefault();
        console.log(`Booking:
          hotelID: ${hotel._id},
          roomID: ${selectedRoom._id},
          start date: ${checkIn},
          end date: ${checkOut},
          `);
        try{
            // TODO: save to itenerary, we need hotelId, roomId thats selected, startDate and endDate.
            const {data:res} = await axiosInstance.post("book/hotels", {
                hotelId: hotel._id,
                roomId: selectedRoom._id,
                startDate: checkIn,
                endDate: checkOut,
              });
            setHotelCart(res.hotelCart);
            setBooked(69);
        }catch(e){
          console.log(e.stack);
        }
    }

    const confirmCredit = async (e) => {
        e.preventDefault();
    
        const visaRegex = /^4[0-9]{12}(?:[0-9]{3})?$/;
        const mastercardRegex = /^5[1-5][0-9]{14}$/;
        const amexRegex = /^3[47][0-9]{13}$/;
        const discoverRegex = /^6(?:011|5[0-9]{2})[0-9]{12}$/;
        const cvvRegex = /^[0-9]{3}$/;
        const monthRegex = /^(0?[1-9]|1[0-2])$/;
        const yearRegex = /^[2-9][0-9]$/;
    
        const cardNumberPrefix = cardNumber.substring(0, 2);
    
        if (
            !visaRegex.test(cardNumber) &&
            !mastercardRegex.test(cardNumber) &&
            !amexRegex.test(cardNumber) &&
            !discoverRegex.test(cardNumber)
        ) {
            alert('Invalid card number');
            return;
        }
    
        if (!cvvRegex.test(cvv)) {
            alert('Invalid CVV');
            return;
        }
    
        if (!monthRegex.test(month) || !yearRegex.test(year)) {
            alert('Invalid expiration date');
            return;
        }
    
        setCreditConfirmed(true);
    }
    
    
    
    // for the booking modal
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    function displayDate(date) {
      return date.toUTCString().substring(0, 16);
    }

    var numberSelect = [];

    for (var i = 1; i <= hotel.seats; i++) numberSelect.push(i);

    // console.log("hotel rooms: " + hotel.rooms[0].roomNumber);

    return (
        <>
            <div className={styles.card}>
                {!(isSaved == 69) && <Button className={styles.card__btn} onClick={save}>Save to itinerary</Button>}
                {(isSaved == 69) && <p className={styles.saved}>Saved</p>}
                <img src={hotel.image} class={styles.card__image} />
                <h2 className={styles.card__title}>{hotel.name}</h2>
                <p className={styles.card__address}>Address: {hotel.address}</p>
                <p className={styles.card__availability}>Rooms available: (select)
                <Form.Control
                            as="select"
                            value={selectedRoom}
                            onChange={e => {
                                // console.log("e.target.value", e.target.value);
                                setSelectedRoom(e.target.value);
                            }}
                            >
                            {hotel.rooms.map(room => {
                                console.log(room);
                                return (<option value={room}>Room number {room.roomNumber}: ${room.price} (USD)/night</option>)
                            })}
                        </Form.Control>
                        Price: {selectedRoom.price} (USD)
                        </p>
                        
                <p className={styles.card__description}> 
                    {/* {formattedLoremIpsum} */}
                    {/* TODO: replace with description */}
                </p>
                {/* {!(isBooked == 69) && <Button variant="primary" className={styles.card__btn} onClick={save}>Add to Itinerary</Button>} */}
                {!(isBooked == 69) && <Button variant="primary" className={styles.card__btn} onClick={handleShow}>Book</Button>}

                <Modal show={show} onHide={handleClose}
                    size="lg"
                    aria-labelledby="contained-modal-title-vcenter"
                    centered
                    >
                    <Modal.Header closeButton>
                    <Modal.Title id="contained-modal-title-vcenter">Book your home away from home</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        {/* 
                        rooms: [ {
                            roomNumber:"001",
                            price:150,
                            hotelId:{},
                            roomReservations:[{
                                roomId:{},
                                reservationId:{
                                    guestId:{},
                                    roomReservations:[{}],
                                    totalPrice:150,
                                    startDate:new Date(4/23/23),
                                    endDate:new Date(4/30/23)
                                }
                            }],
                            roomType:{
                                description:"Queen bed, kitchen",
                                maximumOccupancy:2,
                            }
                        }],
                        */}
                        Check In: {displayDate(checkIn)}
                        <br/>
                        Check Out: {displayDate(checkOut)}
                        <br/>
                        Select a room:
                        <Form.Control
                            as="select"
                            value={selectedRoom}
                            onChange={e => {
                                // console.log("e.target.value", e.target.value);
                                setSelectedRoom(e.target.value);
                            }}
                            >
                            {hotel.rooms.map(room => {
                                return (<option>Room number {room.roomNumber}: ${room.price} (USD)/night</option>)
                            })}
                        </Form.Control>
                        Price: {selectedRoom.price} (USD)
                        <br></br> 
                        {/* <select
                            value={selectedRoom.roomNumber}
                            onChange={(e) => {
                            const selectedRoomObj = hotel.rooms.find(
                                (r) => r.roomNumber === parseInt(e.target.value)
                            );
                            setSelectedRoom(selectedRoomObj);
                            }}
                        >
                            {hotel.rooms.map((room) => (
                            <option key={room.roomNumber} value={room.roomNumber}>
                                Room number {room.roomNumber}:{" "}
                                {(room.price * selectedCurrency.rate).toFixed(2)} ({selectedCurrency.name})/night,
                                Occupancy: {room.roomType.maximumOccupancy}, {room.roomType.description}
                            </option>
                            ))}
                        </select> */}
                        <br></br>
                        <h6> Select your Currency type: </h6>
                        <select
                            value={selectedCurrency.name}
                            onChange={(e) => {
                            const selectedCurrencyObj = currencies.find(
                                (c) => c.name === e.target.value
                            );
                            setSelectedCurrency(selectedCurrencyObj);
                            }}
                        >
                            {currencies.map((c) => (
                            <option key={c.name} value={c.name}>
                                {c.name}
                            </option>
                            ))}
                        </select>
                        <br></br>
                        <br></br>
                        <p>
                            Price: {(selectedRoom.price * selectedCurrency.rate).toFixed(2)} (
                                {selectedCurrency.name})/night
                        </p>
                        {/* {error && <div className={styles.error_msg}>{error}</div>} */}
                {/* CREDIT CARD */}
                        

                        Payment:
                        
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="name" className={styles.form_label}>Full name (on the card)</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="John Van Doe"
                                    id="name"
                                    required
                                    // value={emailSharing}
                                    // onChange={(e) => setEmailSharing(e.target.value)}
                                    // autoFocus
                                />
                            </Form.Group>
                        
                            <Form.Group className="mb-3">
                                <Form.Label htmlFor="cardNumber">Card Number</Form.Label>
                                <div class="input-group">
                                    <Form.Control
                                        type="text"
                                        placeholder="Your card number"
                                        id="cardNumber"
                                        required
                                        value={cardNumber}
                                        onChange={(e) => setCardNumber(e.target.value)}
                                    />
                                    <div class="input-group-append">
                                        <span class="input-group-text text-muted">
                                                                    <i class="fa fa-cc-visa mx-1"></i>
                                                                    <i class="fa fa-cc-amex mx-1"></i>
                                                                    <i class="fa fa-cc-mastercard mx-1"></i>
                                                                </span>
                                    </div>
                                </div>
                            </Form.Group>
                                <div class="row">
                                <div class="col-sm-8">
                                    <Form.Group className="mb-3">
                                        <Form.Label><span class="hidden-xs">Expiration</span></Form.Label>
                                        <div class="input-group">
                                        <Form.Control
                                            type="number"
                                            placeholder="MM"
                                            id="month"
                                            required
                                            value={month}
                                            onChange={(e) => setMonth(e.target.value)}
                                            autoFocus
                                        />
                                        <Form.Control
                                            type="number"
                                            placeholder="YY"
                                            id="year"
                                            required
                                            value={year}
                                            onChange={(e) => setYear(e.target.value)}
                                            autoFocus
                                        />
                                        </div>
                                    </Form.Group>
                                </div>
                                <div class="col-sm-4">
                                    <div class="form-group mb-4">
                                    <label data-toggle="tooltip" title="Three-digits code on the back of your card" class={styles.add_margin_bottom}>CVV
                                                                <i class="fa fa-question-circle"></i>
                                                            </label>
                                    <input type="text" required class="form-control" value={cvv} onChange={(e) => setCvv(e.target.value)} />
                                    </div>
                                </div>
                                </div>
                                {!creditConfirmed && <button type="button" class="subscribe btn btn-primary btn-block rounded-pill shadow-sm" onClick={confirmCredit}> Confirm  </button>}
                                {creditConfirmed && <p className={styles.saved}>Confirmed</p>}
                        
                {/* CREDIT CARD end */}
                    </Modal.Body>
                    <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        Close
                    </Button>
                    <Button variant="primary" onClick={book}>
                        Book
                    </Button>
                    </Modal.Footer>
                </Modal>
                {(isBooked == 69) && <p className={styles.saved}>Booked</p>}
                <div>
                    <h2>Reveiws & Ratings</h2>
                    {hotel.reviews.map((review)=>{
                        return (
                            <div>
                                <h3>{review.author}</h3>
                                <p>Ratings:{review.rating+"/5"}</p>
                                <p>{review.comment}</p>
                            </div>
                        )
                    })}
                </div>
                <div>
                    <form onSubmit={postReview}>
                        <lable for="rating">Ratings
                            <input type="number" placeholder="3" value={rating} onChange={(e)=>setRating(e.target.value)} min="1" max="5" step="0.1"></input>
                        </lable>
                        <lable for="comment">
                            <input type="text" placeholder="Comment" required value={comment} onChange={(e)=>setComment(e.target.value)}></input>
                        </lable>
                        <button type="submit">post review</button>
                    </form>
                </div>
                </div>
                
        </>
    );
}

// hotelData = {name:hotel.name,address:hotel.address,availability:count,image:hotel.image}

export default Hotel;