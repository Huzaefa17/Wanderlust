const mongoose= require('mongoose');
const Review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { 
        type: String, default: "https://png.pngtree.com/png-vector/20190909/ourmid/pngtree-house-logo-designs-inspiration-isolated-on-white-background-png-image_1726009.jpg", // default image URL
        set:  (v)=> v==="" ? "https://png.pngtree.com/png-vector/20190909/ourmid/pngtree-house-logo-designs-inspiration-isolated-on-white-background-png-image_1726009.jpg" : v // ternary operator to set default image if empty
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }] // Array of references to Review model
});

listingSchema.post('findOneAndDelete', async function(listing) {
    if(listing) {
        await mongoose.model('Review').deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
