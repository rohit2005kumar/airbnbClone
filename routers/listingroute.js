const express=require('express')
const router=express.Router({mergeParams:true});
const multer=require('multer')
 const {storage}=require('../cloudinaryImagesave')
const upload = multer({storage })
const  asynwrap=require('../utils/wrapasync');
const{ islogged,isowner,validateListing}=require('../middleware/middleware');
const {index,show, addNewListingPage,saveToDBNewListing,
       editPage,editAndSaveToDB, deleteListing}=require('../controllers/listing');



// index route all listingx
router.route('/')
.get(asynwrap(index));
// show route
router.route('/show/:id')
.get(asynwrap(show));

// send form to addnew
router.route('/new')
.get(islogged,addNewListingPage);


// collect data of new listing
router.route('/submitNewListings')
.post(
   islogged,
   validateListing,
   upload.single('listings[image]'),
asynwrap(saveToDBNewListing));


// .post(,(req,res)=>{
//    console.log(req.file)
//    res.send(req.file)
// })

//edit your listing
router.route('/edit/:id')
.get(islogged,asynwrap(editPage))
.put(isowner,upload.single('listings[image]'),asynwrap(editAndSaveToDB));

//delete route
router.route('/delete/:id')
.delete(islogged,isowner,asynwrap(deleteListing));

module.exports=router