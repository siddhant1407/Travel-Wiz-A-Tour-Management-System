import * as React from "react";

const userInitialState = {
    user:{},
    setUser:undefined,
}
const placeCartInitialState = {
    placeCart:{},
    setPlaceCart : undefined,
}
const hotelCartInitialState = {
    hotelCart:{},
    setHotelCart:undefined,
}
const flightCartInitialState = {
    flightCart:{},
    setFlightCart:undefined,
}

const UserStateContext = React.createContext(userInitialState);
const PlaceCartStateContext = React.createContext(placeCartInitialState);
const HotelCartStateContext = React.createContext(hotelCartInitialState);
const FlightCartStateContext = React.createContext(flightCartInitialState);


export const GlobalStateProvider = ({children})=>{
    console.log(JSON.parse(localStorage.getItem("user")));
    const [user,setUser] = React.useState(JSON.parse(localStorage.getItem("user")) || userInitialState.user);
    const [placeCart,setPlaceCart] = React.useState(JSON.parse(localStorage.getItem("placeCart")) ||placeCartInitialState.placeCart);
    const [hotelCart,setHotelCart] = React.useState(JSON.parse(localStorage.getItem("hotelCart")) ||hotelCartInitialState.hotelCart);
    const [flightCart,setFlightCart] = React.useState(JSON.parse(localStorage.getItem("flightCart")) ||flightCartInitialState.flightCart);

    const userContextValue = React.useMemo(()=>{
        localStorage.setItem("user",JSON.stringify(user));
        return {user,setUser}},[user]);
    const placeCartContextValue = React.useMemo(()=>{
		localStorage.setItem("placeCart", JSON.stringify(placeCart));
        return {placeCart,setPlaceCart}},[placeCart]);
    const hotelCartContextValue = React.useMemo(()=>{
		localStorage.setItem("hotelCart", JSON.stringify(hotelCart));
        return {hotelCart,setHotelCart}},[hotelCart]);
    const flightCartContextValue = React.useMemo(()=>{
		localStorage.setItem("flightCart", JSON.stringify(flightCart));
        return {flightCart,setFlightCart}},[flightCart]);
    // console.log(userContextValue);
    return (
        <UserStateContext.Provider value={userContextValue}>
            <PlaceCartStateContext.Provider value={placeCartContextValue}>
                <HotelCartStateContext.Provider value={hotelCartContextValue}>
                    <FlightCartStateContext.Provider value={flightCartContextValue}>
                        {children}
                    </FlightCartStateContext.Provider>
                </HotelCartStateContext.Provider>
            </PlaceCartStateContext.Provider>
        </UserStateContext.Provider>
    )
};
export const useUserState = ()=> React.useContext(UserStateContext);
export const usePlaceCartState = ()=> React.useContext(PlaceCartStateContext);
export const useHotelCartState = ()=> React.useContext(HotelCartStateContext);
export const useFlightCartState = ()=> React.useContext(FlightCartStateContext);
