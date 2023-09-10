import axios from 'axios';
import { array } from 'prop-types';
import React, {ReactDOM} from 'react';
import Button from 'react-bootstrap/Button';
import styles from "./flightcards.module.css";
import { Link } from 'react-router-dom';

function FlightCards(flights) {
  console.log("flights! in flightcards");
  console.log(flights);
  console.log("flights.flights");
  console.log(flights.flights);
  flights = flights.flights;
    if (flights.length === 0) {
      console.log("none");
      return (<div><h1>No results.</h1></div>)
    }
    else return (
      <div className={styles.wrapper}>
        {flights.map(flightData =>   {
          return (flightData.seats)? 
            <Card
              flightData = {flightData}
            /> 
            : <></>
          }
        )} 
        {/* {flights[0].source} */}
      </div>
    )
  }
  
  function Card(props) {
    return (
      <div className={styles.card}>
        <div className={styles.card__body}>
          <h2 className={styles.card__title}>{props.flightData.source} to {props.flightData.destination}</h2>
          <p className={styles.card__description}>${props.flightData.price}/person</p>
          <p className={styles.card__description}>{props.flightData.seats} seats available</p>
        </div>
        <Link to="/flight" state={{ flight: props.flightData }}>
          <Button className={styles.card__btn}>View Details</Button>
        </Link>
      </div>
    );
  }
  
  export default FlightCards;
  