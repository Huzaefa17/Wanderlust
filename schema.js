const joi= require('joi');

module.exports.listingSchema= joi.object({
    listing : joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        price: joi.number().min(0).required(),
        location: joi.string().required(),
        country: joi.string().required(),
        category: joi.string()
            .valid('Trending', 'Rooms', 'Iconic Cities', 'Mountains', 'Castles', 'Amazing Pools', 'Camping', 'Farms', 'Arctic', 'Beachfront', 'Lakeside', 'Forests')
            .required()
        // image is handled by multer as req.file, image is not in req.body
    }).required()
});
module.exports.reviewSchema= joi.object({
    review: joi.object({
        rating: joi.number().min(1).max(5).required(),
        comment: joi.string().required()
    }).required()
});