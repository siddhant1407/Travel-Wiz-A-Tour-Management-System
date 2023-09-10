import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import styles from './search.module.css';
import { Link } from 'react-router-dom';
import { Button } from "react-bootstrap";
import axiosInstance from "../../API/axiosInstance";
import { usePlaceCartState,useUserState } from '../../globalState/globalState';

function Search() 
{
    const [attractions,setAttractions] = useState([]);
    const location = useLocation();
    const location2 = useLocation();
    const { val, dat } = location.state;
    const { date } = location2.state     
    const [isSaved,setSaved] = useState([]);
    const {placeCart,setPlaceCart} = usePlaceCartState();
    const {user,setUser} = useUserState();

    // const [date, setDate] = useState('');
    
    const save = async (e) => {
      e.preventDefault();
  
      let place = dat[0];  
      console.log(`Saving:
        placeId: ${place._id},
        date: ${date}`);  
      try{
          console.log("doing my best here");
          const { data: res } = await axiosInstance.post(`cart/places`, {
                userId: user._id,
                visitingDate: date,
                placeId: place._id,
              });
          console.log(res);
          setPlaceCart(res.placeCart);
          console.log("done");
          setSaved(69);
      }catch(e){
        console.log(e.stack);
      }
    }


    useEffect(() => {
        console.log('Hi ')
        console.log(dat)
        console.log(val)
        setAttractions(dat[0].attractions);
    }, []);
    function Card(props) {
        return (
          <div className={styles.card}>
            <div className={styles.card__body}>
              <img alt="error" src={props.a.image} class={styles.card__image} />
              <h2 className={styles.card__title}>{props.a.name}</h2>
              <p className={styles.card__description}>{props.a.address}</p>
            </div>
            <Link to="/searchResult" state={{ destination: props.a }}>
              <Button className={styles.card__btn}>View Details</Button>
            </Link>
          </div>
        );
      }

    return (
        <div>
            {/* <h2>Hey</h2> */}
            <h2 align = 'center'>{dat[0].name}</h2>
            <h3 align = 'center'> See the top most attractions in {dat[0].name} Below! </h3>


            {attractions && attractions.map(attraction =>   {
                    return <Card a = {attraction} />
                }
                )}
            {!(isSaved == 69) && <Button align = 'center' className={styles.card__btn} onClick={save}>Save {dat[0].name} to itinerary</Button>}
            {(isSaved == 69) && <p className={styles.saved}>Saved</p>} 
            
            {/* {val}
            {dat} */}
            {/* {resJson.place.attractions} */}
        </div>
        
    )
};

export default Search;