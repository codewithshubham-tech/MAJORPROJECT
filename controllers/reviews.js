const Listing = require("../models/listing.js");
const Review = require("../models/review.js");





module.exports.createReview = async (req, res) => {
    let listing =  await Listing.findById(req.params.id);  //finding the listings from Listing model using req.params.id 
    console.log(req.params.id);
    let newReview = new Review (req.body.review);
    newReview.author = req.user._id;
    console.log(newReview);
    listing.reviews.push(newReview);
 
    await newReview.save();
    await listing.save()
   req.flash("success", "New Review Created");

    console.log("newReview was saved");
    res.redirect(`/listings/${listing._id}`);

};

module.exports.destroyReview = async (req, res) => {
    let{id, reviewId} = req.params;
    
    await Listing.findByIdAndUpdate(id, {$pull : {reviews : reviewId} });
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review Deleted");
    console.log(`id: ${id} & reviewId: ${reviewId}`);
    res.redirect(`/listings/${id}`);
};