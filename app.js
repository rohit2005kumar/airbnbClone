require('dotenv').config()
// console.log(process.env)
const express=require('express');
const app=express();
const method=require('method-override');
const path=require('path')
const ejsMate=require('ejs-mate');
const mongoos=require("mongoose");
const AtlasUrl=process.env.ATLAS_URL
const ExpressError = require('./utils/ExpressError');
const listingRouter=require('./routers/listingroute');
const reviewRouter=require('./routers/reviewroute')
const userroute=require('./routers/userroute')
const session=require('express-session')
const MongoStore = require('connect-mongo');
const flash=require('connect-flash')
const passport=require('passport')
const localStrategy=require('passport-local')
const User=require('./module/user');
const listing = require('./module/listing');
// mongoAtlas session
const store=MongoStore.create({
    mongoUrl:process.env.ATLAS_URL,
    crypto: {
    secret:process.env.SECRET
  },
  dbName:"WonderLustSession",
  touchAfter:24* 60*60
})

const sessionOptions={
    store:store,
    secret:process.env.SECRET,
    saveUninitialized:true,
    resave:false,
    cookie:{
             expires:Date.now()*24*60*60*1000*3,
             maxAge:1000*60*60*24*3,
             httpOnly:true
        
            }

}
app.use(session(sessionOptions))
app.use(flash());

// authentication via passort js ,passport -local and passport-local-mongoose
app.use(passport.initialize())
app.use(passport.session())
passport.use(new localStrategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.use((req,res,next)=>{
    res.locals.success=req.flash('success')
    res.locals.error=req.flash('error')
    // console.log(req.user)
    res.locals.currUser=req.user // current login user
   
    next()
})


app.set("view engine","ejs");
app.set("views",path.join(__dirname,"views"));
app.use(express.urlencoded({extended:true}));
app.use(express.static(path.join(__dirname ,"public")))
app.engine('ejs', ejsMate);
app.use(express.json());  

app.use(method('_method'))
app.use('/listings',listingRouter)
app.use('/listings/:id/review',reviewRouter)
app.use('/',userroute)


app.listen(8080,()=>{
    console.log("app is listening to the port no 8080")
});

//connecting to the db
main().then(()=>{
    console.log("connected to DB")
})
.catch((err)=>{
    console.log(err)
});
async function main(){
    await mongoos.connect(AtlasUrl);
};

//creating listing collecting
// app.get('/listing',async(req,res)=>{
//     const l1=new listing({
//         title:" Nobies villa",
//         location:"tokyo",
//         country:"japan",
//         price:1200,
//         description:"in this villa there are two bedroom,a kitchen and an attach bathrom"
//     })
//      await l1.save();
//      console.log("data saved")
//      res.send("data saved")
// });

app.get('/search',async(req,res)=>{
    console.log(req.query.search)
    const searchItem=req.query.search
   let data=await listing.find({country:searchItem})
   
   if(data.length > 0){
   return res.render('listings/search',{data})
    
   }
     req.flash("error","listing does not exist")
     res.redirect('/listings')
})
// demo user 
// app.get('/demouser',async(req,res)=>{
//     let fakeUser=new User({
//         email:"apnaCollegeSRGC@gmail.com",
//         username:"SRGC_MZN"
//     })
// let newuser= await User.register(fakeUser,"SRGC@123")
// res.send(newuser)
// })

// all routes fatching
app.all('*users',(req,res,next)=>{ 
    next(new ExpressError(404,"page not found"))
})
// error handler middleware
app.use((err,req,res,next)=>{
    let {statuscode=400,message}=err;
res.render('listings/Error',{err})
    // res.status(statuscode).send(message)
})