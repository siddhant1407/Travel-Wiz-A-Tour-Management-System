import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import styles from "./hotelSearch.module.css"
import HotelCards from './hotelcards.js';
import axiosInstance from "../../API/axiosInstance";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
// import GooglePlacesAutocomplete from 'react-google-places-autocomplete';
import PlacesAutocomplete from 'react-google-places-autocomplete';

function HotelBooking() {
  const [location, setLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [averageRatings, setAvgRating] = useState(1);
  const [minPrice, setMinPrice] = useState(1);
  const [maxPrice, setMaxPrice] = useState(1000);
  const [data, setData] = useState([]);
  const [optionsOne, setOptionsOne] = useState([]);
  const [value, setValue] = useState("");

  const [searchData, setSearchData] = useState([]);

  var isSubmitted = false;

  const getCitiesOne = async (str) => {
    try {
      let searchableCity = str.replace(/,/g, "");
      let url = "search/" + searchableCity;

      let { data } = await axiosInstance.get(url);
      // console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };
  const onChangeOne = async (e) => {
    if (e.target.value) {
      let d = await getCitiesOne(e.target.value);
      setOptionsOne(d);
      setSearchData(d);
      console.log(data + "here");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(searchData);
    // Perform hotel search with filter criteria
    if (searchData[0]._id === undefined) {
      return;
    }
    let placeId = searchData[0]._id;
    try {
      const { data: res } = await axiosInstance.get(`hotels?placeId=${placeId}&start=${startDate}&end=${endDate}&minPrice=${minPrice}&maxPrice=${maxPrice}&rating=${averageRatings}`);
      if (res.status === 200) {
        // console.log("json!");
        console.log(res);
        setData(res.data);
        console.log("data!");
        console.log('Got itttt', res.data);
        isSubmitted = true;
        // setMessage(resJson.message);
      } else {
        // setMessage("Some error occured");
      }
      // window.location = "/hotelcards";
    } catch (err) {
      // setMessage("Some error occured");
    }
  };

  return (
    <>
      <div className={styles.hotel_bg}>
        <div className={styles.hotel_booking_container}>
          <h1>Book a Hotel</h1>
          <form onSubmit={handleSubmit}>
            <label htmlFor="location">Location:</label>
            <Autocomplete
              freeSolo
              filterOptions={(x) => x}
              onChange={(e) => { setValue(e.target.innerText); }}
              options={optionsOne ? optionsOne.map((obj) => obj.name) : []}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="location"
                  onChange={(e) => onChangeOne(e)}
                />
              )}
            />
            <label htmlFor="startDate">Check-in Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              required
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">Check-out Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              required
              onChange={(e) => setEndDate(e.target.value)}
            />
            <label htmlFor="averageRatings">Average Rating(above):</label>
            <input
              type="number"
              id="averageRatings"
              value={averageRatings}
              onChange={(e) => setAvgRating(e.target.value)}
            />
            <label htmlFor="minPrice">Minimum price:</label>
            <input
              type="number"
              id="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <label htmlFor="maxPrice">Maximum Price:</label>
            <input
              type="number"
              id="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            {/* <form action="/hotelcards"> */}
            <Button variant="primary" onClick={handleSubmit}>Search Hotels</Button>
            {/* <button variant="primary" type="submit">Search Hotels</button> */}
            {/* </form> */}
          </form>
          {/* {console.log("in search, start: " + startDate)} */}
          {/* {isSubmitted && <HotelCards/>} */}
          {/* {
            data && data.length>0 && data.map((item)=><p>{item.name}</p>)
          } */}
          <HotelCards hotels={data ? data : []} checkIn={new Date(startDate)} checkOut={new Date(endDate)} />
          {/* <HotelCards hotels={[{
          name: "Your mom's house",
          address: "1800 your mom lane",
          image:"https://images.unsplash.com/photo-1678107657724-19cb8d478f56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80",
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
          reviews: [{ratings: 1,
            comment: "she smells."}],
          avgRating: 1
        }]} checkIn={new Date(startDate)} checkOut={new Date(endDate)} /> */}

          {/* 
        
    roomNumber:String,
    price:Number,
    hotelId:{},
    roomReservations:[{
        roomId:{},
        reservationId:{
            guestId:{},
            roomReservations:[{}],
            totalPrice:Number,
            startDate:Date,
            endDate:Date
        }
    }],
    roomType:{
        description:String,
        maximumOccupancy:Number,
    }
        
        */}
        </div>
      </div>
    </>
  );
}

export default HotelBooking;