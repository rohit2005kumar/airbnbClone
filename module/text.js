
const mongoose=require('mongoose')
const mongo_Url="mongodb://127.0.0.1:27017/wonderLust";
const review=require('./review')
const listing=require('./listing');
const { types } = require('joi');
async function main(){
await mongoose.connect(mongo_Url)
}
main().then((res)=>{
    console.log("connected to the db")})
.catch((err)=>{
    console.log("error",err)
})

//insert data into delete
async function clearreviewsarray() {
   let data=await listing.findByIdAndUpdate('685d7e67201ebdabba51bee1',{review:[]});
 console.log(data)


    
}

clearreviewsarray()
