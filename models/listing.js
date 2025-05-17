const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const Review = require("./review.js");

// defining Schema 
const listingSchema = new mongoose.Schema({
    title: {
        type : String,
        required:true
    },
    description : {
        type : String,
        required: true,
    },
    image : {
        url : String,
        filename : String,
        // default : "https://www.pexels.com/photo/mirror-lake-reflecting-wooden-house-in-middle-of-lake-overlooking-mountain-ranges-147411/",
        // set: (v) => v === "" ? "https://www.pexels.com/photo/pathway-between-trees-towards-house-126271/"
        //  : v, 
    },
    price : {
        type : Number,
        
    },
    location : {
        type : String,
        
    },
    country : {
        type : String,
        
    },

    reviews : [
        {
            type: Schema.Types.ObjectId,
            ref: "Review",
        },
    ],

    owner : {
        type :Schema.Types.ObjectId,
        ref :"User",
    },

    // coordinates

    // geometry : {
    //     type : {
    //         type:String,
    //         enum: ["Point"],
    //         required:true,
    //     },

    //     coordinates : {
    //         type: [Number],
    //         required:true,
    //     }
    // },
    category : {
        type : String,
        enum : ["Rooms", "Iconic Cities", "Mountain", "Castles", "Artic", "Desert", "Camping", "Farms", "Amazing Pools"]
    },
    
});

// post middleware for deleting Reviews

listingSchema.post("findOneAndDelete", async (listing) => {
    if(listing) {
        await Review.deleteMany({ _id : { $in : listing.reviews } });
    }
});

// creating model

const Listing = new mongoose.model("Listing", listingSchema);

module.exports = Listing;
