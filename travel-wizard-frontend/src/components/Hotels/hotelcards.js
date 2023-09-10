// const HotelCards = () => {
//   return (
//     <h1>Hello</h1>
//   );
// };

// export default HotelCards;
import axios from 'axios';
import { array } from 'prop-types';
import React, {ReactDOM} from 'react';
import Button from 'react-bootstrap/Button';
import styles from "./hotelcards.module.css";
import { Link } from 'react-router-dom';
import axiosInstance from '../../API/axiosInstance';
// import Hotel from './hotel';
function HotelCards(hotels, checkIn, checkOut) {
  console.log("hotels!");
  console.log(hotels);
  console.log("hotels.checkin " + hotels.checkIn);
  checkIn = hotels.checkIn;
  checkOut = hotels.checkOut;
  console.log("hotels.hotels");
  console.log(hotels.hotels);
  hotels = hotels.hotels;
  // var hotels = getServerSideProps(); // TODO uncomment
  // hotels = [{name:"The Hilton Suites",address:"Illinois, Chicago",availability:1,image:"https://images.unsplash.com/photo-1678107657724-19cb8d478f56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80"}, 
  //               {name:"Hyatt Grand",address:"Manhattan, New York",availability:2,image:"https://images.unsplash.com/photo-1535827841776-24afc1e255ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWxzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"},
  //               {name:"Indiana Memorial Union",address:"Bloomington, Indiana",availability:0,image:"https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"}
  //           ]

  // hotels = [];
  // return (<div><h1>No results.</h1></div>);
    // console.log("hotels!");
    // console.log(hotels);
    if (hotels.length === 0) {
      console.log("none");
      return (<div><h1>No results.</h1></div>)
    }
    else return (
      <div className={styles.wrapper}>
        {hotels.map(hotelData =>   {
          
          for(let i=0; i<hotelData.rooms.length; i++) {
              axiosInstance.get(`roomType/${hotelData.rooms[i].roomType}`).then((response)=>{
                  console.log(response);
                  hotelData.rooms[i].roomType = response.data.roomType;
              }).catch((error)=>{
                  console.log(error);
              })
          }
          // console.log("while mapping, hotelData: " + hotelData.rooms[0].roomNumber);
          return <Card hotelData = {hotelData} checkIn = {checkIn} checkOut={checkOut}/> 
          }
        )} 

        {/* <Card
            img="https://images.unsplash.com/photo-1678107657724-19cb8d478f56?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1964&q=80"
            title="The Hilton Suites"
            address="Illinois, Chicago"
        />
        <Card
            img="https://images.unsplash.com/photo-1571896349842-33c89424de2d?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=880&q=80"
            title="The Hilton Suites"
            address="Illinois, Chicago"
        />
  
        <Card
            img="https://images.unsplash.com/photo-1535827841776-24afc1e255ac?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8OXx8aG90ZWxzfGVufDB8fDB8fA%3D%3D&auto=format&fit=crop&w=500&q=60"
            title="Hyatt Grand"
            address="Manhattan, New York"
        />
  
        <Card
            img="https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxzZWFyY2h8MjB8fGhvdGVsc3xlbnwwfHwwfHw%3D&auto=format&fit=crop&w=500&q=60"
            title="Indiana Memorial Union"
            address="Bloomington, Indiana"
        /> */}
      </div>
    )
  }
  
  function Card(props) {
    // console.log("in cards, hotelData: " + props.hotelData.rooms[0].roomNumber);
    console.log("in cards, start date: " + props.checkIn);
    return (
      <div className={styles.card}>
        <div className={styles.card__body}>
          <img src={props.hotelData.image} class={styles.card__image} />
          <h2 className={styles.card__title}>{props.hotelData.name}</h2>
          <p className={styles.card__description}>{props.hotelData.address}</p>
        </div>
        <Link to="/hotel" state={{ hotel: props.hotelData, checkIn: props.checkIn, checkOut: props.checkOut }}>
          <Button className={styles.card__btn}>View Details</Button>
        </Link>
      </div>
    );
  }

  // {status:200, data:hotelData}
  // hotelData = {name:hotel.name,address:hotel.address,availability:count,image:hotel.image}
  
  export default HotelCards;
//   ReactDOM.render(<App />, document.getElementById("root"));
  