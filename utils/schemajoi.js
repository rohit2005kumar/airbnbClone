const joi=require('joi')
 module.exports.listingschema =joi.object({
    listings: joi.object({
        title:joi.string().required(),
        description:joi.string().required(),
        price:joi.number().min(1).required(),
        location:joi.string().required(),
        country:joi.string().required()
    }).required()
})

module.exports.reviewSchema=joi.object({
    review:joi.object({
        rating:joi.number().min(1).max(5).required(),
        comment:joi.string().required()
    })
})