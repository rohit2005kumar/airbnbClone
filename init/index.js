const mongoose=require('mongoose');
const list=require('../module/listing');
const sampleData=require("./sampleData");
async function main(){
try{await mongoose.connect("mongodb://127.0.0.1:27017/wonderLust")}catch(err){
  console.log("error not connect to the db")
}
}
main()
.then(console.log("connected to the DB"))
.catch((err)=>{console.log(err)});
// function to clean existing db and initialized with new data
const initDB=async function () {
try{
  sampleData.data=  sampleData.data.map((obj)=>({...obj,owner:"68ae9d99adf113ca95413fc9"}))
 
let data=  await list.insertMany(sampleData.data);
console.log(data)
  console.log("Data saved in db");

}catch(err){
  console.log("not inserted",err)
}
    
}
initDB();


