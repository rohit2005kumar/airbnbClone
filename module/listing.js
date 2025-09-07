const mongoose = require('mongoose');
const review = require('./review');
const user=require("./user")
// const { listingschema } = require('../utils/schemajoi');
const schema = mongoose.Schema;
const listingSchema = new schema({
  title: {
    type: String,

  },
  description: String,
  image: {
      url:String,
      filename:String
  },
  price: Number,
  location: String,
  country: String,
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: review
    }
  ],
  owner:{
    type:mongoose.Schema.Types.ObjectId,
    ref:user
  }
});


listingSchema.post('findOneAndDelete', async function (listing) {
  if (listing) {
    await review.deleteMany({_id :{ $in:listing.review }})
  }

})
const listing = new mongoose.model("listing", listingSchema);


module.exports = listing;
