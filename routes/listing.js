const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const { listingSchema } = require('../schema.js');
const Listing = require('../models/listing');


const validateListing = (req, res, next) => {
    const { error } = listingSchema.validate(req.body);
    if (error) {
        const Errmsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, Errmsg);
    }
    next();
};


//Index Route
router.get('/', wrapAsync(async (req, res) => {
    const allListings= await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
}));

// New Route
router.get('/new', (req, res) => {
    res.render('listings/new.ejs');
});

// Show Route
router.get('/:id', wrapAsync(async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate('reviews');
    res.render('listings/show.ejs', { listing });
}));

// Create Route
router.post("/",
    validateListing,
    wrapAsync(async (req,res,next) => {
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    res.redirect('/listings');
}));

// Edit Route
router.get("/:id/edit", wrapAsync(async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    res.render("listings/edit.ejs", {listing});
}));

// Update Route
router.put("/:id",
    validateListing,
    wrapAsync(async (req,res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true, new: true});
    res.redirect(`/listings/${id}`);
}));

// Delete Route
router.delete("/:id", wrapAsync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
}));

module.exports = router;