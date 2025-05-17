const express = require("express");
const router = express.Router();
const Listing = require("../models/listing.js");
const wrapAsync = require("../utils/wrapAsync.js");
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });
// const ExpressError = require("../utils/ExpressError.js");
// const {listingSchema} = require("../schema.js");
const {isLoggedIn, isOwner, validateListing} = require("../middleware.js");

const listingControllers = require("../controllers/listings.js");

router.route("/")
.get(wrapAsync(listingControllers.index))
.post(isLoggedIn, upload.single("listing[image]"), validateListing,  wrapAsync(listingControllers.createListing) );
  

// Index Route

// router.get("/", wrapAsync(listingControllers.index));

// NEW route

router.get("/new", isLoggedIn, listingControllers.renderNewForm);

router.route("/:id")
.get(wrapAsync(listingControllers.showListing) )
.put(isLoggedIn, isOwner, upload.single("listing[image]"), validateListing ,wrapAsync(listingControllers.updateListing) )
.delete(isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing) );

//SHOW Route

// router.get("/:id", wrapAsync(listingControllers.showListing) );

// CREATE

// router.post("/",isLoggedIn, validateListing, wrapAsync(listingControllers.createListing) );

// edit Route

router.get("/:id/edit",isLoggedIn, isOwner, wrapAsync(listingControllers.renderEditForm) );  

//Update Route

// router.put("/:id", isLoggedIn, isOwner, validateListing ,wrapAsync(listingControllers.updateListing) );


// DELETE 

// router.delete("/:id",isLoggedIn, isOwner, wrapAsync(listingControllers.destroyListing) );


module.exports = router;

