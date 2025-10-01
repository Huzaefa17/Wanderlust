const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.create));

// New Route
router.get('/new', isLoggedIn, listingController.newForm);

router.route('/:id')
    .get(wrapAsync(listingController.show))
    .delete(isLoggedIn, isOwner, wrapAsync(listingController.delete))
    .put(
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.update));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

module.exports = router;