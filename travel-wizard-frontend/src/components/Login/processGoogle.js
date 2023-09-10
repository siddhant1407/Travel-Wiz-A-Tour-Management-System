import axiosInstance from "../../API/axiosInstance";
import { useEffect,useState } from "react";
import styles from "./login.module.css"; 
import {useUserState, usePlaceCartState, useHotelCartState, useFlightCartState} from '../../globalState/globalState';
import {useNavigate} from 'react-router-dom'


export default function ProcessGoogle(){
    const navigate = useNavigate();

	const [error, setError] = useState("");
    const {user,setUser} = useUserState();
    const {placeCart,setPlaceCart} = usePlaceCartState();
    const {hotelCart,setHotelCart} = useHotelCartState();
    const {flightCart,setFlightCart} = useFlightCartState();
    useEffect(() =>{
        const fetchData = async ()=>{
            try{
                const {data:res} = await axiosInstance.get('auth/google/verify');
                console.log(res);
                setUser(res.user);
                setPlaceCart(res.placeCart);
                setHotelCart(res.hotelCart);
                setFlightCart(res.flightCart); 
                navigate('/')
            }catch(e){
                if (
                    error.response &&
                    error.response.status >= 400 &&
                    error.response.status <= 500
                ) {
                    setError(error.response.data.message);
                }
            }
        }
        fetchData();
    },[]);
    return (
        <div className = {styles.login_container}>
            {error && <div className={styles.error_msg}>{error}</div>}
        </div>
    );
    
}