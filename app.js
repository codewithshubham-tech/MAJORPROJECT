if(process.env.NODE_ENV != "production") {
    require("dotenv").config();   
} 


const express = require("express");
const app = express();
let port = 8080;
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const ExpressError = require("./utils/ExpressError.js");
const Review = require("./models/review.js");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");


const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");

const dbUrl = process.env.ATLASDB_URL; 

main()
.then( ()=> {
console.log("connected to DB");
})
.catch ( (err) => {
    console.log(err);
});

async function main () {
    await mongoose.connect(dbUrl);
};

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded ({ extended : true}) );
app.use(methodOverride("_method"));
app.engine("ejs", ejsMate);
app.use(express.static(path.join(__dirname, "/public")));

// store
const store = MongoStore.create({
    mongoUrl: dbUrl,
    crypto: {
        secret:process.env.SECRET,
    },
    touchAfter : 24 * 3600
});

// store error
store.on("error", () => {
    console.log("ERROR in MONGO SESSION STORE", err);
});


// session options
const sessionOptions = {
    store,
    secret : process.env.SECRET,
    resave : false,
    saveUninitialized : true,
    cookie : {
        expires : Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge : 7 * 24 * 60 * 60 * 1000,
        httpOnly : true,
    },
};


// express session

app.use(session(sessionOptions));

// connect -flash 
app.use( flash() );

// passport 

app.use(passport.initialize());
app.use(passport.session());

passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


// middleware for flash msg using res.locals

app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user;
    next();
});


// Listing

app.use("/listings", listingRouter);

// Review

app.use("/listings/:id/reviews", reviewRouter);

//User

app.use("/", userRouter);


// custom page not found middleware
app.all("*", (req, res, next) => {
    next(new ExpressError(404, "Page Not Found"));
});


// error handling middleware
app.use((err, req, res, next) => {
    let {statusCode=500, message="Something went Wrong!"} = err;
    // res.status(statusCode).send(message);
    res.status(statusCode).render("error.ejs",{message});
});


app.listen(port,() => {
    console.log(`server is listening to port : ${port}`);
});

// app.get("/", (req, res) => {
//     res.send("i am root");
// });

