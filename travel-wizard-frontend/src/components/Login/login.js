import { useState,memo } from "react";
import axiosInstance from "../../API/axiosInstance";
import { Link } from "react-router-dom";
import styles from "./login.module.css"; 
import {useUserState, usePlaceCartState, useHotelCartState, useFlightCartState} from '../../globalState/globalState';
import {useNavigate} from 'react-router-dom'
// require('dotenv').config();
const Login = memo(() => {
	const [data, setData] = useState({ 
		username: "", 
		password: ""
	});
	const navigate = useNavigate();
	const [error, setError] = useState("");
	const {user,setUser} = useUserState();
	const {placeCart,setPlaceCart} = usePlaceCartState();
	const {hotelCart,setHotelCart} = useHotelCartState();
	const {flightCart,setFlightCart} = useFlightCartState();
	const handleChange = ({ currentTarget: input }) => {
		setData({ ...data, [input.name]: input.value });
	};

	const handleSubmit = async (e) => {
		e.preventDefault();
		console.log("app login");
		try {
			const url = "auth/local";
			//using axiosInstance the base url i.e, http://localhost:8080/ is not required as it is given to axiosInstance at the time of it's creation.
			
			const { data: res } = await axiosInstance.post(url, data);
			// localStorage.setItem("token", res.data);
			console.log(res);
			setUser(res.user);
			// localStorage.setItem("user", JSON.stringify(res.user));
			setPlaceCart(res.placeCart);
			setHotelCart(res.hotelCart);
			setFlightCart(res.flightCart);
			console.log(user);
			navigate("/");
		} catch (error) {
			if (
				error.response &&
				error.response.status >= 400 &&
				error.response.status <= 500
			) {
				setError(error.response.data.message);
			}
		}
	};

	const googleAuth = () => {
		window.open(
			// console.log(process.env.SERVER_URL)
			`http://localhost:8080/auth/google`,
			"_self"
		);
	};
	

	return (
		<div className={styles.login_container}>
			<div className={styles.login_form_container}>
				<div className={styles.left}>
					<form className={styles.form_container} onSubmit={handleSubmit}>
						<h1>Login to Your Account</h1>
						<input
							type="text"
							placeholder="Username"
							name="username"
							onChange={handleChange}
							value={data.username}
							required
							className={styles.input}
						/>
						<input
							type="password"
							placeholder="Password"
							name="password"
							onChange={handleChange}
							value={data.password}
							required
							className={styles.input}
						/>
						{error && <div className={styles.error_msg}>{error}</div>}
						<button type="submit" className={styles.green_btn}>
							Sign In
						</button>
						
					</form>
					<Link to="/reset-password"><button type="button" className={styles.green_btn}>Reset Password</button></Link>
					<button className={styles.green_btn} onClick={googleAuth}>
						{/* <img src="../Images/google.png" alt="google icon" /> */}
						<span>Sign in with Google</span>
						</button>
				</div>
				
				<div className={styles.right}>
					<h1>New Here?</h1>
					<Link to="/signup">
						<button type="button" className={styles.white_btn}>
							Sign Up
						</button>
					</Link>
				</div>
			</div>
		</div>
	);
});

export default Login;
