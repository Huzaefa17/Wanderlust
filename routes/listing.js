const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Listing = require('../models/listing');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');

// Index Route
router.get('/', wrapAsync(listingController.index));

// New Route
router.get('/new', isLoggedIn, listingController.newForm);

// Show Route
router.get('/:id', wrapAsync(listingController.show));

// Create Route
router.post("/",
    isLoggedIn,
    validateListing,
    wrapAsync(listingController.create));

// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

// Update Route
router.put("/:id",
    isLoggedIn,
    isOwner,
    validateListing,
    wrapAsync(listingController.update));

// Delete Route
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.delete));

module.exports = router;