const express=require('express')
const router=express.Router();
const User=require('../module/user');
const passport = require('passport');
const {saveRedirectUrl}=require('../middleware/middleware')
const {renderSignUp, signUpdetailsSubmit, LoginPage,login, logout}=require('../controllers/user')

// render signup form
router.route('/signup')
.get(renderSignUp)
.post(signUpdetailsSubmit);


// login page render
router.route('/login')
.get(LoginPage)

.post(saveRedirectUrl,
passport.authenticate('local',{failureRedirect:'/login',failureFlash:true}),login)

router.route('/logout')
.get(logout)

module.exports=router;