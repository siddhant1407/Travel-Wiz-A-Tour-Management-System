require('dotenv').config();

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userDetails'),
    PlaceCart = require('../models/placeCart'),
    HotelCart = require('../models/hotelCart'),
    FlightCart = require('../models/flightCart'),
    PrimaryItinerary = require('../models/primaryItinerary'),
    ItineraryComments = require('../models/itineraryComments');

const { middleware , helper }= require('../utils/utils'),
    transporter = require('../utils/mailTransporter');

router.post("/places",async (req,res)=>{
    const userId = req.body.userId;
    try{
        var {placeCart} = await helper.getUserCart(PlaceCart,undefined,undefined,userId);
        var primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary,userId);
        // console.log("in cart");
        // console.log(primaryItinerary);
        if(placeCart==null){
            placeCart = await PlaceCart.create({user:userId,places:[{place:req.body.placeId,visitingDate:new Date(req.body.visitingDate)}]});
            primaryItinerary.placeCart = (placeCart._id);
            // console.log(primaryItinerary);
            await primaryItinerary.save();      

        }else{
            placeCart.places.push({place:req.body.placeId,visitingDate:new Date(req.body.visitingDate)});
        }
        await placeCart.save();    
        placeCart = await placeCart.populate('places.place','-hotels -attractions');
        // console.log(placeCart);
        res.json({status:200,placeCart:placeCart});
    }catch(e){
        console.log(e.stack);
        res.json({status:400,message:e.message});
    }
})
router.post("/hotels", async (req, res) => {
    const userId = req.body.id;
    
    try {
        var { hotelCart } = await helper.getUserCart(undefined, HotelCart, undefined, userId);
        let primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary,userId);
        if (hotelCart == null) {
            hotelCart = await HotelCart.create({ user: userId, hotels: [{ hotel: req.body.hotelId, room: req.body.roomId, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate), bookedStatus: false}] });
            primaryItinerary.hotelCart = hotelCart._id;
            await primaryItinerary.save();
        } else {
            hotelCart.hotels.push({ hotel: req.body.hotelId, room: req.body.roomId, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate),bookedStatus: false });
        }
        await hotelCart.save();
        hotelCart = await hotelCart.populate('hotels.hotel hotels.room',"-image -rooms -reviews");
        res.json({ status: 200, hotelCart:hotelCart });
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }
})

