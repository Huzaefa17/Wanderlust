const Listing = require('../models/listing');
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapToken = process.env.MAP_TOKEN;
const geocodingClient = mbxGeocoding({ accessToken: mapToken });

module.exports.index = async (req, res) => {
     const { category,q } = req.query;
    
    let filter = {};
    if (category && category !== 'all') {
        filter.category = category;
    }

    // Filter by search query (title or category)
    if (q) {
        filter.$or = [
            { title: { $regex: q, $options: 'i' } }, // i:case-insensitive search
            { category: { $regex: q, $options: 'i' } },
            { location: { $regex: q, $options: 'i' } },
            { country: { $regex: q, $options: 'i' } }
        ];
    }

    const allListings= await Listing.find(filter);
    res.render('listings/index.ejs', { listings: allListings, selectedCategory: category || 'all', searchQuery: q || '' });
};
module.exports.newForm=(req, res) => {
    res.render('listings/new.ejs');
};

module.exports.show= async (req, res) => {
    const listing = await Listing.findById(req.params.id).populate({path: 'reviews', populate: { path: 'author'}}).populate('owner');
    if (!listing){
        req.flash('error', 'Cannot find the listing!');
        return res.redirect('/listings');
    }
    res.render('listings/show.ejs', { listing });
};

module.exports.create = async (req,res,next) => {
    const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
})
    .send();

    const newListing = new Listing(req.body.listing);
    if (req.file) { // else use default image from data.js
        newListing.image = { 
            url: req.file.path, 
            filename: req.file.filename 
        };
    }
    newListing.owner = req.user._id; // associating the listing with the logged in user

    newListing.geometry = {
        type: 'Point',
        coordinates: response.body.features[0].geometry.coordinates
    };

    await newListing.save();
    req.flash('success', 'Successfully created a new listing!');
    res.redirect('/listings');
};

module.exports.editForm= async (req,res) =>{
    let {id} =req.params;
    const listing = await Listing.findById(id);
    if(!listing){
        req.flash('error', 'Cannot find the listing!');
        return res.redirect('/listings');
    }
    let originalImage=listing.image.url;
    listing.image.url=originalImage.replace("/upload","/upload/w_250/"); // resizing the image to width 300px using cloudinary URL transformation
    res.render("listings/edit.ejs", {listing});
};

module.exports.update= async (req,res) => {
    let {id}= req.params;
    let listing = await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true, new: true});
    if (!listing) {
    req.flash('error', 'Cannot find the listing!');
    return res.redirect('/listings');
}

    const response = await geocodingClient.forwardGeocode({
    query: req.body.listing.location,
    limit: 1
})
    .send();
    listing.geometry = {
        type: 'Point',
        coordinates: response.body.features[0].geometry.coordinates
    };
    if (req.file) {
        listing.image = {
            url: req.file.path,
            filename: req.file.filename
        };
    }
    await listing.save();
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
};

module.exports.delete= async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect("/listings");
};
