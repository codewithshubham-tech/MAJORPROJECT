const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync.js");
const passport = require("passport");
const{saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");

router.route("/signup")
.get(userController.renderSignupForm)
.post(wrapAsync (userController.signup));

router.route("/login")
.get(userController.renderLoginForm)
.post(saveRedirectUrl, passport.authenticate("local",{ failureRedirect : '/login', failureFlash : true} ),
userController.login);
// signup - render form
// router.get("/signup", userController.renderSignupForm);

// to register user

// router.post("/signup", wrapAsync (userController.signup));

// login - to renderlogin form 

// router.get("/login", userController.renderLoginForm);

// login - to authenticate user

//  router.post("/login",saveRedirectUrl, passport.authenticate("local",{ failureRedirect : '/login', failureFlash : true} ),
// userController.login);

// logout route

router.get("/logout", userController.logout);

module.exports = router;