router.post("/flights", async (req, res) => {
    console.log(req.body);
    const userId = req.body.id;
    try {
        var { flightCart } = await helper.getUserCart(undefined, undefined, FlightCart, userId);
        let primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary,userId);
        if (flightCart == null) {
            flightCart = await FlightCart.create({ user: userId, flights: [{ flight: req.body.flightId,  date: new Date(req.body.date) }] });
            primaryItinerary.flightCart = flightCart._id;
            await primaryItinerary.save();
        } else {
            flightCart.flights.push({ flight: req.body.flightId, seats: req.body.seatNumber, date: new Date(req.body.date)});
        }
        await flightCart.save();
        flightCart = await flightCart.populate("flights.flight");
        res.json({ status: 200, flightCart:flightCart });
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }
})
router.post("/comment", async (req, res) => {
    const userId = req.body.id;

    try {
        var itineraryComments ;
        itineraryComments = await ItineraryComments.create({ author: { id: userId, username: req.user.username }, text: req.body.comment });
        await itineraryComments.save();
        let primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary, userId);
        primaryItinerary.comments.push(itineraryComments._id);
        await primaryItinerary.save();
        res.status(200).json({ status: 200, message: "Your Comment posted successfully" })
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }

   
})
router.get("/share",async (req,res)=>{
    let shareeEmail = req.query.email;
    console.log(shareeEmail);
    let user = await User.findOne({ email: shareeEmail });
    if(user==null){
        req.status(400).json({status:400,message:`No user found with ${shareeEmail}, please check the provided email and try again`});
    }
    const primaryItinerary = await PrimaryItinerary.findOne({user:req.body.id});
    let jwt_token = jwt.sign({primaryItinerary:primaryItinerary._id,shareeEmail:shareeEmail},process.env.JWT_SECRET_TOKEN);
    const mailOptions = {
        from: process.env.ADMIN_EMAIL,
        to: shareeEmail,
        subject: `Your friend's ${req.session.passport.user.username} itinerary is here!!`,
        html: `<h3>Hello</h3> <div> Your friend want's you to take look at his itinerary. Please use this <a href=${process.env.CLIENT_URL}/shared-itinerary?token=${jwt_token}>link</a> to see the itinerary  </div>`
    };
    let info = await transporter.sendMail(mailOptions);
    res.status(200).json({status:200,message:`Your itinerary has been shared with ${shareeEmail}.`});
})
router.get("/shared-itinerary",async (req,res)=>{
    const jwt_token = req.query.token;
    try{
        jwt.verify(jwt_token,process.env.JWT_SECRET_TOKEN, async (err,tokenObject)=>{
            if(err){
                res.status(400).json({status:400,message:err.message});
            }
            const user = await User.findById(req.params.id);
            if(user.email!==tokenObject.shareeEmail){
                res.status(400).json({status:400,message:"This itinerary is not meant for you"});
            }
            let primaryItinerary = await PrimaryItinerary.findById(tokenObject.primaryItinerary).populate("placeCart hotelCart flightCart comments");
            if(primaryItinerary==null){
                res.status(400).json({status:400,message:"Invalid itinerary, please try again"});
            }
            primaryItinerary = await helper.populatePrimaryItinerary(primaryItinerary);
            res.status(200).json({status:200,placeCart:primaryItinerary.placeCart,hotelCart:primaryItinerary.hotelCart,flightCart:primaryItinerary.flightCart,comments:primaryItinerary.comments});
        })
    }catch(e){
        console.log(e.stack);
        res.status(400).json({status:400,message:e.message});
    }
})
router.delete("/comment/:commentId", async (req, res) => {
    const userId = req.params.id;

    try {
        var deleteComment = await ItineraryComments.findById(req.params.commentId);
        console.log("deleteComment", deleteComment)
        if (userId == deleteComment.author.id) {
            var primaryItineraryUser = await PrimaryItinerary.findOne({ user: userId});
            primaryItineraryUser.comments = primaryItineraryUser.comments.filter(comment => comment._id.toString() !== req.params.commentId.toString());
            await primaryItineraryUser.save();
            await ItineraryComments.findByIdAndDelete(req.params.commentId);
        }       
        res.status(200).json({ status: 200, message: "Your comment has been Deleted" })
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }


})
router.delete("/hotels/:hotelsId", async (req, res) => {
    const userId = req.query.id;

    try {
        var deletehotel = await HotelCart.findOne({ user: userId });
        
        deletehotel.hotels = deletehotel.hotels.filter(hotel => hotel.hotel._id.toString() !== req.params.hotelsId.toString());
        await deletehotel.save();
        
        res.status(200).json({ status: 200, hotelCart:deletehotel})
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }


})
router.delete("/places/:placesId", async (req, res) => {
    // console.log(req.params);
    const userId = req.query.id;
    // console.log(userId);
    try {
        var deleteplace = await PlaceCart.findOne({ user: userId });
        if (userId == deleteplace.user) {
            deleteplace.places = deleteplace.places.filter(place => place.place.toString() != req.params.placesId);
            // console.log(deleteplace);
            await deleteplace.save();
        }
        res.status(200).json({ status: 200, placeCart:deleteplace})
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }


})
router.delete("/flights/:flightsId", async (req, res) => {
    const userId = req.params.id;

    try {
        var deleteflights = await FlightCart.findOne({ user: userId });
        console.log(deleteflights);
        deleteflights.flights = deleteflights.flights.filter(flight => flight.flight._id.toString() !== req.params.flightsId.toString());
        await deleteflights.save();
        
        res.status(200).json({ status: 200, flightCart:deleteflights});
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }


})

module.exports = router;