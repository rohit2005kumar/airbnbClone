const mongoose=require('mongoose')
const user=require('./user')
const reviewModel=new mongoose.Schema({
    comment :  String,
    rating:{
        type:Number,
        min:1,
        max:5
    },
    createdAt:{
        type:Date,
        default:Date.now()
    },
    author:{
        type:mongoose.Schema.Types.ObjectId,
        ref:user
    }

});
const review=mongoose.model("review",reviewModel);
module.exports=review;

