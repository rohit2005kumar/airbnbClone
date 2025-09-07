const listing = require('../module/listing')

// index 
module.exports.index = async (req, res, next) => {
  const allListing = await listing.find({});
  //    console.log(allListing)
  res.render("listings/index.ejs", { allListing });
}

// show function
module.exports.show = async (req, res, next) => {
  let { id } = req.params;
  const actualData = await listing.findById(id).populate({ path: "review", populate: { path: "author" } }).populate("owner")

  if (!actualData) {
    req.flash('error', 'Listing does not exist')
    return res.redirect('/listings')
  }
  res.render("listings/show", { actualData })
}

// add  new listing page render
module.exports.addNewListingPage = (req, res) => {

  res.render("listings/Addnew");
}

// add new listing data sveto DB

module.exports.saveToDBNewListing = async (req, res, next) => {
  // accessing path and filename from req.file
  const url=req.file.path
  const filename=req.file.filename

  const Newlisting = req.body.listings;
  // console.log(Newdata)
  const n1 = new listing(Newlisting)
  n1.image={url,filename}
  n1.owner = req.user._id
  //   console.log(req.user._id)

  //flash
  req.flash('success', 'New Listing Added')

  await n1.save();
  res.redirect("/listings")
  console.log("data save to the db");
}

// edit listing page render
module.exports.editPage = async (req, res, next) => {
  let { id } = req.params;
  let data = await listing.findById(id);
  let currentUrl=data.image.url
currentUrl=currentUrl.replace('/upload','/upload/h_200,w_200,e_blur:300')
  // console.log(currentUrl)

  if (!data) {
    req.flash('error', 'Listing does not exist')
    return res.redirect('/listings')
  }
  res.render("listings/edit", { data,currentUrl })
}

// edit data submit to the db
module.exports.editAndSaveToDB = async (req, res, next) => {
  const updatedData = req.body.listings;
  let { id } = req.params;
 
  // check before both login user and listing user are same
  // let loginuser=await listing.findById(id)
  // console.log(loginuser)
   console.log(req.file)
   let editedListing=await listing.findByIdAndUpdate(id, updatedData);
  
 
  if(req.file){
  const url=req.file.path
  const filename=req.file.filename
   editedListing.image={url,filename}
   await editedListing.save();
  }
  console.log(editedListing)
  req.flash('success', 'Edited SuccessFully')
  res.redirect('/listings')
}


// delete listing 
module.exports.deleteListing = async (req, res, next) => {

  let { id } = req.params;
  await listing.findByIdAndDelete(id)
  console.log("deleted successfully")
  req.flash('success', 'Listing Deleted')
  res.redirect('/listings');
}