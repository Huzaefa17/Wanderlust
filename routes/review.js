const express = require('express');
const router = express.Router({ mergeParams: true });
const wrapAsync = require('../utils/wrapAsync');
const { validateReview, isLoggedIn, isAuthor } = require('../middleware');
const reviewController = require('../controllers/review');


// Review Post Route
router.post('/', 
    isLoggedIn,
    validateReview,
    wrapAsync(reviewController.postReview));

// Review Delete Route
router.delete('/:reviewId', isLoggedIn, isAuthor, wrapAsync(reviewController.deleteReview));

module.exports = router;