const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

const db_url = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("connected to DB");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(db_url);
}

const initDB = async () => {
  await Listing.deleteMany({}); // cleaning data
  await Review.deleteMany({}); // deleting reviews
  initData.data = initData.data.map((obj) => ({
    ...obj,
    reviews: [],
    owner: '68dbc663b1309da00f0b7828'
  }));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();