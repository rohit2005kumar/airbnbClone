const listing=require('../module/listing')
const review = require('../module/review')

// add review 
module.exports.addreview=async(req,res)=>{
     // collect id from the URL
    let {id}=req.params;
    console.log(req.body)
    // collect data from the user
    let currreview=req.body.review
    
    console.log(currreview)
    // console.log(typeof(currreview))

   let currListing= await listing.findById(id);
    let newreview= await new review(currreview);
    newreview.author=res.locals.currUser._id
    currListing.review.push(newreview)
    
  await currListing.save()
   await newreview.save()
   //flash
  req.flash('success','Review Added')
  console.log( "review saved")
  res.redirect(`/listings/show/${id}`)
  console.log(currListing)   
}

// delete review

module.exports.deletereview=async(req,res)=>{
  // console.log(req.body)
  const  {id,reviewid}=req.params;  
  await review.findByIdAndDelete(reviewid);
  await listing.findByIdAndUpdate(id,{$pull:{review:reviewid}})
  //flash
  req.flash('success','Review Deleted')
  console.log("review deleted")
  res.redirect(`/listings/show/${id}`)
}