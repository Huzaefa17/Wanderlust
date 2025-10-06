const mongoose= require('mongoose');
const Review = require('./review.js');

const listingSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { 
        url:{type : String, default: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"}, // default image URL
        filename: { type: String, default: "Wanderlust/default" }  // default filename
    },
    price: { type: Number, required: true },
    location: { type: String, required: true },
    country: { type: String, required: true },
    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Review' }], // Array of references to Review model
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model 
    geometry: {
        type: { 
            type: String, 
            enum: ['Point'], // location type must be 'Point'
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    category: {
    type: String,
    enum: ['Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Beachfront', 'Lakeside', 'Forests'],
    required: true
    }

});

listingSchema.post('findOneAndDelete', async function(listing) {
    if(listing) {
        await mongoose.model('Review').deleteMany({ _id: { $in: listing.reviews } });
    }
});

const Listing = mongoose.model('Listing', listingSchema);
module.exports = Listing;
