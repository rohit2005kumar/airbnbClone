
const {listingschema,reviewSchema}=require('../utils/schemajoi')
const ExpressError=require('../utils/ExpressError');
const listing = require('../module/listing');
const review=require('../module/review')


const islogged=(req,res,next)=>{
   // console.log(req.originalUrl)
   // console.log(req.user)
 if(!req.isAuthenticated()){
   req.session.redirectUrl=req.originalUrl;
        req.flash("error","Please Login Before do this")
       return res.redirect('/login')
    }
    next()
}
const saveRedirectUrl=(req,res,next)=>{
   if(req.session.redirectUrl){
      res.locals.completeUrl=req.session.redirectUrl
   }
   next()
   
}

const isowner=async(req,res,next)=>{
   //  curr user:- req.user
   // owner user:- req.params id
   const {id}=req.params;
   const owneroflisting= await listing.findById(id)
   if(res.locals.currUser && ! res.locals.currUser._id.equals(owneroflisting.owner._id)){
    req.flash("error","you don`t have right permision")
    return res.redirect(`/listings/show/${id}`)
}
next()
}
// joi validate schema function middleware serverside validation

const validateListing=(req,res,next)=>{
    let {error}=listingschema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg)
    }
    else{
     next();
    }
}


// validate review from server side joi
const validateReview=(req,res,next)=>{
    let {error}=reviewSchema.validate(req.body);
    if(error){
        let errmsg=error.details.map((el)=>el.message).join(",");
        throw new ExpressError(400,errmsg)
    }
    else{
     next();
    }
}

// review author
const isReviewAuthor= async(req,res,next)=>{
    const {id,reviewid}=req.params;
    console.log(reviewid)
    const currReview= await review.findById(reviewid)
    console.log(currReview)

    console.log(currReview.author)
    console.log(res.locals.currUser)

    if(res.locals.currUser && !res.locals.currUser._id.equals(currReview.author._id)){
        req.flash("error","you don`t have right permision")
    return res.redirect(`/listings/show/${id}`)
    }
    next()


}

module.exports={ islogged,saveRedirectUrl,isowner,validateReview,validateListing,isReviewAuthor}