const express = require('express');
const app = express();
const mongoose = require('mongoose');
const Listing = require('./models/listing');
const path = require('path');
const methodOverride = require('method-override');
const ejsMate= require('ejs-mate');
const wrapAsync = require('./utils/wrapAsync');
const ExpressError = require('./utils/ExpressError');

app.engine('ejs', ejsMate);

app.use(express.static(path.join(__dirname, 'public')));

app.use(methodOverride('_method'));

async function main() {
    await mongoose.connect('mongodb://localhost:27017/wanderlust');
}

main().then(() => {
    console.log("Connected to MongoDB");
}).catch(err => {
    console.error("Error connecting to MongoDB:", err);
});

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
    res.send('Welcome to the Wanderlust!');
});

//Index Route
app.get('/listings', wrapAsync(async (req, res) => {
    const allListings= await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
}));

// New Route
app.get('/listings/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route
app.get('/listings/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id);
    res.render('listings/show.ejs', { listing });
}));

// Create Route
app.post("/listings",wrapAsync(async (req,res,next) => {
    if (!req.body.title || !req.body.description || !req.body.price || !req.body.location || !req.body.country) {
        return next(new ExpressError(400, 'Send valid data for listing'));
    } // 400 = bad request
    const newListing = new Listing({
    title: req.body.title,
    description: req.body.description,
    image: {
        url: req.body.imageUrl
    },
    price: req.body.price,
    location: req.body.location,
    country: req.body.country
    });
    await newListing.save();
    res.redirect('/listings');
}));

// Edit Route
app.get("/listings/:id/edit", wrapAsync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
app.put("/listings/:id",wrapAsync(async (req,res) => {
    let {id}= req.params;
    const updatedListing = await Listing.findByIdAndUpdate(id, {
        title: req.body.title,
        description: req.body.description,
        image: {
            url: req.body.imageUrl
        },
        price: req.body.price,
        location: req.body.location,
        country: req.body.country
    });
    res.redirect(`/listings/${id}`);
}));

app.delete("/listings/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

app.use((req, res, next) => {
    next(new ExpressError(404,'Page Not Found'));
});

app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something went wrong!" } = err;
    res.status(statusCode).render('error.ejs', { message });
});

app.listen(8080, () => {
    console.log("Server is running on port 8080");
});

// app.get("/testlisting", async (req, res) => {

//     const newListing = new Listing({
//         title: "My New Villa",
//         description: "By the beach.",
//         imageUrl: "",
//         price: 1500,
//         location: "Calangute, Goa",
//         country: "India"
//     });

//     await newListing.save();
//     res.send("New listing created successfully!");
// });
