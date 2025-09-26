const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const Review = require('../models/review');
const ExpressError = require('../utils/ExpressError');
const { reviewSchema } = require('../schema.js');


const validateReview = (req, res, next) => {
    const { error } = reviewSchema.validate(req.body);
    if (error) {
        const Errmsg = error.details.map(el => el.message).join(',');
        throw new ExpressError(400, Errmsg);
    }
    next();
};

// Review Post Route
router.post('/', 
    validateReview,
    wrapAsync( async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body.review;

    const listing = await Listing.findById(id);
    
    // Add the review to the listing's reviews array
    let newReview = new Review({ rating, comment });
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();

    res.redirect(`/listings/${id}`);
}));
// Review Delete Route
router.delete('/:reviewId', wrapAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    res.redirect(`/listings/${id}`);
}));

module.exports = router;