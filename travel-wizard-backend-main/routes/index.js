require('dotenv').config();

const express = require('express'),
    transporter = require('../utils/mailTransporter'),
    authPassport = require('../auth/authPassport'),
    jwt = require('jsonwebtoken');
const User = require('../models/userDetails'),
    Credentials = require('../models/credentials'),
    RoomReservation = require('../models/roomReservation'),
    Place = require('../models/place'),
    Hotel = require('../models/hotel'),
    RoomType = require('../models/roomType'),
    Review = require('../models/review'),
    Flight = require('../models/flight');


const { middleware , helper }= require('../utils/utils');
const hotel = require('../models/hotel');
const router = express.Router();
router.post('/register',async (req,res)=>{
    let creds=null,user=null;
    // console.log(req.body);
    try{
        let condition = await User.findOne({email:req.body.email});
        if(condition!==null){
            return res.status(400).json({status:400,message:"email already exits"});
        }
        creds = await Credentials.create({username:req.body.username,password:req.body.password});
        user = await User.create({email:req.body.email,fn:req.body.fn,ln:req.body.ln,securityQuestion:{question:req.body.question,answer:req.body.answer},verified:false});
        if(req.body.phone!==undefined && req.body.phone.match(/^[\+]?[(]?[0-9]{3}[)]?[-\s\.]?[0-9]{3}[-\s\.]?[0-9]{4,6}$/im)){
            let temp = await User.findOne({phone:req.body.phone});
            if(temp==null){
                user.phone = req.body.phone;
            }else{
                return res.status(400).json({status:400,message:'Mobile number already exits'});
            }
        }        
        user.credId = creds.id;
        let token = jwt.sign({id:user.id},process.env.JWT_SECRET_TOKEN,{expiresIn:'1d'});

        const mailOptions = {
            from: process.env.ADMIN_EMAIL,
            to: req.body.email,
            subject: 'Verification Required',
            html: `<h3>Hello ${req.body.ln}</h3> <div> Please click <a href=${process.env.SERVER_URL}/auth/verify/email/${user.id}/${token}>here</a> to verify your email ID.</div><div>Thank you for joining Travel Wizard</div>`
        };
        let info = await transporter.sendMail(mailOptions);
        await user.save();
        console.log("user registered");
        res.status(200).json({status:200,message:"user created, please confirm your email ID"});
    }catch(err){
        console.log(err);
        User.remove({ email: req.body.email }, function(err) {
            if (err) {
                console.log(err.message);
            }
        });
        Credentials.remove({ username: req.body.username }, function(err) {
            if (err) {
                console.log(err.message);

            }
        });
        res.status(400).json({status:400,message:err.message});
    }
})
router.get("/logout",(req,res)=>{
    try{
        req.logout((err)=>{
            if(err){
                res.status(400).json({status:400,message:err.message});
            }
        });
        res.json({status:200,message:"logout successful"});
    }catch(err){
        console.log(err.stack);
        console.log(err.message);
        res.status(400).json({status:400,message:err.message});
    }
})
router.get("/hotels",async (req,res) => {
    // console.log(req.user);
    let placeId = req.query.placeId,
    start = req.query.start,
    end = req.query.end,
    minPrice = req.query.minPrice || 0,
    maxPrice = req.query.maxPrice || Number.MAX_VALUE;
    console.log(req.query.rating);
    const hotelData = []
    try{
        let hotelIds = await Place.findById(placeId,"hotels");
        console.log(hotelIds);
        let hotels = await Hotel.find({
            '_id':{ $in: hotelIds.hotels},
            avgRating:{ $gte:new Number(req.query.rating) || 0 }
        }).populate('rooms reviews');
        for(let i=0;i<hotels.length;i++){
            let hotel = hotels[i];
            var count = 0;
            for(let j=0;j<hotel.rooms.length;j++){
                let room = hotel.rooms[j];
                if(room.price<minPrice || room.price>maxPrice){
                    // console.log("price if");
                    continue;
                }
                let roomReservations = RoomReservation.find({roomId:room.id}).populate("reservationId").cursor();                
                await helper.getNonOverlappingCount(roomReservations,start,end).then((c)=>{
                    count+=c;
                });                
            }
            if(count!=0){
                hotelData.push(hotel);
            }
        }        
        res.status(200).json({status:200,data:hotelData});
    }catch(e){        
        console.log(e.stack);
        res.status(400).json({status:400,data:e.message});
    }
});
router.get("/roomType/:id",async (req,res)=>{
    try{
        let type = await RoomType.findById(req.params.id);
        res.status(200).json({status:200,roomType:type});
    
    }catch(e){
        console.log(e);
        res.status(400).json({status:400,data:e.message});
    }
})
router.get('/flights',async (req,res)=>{
    try{
        let src = req.query.source,
        des = req.query.destination,
        date = new Date(req.query.date),
        tomorrow = new Date(date.getTime() + (24 * 60 * 60 * 1000))
        let filter = {source: src, destination:des,departureDate: {$gte:date,$lte:tomorrow}}
        console.log(filter);
        let flights = await Flight.find(filter);
        res.status(200).json({status:200,data:flights});
    }catch(err){
        console.log(err.stack);
        res.status(400).json({status:400,message:err.message});
    }
})
router.post("/hotels/review/:id",async (req,res)=>{
    try{
        let hotel = await Hotel.findById(req.params.id);
        let review = await Review.create({rating:req.body.rating,comment:req.body.comment,author:req.body.username});
        hotel.reviews.push(review._id);
        let newAvgRating = hotel.avgRating+(review.rating/(hotel.reviews.length || 1));
        hotel.avgRating = newAvgRating;
        await hotel.save();
        return res.status(200).json({status:200,newReview:review});
    }catch(e){
        console.log(e);
        return res.status(400).json({status:400,message:e.message});
    }
})


module.exports = router;