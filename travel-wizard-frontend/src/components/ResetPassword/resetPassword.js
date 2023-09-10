import { useState,memo } from "react";
import axiosInstance from "../../API/axiosInstance";
import { Link } from "react-router-dom";
import styles from "../Login/login.module.css"; 
import {useNavigate} from 'react-router-dom'
const ResetPassword = memo(() => {
    const [error, setError] = useState("");
    const [email,setEmail]  = useState("");
    const [answer,setAnswer] = useState("");
    const [enablePasswordReset,setEnablePasswordReset] = useState(false);
    const [password,setPassword] = useState("");
    const [cnf,setCnf] = useState("");
    const [otp,setOtp] = useState();
    const [resetFinished,setResetFinished] = useState(false);
    const [question,setQuestion] = useState("");
    const [display_string,setDisplay] = useState("");
    const [show,setShow] = useState(false);
    const handleError = (err) => {
        setError(err);
    }
    // const hand
    const handleSubmitOtp = async (e)=>{
        e.preventDefault();
        console.log("submitted")
        try{
            const {data:res} = await axiosInstance.post("auth/otp/generate",{email: email});
            if(res.status===400){
                throw new Error(res.message)
            }
            setEnablePasswordReset(true);
            console.log(res);
            setQuestion(res.question);
            if(res.question===undefined){
                setDisplay("Enter OTP and new password to reset password");
            }else{
                setDisplay("Enter OTP, Security answer and new password to reset password");
                setShow(true);
            }
            setError("");
            alert("OTP generated, check your e-mail")
        }catch(e){
            console.log(e);
            handleError(e.message);
        }
    }
    const handleSubmitPassword = async (e)=>{
        e.preventDefault();
        if(password!=cnf){
            setError("Both passwords must be same");
            return;
        }
        try{
            const {data:res} = await axiosInstance.post("auth/otp/verify",{otp:otp,password:password,answer:answer});
            if(res.status===200){
                setResetFinished(true);
            }
            if(res.status==400){
                throw new Error(res.message);
            }
            console.log(res);
        }catch(e){
            console.log(e);
            handleError(e.message);
        }
    }
    const resetPasswordUtil = ()=>{
        if(resetFinished){
            return (
                <>
                <h1>Password Reset completed</h1>
                <div> Use this button to </div>
                <Link to="/login">
						<button type="button" className={styles.green_btn}>
							Sign in
						</button>
				</Link>
                
                </>
            )
        }
        if(!enablePasswordReset){
            return (
                    <>
                    <h1>Enter your email address to generate an OTP</h1>
                    <form className={styles.form_container} onSubmit={handleSubmitOtp}>
                    <input
                        type="email"
                        placeholder="E-mail"
                        name="email"
                        onChange={(e) => setEmail(e.target.value)}
                        value={email}
                        required
                        className={styles.input} />
                        <button type="submit" className={styles.green_btn}>
							Generate OTP
						</button>
                        {error && <div className={styles.error_msg}>{error}</div>}

                </form></>
            );
        }else{
            return (
                <>
                    <h2>{display_string}</h2>
                    <form className={styles.form_container} onSubmit={handleSubmitPassword}>
                    <input
                        type="number"
                        placeholder="OTP"
                        name="otp"
                        onChange={(e) => setOtp(e.target.value)}
                        value={otp}
                        required
                        className={styles.input} />
                    {console.log(display_string,show)}
                    {show && (<input
                        type="text"
                        placeholder="Security answer"
                        name="otp"
                        onChange={(e) => setAnswer(e.target.value)}
                        value={answer}
                        required
                        className={styles.input} />)}
                    <input
                        type="password"
                        placeholder="Password"
                        name="password"
                        onChange={(e) => {setPassword(e.target.value);
                            setError("")}}
                        value={password}
                        required
                        className={styles.input} />
                    <input
                        type="password"
                        placeholder="Conform Password"
                        name="password"
                        onChange={(e) => {setCnf(e.target.value);
                            setError("")}}
                        value={cnf}
                        required
                        className={styles.input} />
                        <button type="submit" className={styles.green_btn}>
							Reset Password
						</button>
                        {error && <div className={styles.error_msg}>{error}</div>}
                    </form>
                </>
            )
        }
        
    }
    return (
        <div className={styles.login_container}>
            <div className={styles.login_form_container}>
                <div className={styles.left}>
                        
                    {resetPasswordUtil()}
                </div>
                
            </div>
        </div>
    );
});

export default ResetPassword;
