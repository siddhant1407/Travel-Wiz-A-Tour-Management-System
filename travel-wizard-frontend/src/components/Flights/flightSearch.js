import React, { useState } from 'react';
import styles from "./FlightSearch.module.css";
import FlightCards from './flightCards';
import axiosInstance from "../../API/axiosInstance";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

function FlightSearch() {
  const [from, setFrom] = useState('');
  const [to, setTo] = useState('');
  const [departureDate, setDepartureDate] = useState('');
  const [returnDate, setReturnDate] = useState('');
  const [numPassengers, setNumPassengers] = useState(1);
  const [data, setData] = useState([]);
  const [optionsOne, setOptionsOne] = useState([]);
  const [value, setValue] = useState("");
  const getCitiesOne = async (str) => {
    try {
      let searchableCity = str.replace(/,/g, "");
      let url = "search/" + searchableCity;

      let { data } = await axiosInstance.get(url);
      console.log(data);
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  const onChangeTo = async (e) => {
    if (e.target.value) {
      let d = await getCitiesOne(e.target.value);
      setOptionsOne(d);
      setTo(d[0].name);
      console.log(data + "here");
    }
  };
  const onChangeFrom = async (e) => {
    if (e.target.value) {
      let d = await getCitiesOne(e.target.value);
      setOptionsOne(d);
      setFrom(d[0].name);
      console.log(data + "here");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Perform flight search with filter criteria
    console.log(`Performing flight search with filters:
      From: ${from},
      To: ${to},
      Departure date: ${departureDate},
      Return date: ${returnDate},
      Number of passengers: ${numPassengers}`);
    // let placeId = '64058586d3cca7ef541834d9';
    try {
      const { data: res } = await axiosInstance.get(`flights?source=${from}&destination=${to}&date=${departureDate}`);
      if (res.status === 200) {
        setData(res.data);
        console.log("retrieved flight data: ");
        console.log(res.data);
        // setMessage(resJson.message);
      } else {
        // setMessage("Some error occured");
      }
    } catch (err) {
      // setMessage("Some error occured");
    }
  };



  return (
    <div className={styles.flight_wrapper}>
      <div className={styles.flight_search_container}>
        <h1>Search for Flights</h1>
        <form onSubmit={handleSubmit}>
          <label htmlFor="from">From:</label>
          <Autocomplete
            freeSolo
            filterOptions={(x) => x}
            onChange={(e) => setValue(e.target.innerText)}
            options={optionsOne ? optionsOne.map((obj) => obj.name) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                label="from"
                onChange={(e) => onChangeFrom(e)}
              />
            )}
          />

          <label htmlFor="to">To:</label>
          <Autocomplete
            freeSolo
            filterOptions={(x) => x}
            onChange={(e) => setValue(e.target.innerText)}
            options={optionsOne ? optionsOne.map((obj) => obj.name) : []}
            renderInput={(params) => (
              <TextField
                {...params}
                label="to"
                onChange={(e) => onChangeTo(e)}
              />
            )}
          />

          <label htmlFor="departureDate">Departure Date:</label>
          <input
            type="date"
            id="departureDate"
            value={departureDate}
            onChange={(e) => setDepartureDate(e.target.value)}
          />

          {/* <label htmlFor="returnDate">Return Date:</label>
        <input
          type="date"
          id="returnDate"
          value={returnDate}
          onChange={(e) => setReturnDate(e.target.value)}
        /> */}
          <label htmlFor="numPassengers">Number of Passengers:</label>
          <input
            type="number"
            id="numPassengers"
            value={numPassengers}
            onChange={(e) => setNumPassengers(e.target.value)}
          />
          <button type="submit">Search Flights</button>
        </form>
        <p></p>
        <FlightCards flights={data ? data : []} />
        {/* <FlightCards flights={[{
          source: 'Atlanta',
          destination: 'Indianapolis',
          departureDate: new Date(4/23/23),
          seats: 52,
          price: 124
        }]}
      /> */}
      </div>
    </div>
  );
}

// hello
export default FlightSearch;