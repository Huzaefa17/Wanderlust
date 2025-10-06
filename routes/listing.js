const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const { isLoggedIn, isOwner, validateListing } = require('../middleware');
const listingController = require('../controllers/listing');
const multer  = require('multer');
const { storage } = require('../cloudConfig');
const upload = multer({ storage });

router.route('/')
    .get(wrapAsync(listingController.index))
    .post(
    isLoggedIn,
    upload.single('listing[image]'),
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
    upload.single('listing[image]'),
    validateListing,
    wrapAsync(listingController.update));


// Edit Route
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editForm));

module.exports = router;