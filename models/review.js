const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    rating: { type: Number, required: true, min: 1, max: 5 },
    comment: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' } // Reference to User model
});

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;