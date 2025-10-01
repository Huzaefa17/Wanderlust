const Listing = require('../models/listing');

module.exports.index = async (req, res) => {
    const allListings= await Listing.find({});
    res.render('listings/index.ejs', { listings: allListings });
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
    const newListing = new Listing(req.body.listing);
    newListing.owner = req.user._id; // associating the listing with the logged in user
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
    res.render("listings/edit.ejs", {listing});
};

module.exports.update= async (req,res) => {
    let {id}= req.params;
    await Listing.findByIdAndUpdate(id, req.body.listing, {runValidators: true, new: true});
    req.flash('success', 'Successfully updated the listing!');
    res.redirect(`/listings/${id}`);
};

module.exports.delete= async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash('success', 'Successfully deleted the listing!');
    res.redirect("/listings");
};
