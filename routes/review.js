const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const Review = require('../models/review');
const { validateReview, isLoggedIn, isAuthor } = require('../middleware');


// Review Post Route
router.post('/', 
    isLoggedIn,
    validateReview,
    wrapAsync( async (req, res) => {
    const { id } = req.params;
    const { rating, comment } = req.body.review;

    const listing = await Listing.findById(id);
    
    // Add the review to the listing's reviews array
    let newReview = new Review({ rating, comment });
    newReview.author = req.user._id; // associating the review with the logged in user

    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash('success', 'Created new review!');
    res.redirect(`/listings/${id}`);
}));
// Review Delete Route
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync( async (req, res) => {
    const { id, reviewId } = req.params;
    await Listing.findByIdAndUpdate(id,{$pull: {reviews: reviewId}});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Review deleted!');
    res.redirect(`/listings/${id}`);
}));

module.exports = router;