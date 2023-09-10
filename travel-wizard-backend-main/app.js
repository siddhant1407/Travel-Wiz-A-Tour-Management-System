require('dotenv').config();
const express = require('express'),
     mongoose = require('mongoose'),
     session = require('express-session'),
     MongoStore = require('connect-mongo'),
     authPassport = require('./auth/authPassport'),
     jwt = require('jsonwebtoken');

const User = require('./models/userDetails'),
    Credentials = require('./models/credentials'),
    Otp = require('./models/otp'),
    RoomReservation = require('./models/roomReservation'),
    Place = require('./models/place'),
    ItineraryComments = require('./models/itineraryComments'),
    PlaceCart = require('./models/placeCart'),
    Attraction = require('./models/attraction'),
    Hotel = require('./models/hotel'),
    HotelCart = require('./models/hotelCart'),
    Flight = require('./models/flight'),
    FlightCart = require('./models/flightCart'),
    Room = require('./models/room'),
    RoomType = require('./models/roomType'),
    Review = require('./models/review'),
    Reservation = require('./models/reservation');

const { middleware , helper }= require('./utils/utils');
mongoose.connect(process.env.MONGODB_URI);
mongoose.connection.once('open',()=>{
    console.log('Mongo DB connection established');
}).on('error',(err)=>{
    console.log(`Mongo DB connection error:\n ${err}`);
})

const app = express();
const PORT = process.env.PORT || 8080;
app.use(require("./cors/corsConfig"));
app.use(session({
	secret:process.env.EXPRESS_SESSION_SECRET,
	resave:false,
	saveUninitialized:false,
    store: MongoStore.create({
        mongoUrl: process.env.MONGODB_URI,
        ttl:24 * 60 * 60,
        dbName:"travelWizard"
    }),
}));
app.use(authPassport.initialize());
app.use(authPassport.session());
app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/', (req, res) => {
    res.send(`<div>This route is only for API calls, visit <a href=/${process.env.CLIENT_URL}>Travel Wizard.</a></div>`);
})
app.use("/",require("./routes/index"));
app.use("/auth",require("./routes/auth"));

app.get("/place/:placeId",async (req, res) => {
    try{
        let place = await Place.findById(req.params.placeId).populate('attractions');
        console.log("place search working");
        console.log(place);
        res.json({status:200,place:place})
    }catch(err){
        console.log(err);
        res.json({status:400,message:err.message});
    }
})
app.get('/search/:key', async (req,res)=>{
    if(req.params.key===''){
        res.send();
    }
    try{
        const place = await Place.find({
            "$or":[{name:{$regex:'^'+req.params.key,$options:"i"}}]
        },['name','_id']).populate("attractions");
        res.send(place);
    }catch(e){
        console.log(e.stack);
        res.json({status:400,message:e.message});
    }
})
app.use("/cart",require("./routes/cart"));
app.use("/book",require("./routes/book"));
app.listen(PORT, () => {
    console.log('listening on port ' + PORT);
});
