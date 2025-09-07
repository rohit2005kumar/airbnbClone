const User=require('../module/user')

// render signUp page
module.exports.renderSignUp=(req,res)=>{
    res.render("user/signup")
}

// add sign up details to DB
module.exports.signUpdetailsSubmit=async(req,res,next)=>{
     try{
        const{username,email,password}=req.body;
        let newUser=new User({username:username,
            email:email })
        let regUser=await  User.register(newUser,password)
        console.log(regUser)
        // after signup then directly login
        req.login(regUser,(err)=>{
            if(err){ return next(err)}
            req.flash("success","Thanks for Registration")
          return  res.redirect('/listings')
        })
        // req.flash('success',"Registration Successfully")
        
        // res.redirect('/listings')

      }catch(e){
        req.flash("error",e.message)
        res.redirect('/signup')
    }   
}

// login Page render
module.exports.LoginPage=(req,res)=>{
    res.render('user/login')
}


// check login details authencation with login
module.exports.login=async(req,res)=>{
req.flash("success","Welcome to my website Thanks for you login!")
// console.log(req.user)
// console.log(res.locals.redirctUrl)
const url=res.locals.completeUrl || "/listings"
res.redirect(url)

}

// logout
module.exports.logout=(req,res,next)=>{
    // console.log(req.user)
req.logout((err)=>{
    if(err){
     return  next(err)
    }
    req.flash("success","Logged Out")
    res.redirect('/listings')
})
}