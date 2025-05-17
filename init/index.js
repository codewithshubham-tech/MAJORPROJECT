const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

let MONGO_URL = "mongodb://127.0.0.1:27017/wanderlust";

main()
.then((res) => {
    console.log("connected to DB");
})
.catch ((err) => {
    console.log(err);
})

async function main() {
    await mongoose.connect(MONGO_URL);
}

const initDB = async () => {
    await Listing.deleteMany({});
    initData.data = initData.data.map((obj) => ({ ...obj , owner :"6807c85fafa028fc3be9fcfe"}))
    await Listing.insertMany(initData.data);
    console.log("Data was initialized");
    
}

initDB(); // initializing Database
