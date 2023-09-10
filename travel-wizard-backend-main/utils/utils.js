module.exports = {
    helper:{
        getNonOverlappingCount: async (roomReservations,s,e)=>{
        
            let t1 = new Date(s),
            t2 = new Date(e);
            const start = new Date( t1.getTime() - t1.getTimezoneOffset() * -60000 ),
            end = new Date( t2.getTime() - t2.getTimezoneOffset() * -60000 )
            console.log(start+" "+end);
            let fl = true;
            let count = 1;
            for(let i=await roomReservations.next(); i!=null;i=await roomReservations.next()) {
                let reservation = i.reservationId;
                console.log("here");
                fl=false;
                if((reservation.startDate<start && start < reservation.endDate) || (reservation.startDate<end && end < reservation.endDate)){
                    break;
                }
                count+=1;
            }
            if(!fl){
                return count-1;
            }
            return count;
        },
        getUserCart: async (PlaceCart,HotelCart,FlightCart,userId)=>{
            
            if(typeof PlaceCart!=="undefined"){
                var placeCart = await PlaceCart.findOne({user:userId}).populate('places.place','-hotels -attractions');
            }
            if(typeof HotelCart!=="undefined"){
                var hotelCart = await HotelCart.findOne({user:userId}).populate('hotels.hotel',"-image -rooms -reviews").populate("hotels.room",'-hotelId -roomReservations');
            }
            if(typeof FlightCart!=="undefined"){
                var flightCart = await FlightCart.findOne({user:userId}).populate("flights.flight");
            }
            // console.log(placeCart);
            return {
                placeCart: placeCart,
                hotelCart:hotelCart,
                flightCart:flightCart
            };
        },
        getPrimaryItinerary: async (PrimaryItinerary,userId)=>{
            try{
                const filter = {user:userId};
                var primaryItinerary = await PrimaryItinerary.findOne(filter).populate("placeCart hotelCart flightCart comments");
                if(primaryItinerary==null){
                    primaryItinerary = await PrimaryItinerary.create(filter);
                }
                // console.log("here");
                // console.log(primaryItinerary);
                return primaryItinerary;
            }catch(e){
                console.error(e.stack);
                throw new Error(e.message);
            }
        },
        populatePrimaryItinerary: async (primaryItinerary)=>{
            primaryItinerary = await primaryItinerary.populate("placeCart.places.place","-hotels -attractions");
            primaryItinerary = await primaryItinerary.populate('hotelCart.hotels');
            // primaryItinerary = await primaryItinerary.populate("hotelCart.hotels.room",'-hotelId -roomReservations');
            primaryItinerary = await primaryItinerary.populate("flightCart.flights.flight");
            console.log(primaryItinerary);
            return primaryItinerary;
        },
        successfullLogin: async (req,PrimaryItinerary,User,helper)=>{
            var primaryItinerary = await helper.getPrimaryItinerary(PrimaryItinerary,req.user._id);
            let user = req.user;
            if(req.user.provider==='google'){
                user = req.user._json;
            }else{
                user = await User.findOne({credId:req.user._id},"-otpId");
            }
            // console.log(user);
            // await primaryItinerary;
            primaryItinerary = await helper.populatePrimaryItinerary(primaryItinerary);
            return {primaryItinerary,user};
        }
    },
    middleware:{
        isLoggedIn : (req,res,next)=>{
            if(req.session.passport!==undefined){
                return next();
            }
            console.log("not logged in");
            res.status(400).json({status:400,message:"User must be logged in!!"});
        }
    }
}