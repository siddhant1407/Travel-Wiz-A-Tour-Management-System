require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userDetails'),
    PlaceCart = require('../models/placeCart'),
    HotelCart = require('../models/hotelCart'),
    FlightCart = require('../models/flightCart'),
    flightsData = require('../models/flight'),
    // Reservation = require('../models/Reservation'),
    Reservation = mongoose.models.Reservation,
    Hotel = mongoose.models.Hotel,
    RoomReservation = require('../models/roomReservation'),
    PrimaryItinerary = require('../models/primaryItinerary'),
    ItineraryComments = require('../models/itineraryComments');

const {middleware , helper } = require('../utils/utils'),
    transporter = require('../utils/mailTransporter');

router.post("/hotels", async (req, res) => {
    const userId = req.body.userId;
    const user = await User.findById(userId);
    try {
        let reservation = await Reservation.create({guestId: userId,totalPrice: req.body.totalPrice,startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate)});
        let roomReservation = await RoomReservation.create({roomId: req.body.roomId,reservationId:reservation._id});
        reservation.roomReservations.push(roomReservation._id);
        await reservation.save();
        var { hotelCart } = await helper.getUserCart(undefined, HotelCart, undefined, userId);
        console.log("HotelCart", hotelCart)
        let primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary, userId);
        if (hotelCart == null) {
            hotelCart = await HotelCart.create({ user: userId, hotels: [{ hotel: req.body.hotelId, room: req.body.roomId, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate) , bookedStatus: true }] });
            primaryItinerary.hotelCart = hotelCart._id;
            await primaryItinerary.save();
        } else {
            hotelCart.hotels.push({ hotel: req.body.hotelId, room: req.body.roomId, startDate: new Date(req.body.startDate), endDate: new Date(req.body.endDate), bookedStatus: true });
        }
        await hotelCart.save();
        const hotel = await Hotel.findById(req.body.hotelId);
        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: user.email,
            subject: 'Booking Confirmation',
            html: `<h3>Hello ${user.ln}</h3> <div> Thank you for using our service to book your next stay at ${hotel.name} at ${hotel.address}.</div>`
        };
        let info = await transporter.sendMail(mailOptions);
        hotelCart = await hotelCart.populate('hotels.hotel', "-image -rooms -reviews").populate("hotels.room", '-hotelId -roomReservations').execPopulate();;
        res.json({ status: 200, hotelCart: hotelCart});
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }
})



router.post("/flights", async (req, res) => {
    const userId = req.body.id;
    try {
        var { flightCart } = await helper.getUserCart(undefined, undefined, FlightCart, userId);
        let primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary, userId);
        if (flightCart == null) {
            flightCart = await FlightCart.create({ user: userId, flights: [{ flight: req.body.flightId, date: new Date(req.body.date), bookedStatus: true }] });
            primaryItinerary.flightCart = flightCart._id;
            await primaryItinerary.save();
        } else {
            flightCart.flights.push({ flight: req.body.flightId, seats: req.body.seatNumber, date: new Date(req.body.date), bookedStatus: true });
        }
        await flightCart.save();
        flightCart = await flightCart.populate("flights.flight");
        console.log("req body", req.body);
        if (req.body.bookedStatus == true) {
            flightdetails = await flightsData.findById(req.body.flightId);
            let seatNumber = flightdetails.seats - 1;
            flightdetails.seats = seatNumber;
            await flightdetails.save();
            const mailOptions = {
                from: process.env.ADMIN_EMAIL,
                to: req.body.email,
                subject: 'Flight Booking Confirmed',
                html: `<h3>Hello ${req.user.username}</h3> <div> Your flight booking has been confirmed.</div><div>Thank you for joining Travel Wizard</div>`
            };
            await transporter.sendMail(mailOptions);
        }
        res.json({ status: 200, flightCart: flightCart });
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }
})
router.delete("/cancelhotel/:id",async (req, res) => {
    const userId = req.body.userId;
    try{
        let cancelHotel  = await HotelCart.findOne({userId: userId});
    }catch(e){
        console.log(e);
        res.status(400).json({ status: 400, message: e.message });
    }
})
router.delete("/cancelflights/:cancelflightId", async (req, res) => {
    const userId = req.body.id;
    try {
        var cancelflight = await FlightCart.findOne({ user:userId});
        if (userId == cancelflight.user) {
            var deletedFlight = cancelflight.flights.find(flight => flight._id.toString() === req.params.cancelflightId.toString());
            cancelflight.flights = cancelflight.flights.filter(flight => flight._id.toString() !== req.params.cancelflightId.toString());
            await cancelflight.save();
        }
        flightdetails = await flightsData.findById(deletedFlight.flight);
        if (flightdetails) {
            let seatNumber = flightdetails.seats + 1;
            flightdetails.seats = seatNumber;
            await flightdetails.save();
            const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: req.body.email,
            subject: 'Flight Booking Confirmed',
            html: `<h3>Hello ${req.user.username}</h3> <div> Your flight booking has been confirmed.</div><div>Thank you for joining Travel Wizard</div>`
        };
        await transporter.sendMail(mailOptions);
        } else {
            console.log("Flight details not found");
        }
        res.json({ status: 200, message: "Booking Cancelled" });
    } catch (e) {
        console.log(e.stack);
        res.json({ status: 400, message: e.message });
    }
})

module.exports = router;