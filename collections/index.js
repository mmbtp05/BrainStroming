const mongoose = require("mongoose");
mongoose.set('strictQuery', false);
mongoose.connect("mongodb://0.0.0.0:27017/Brainstroming").then(()=>{
    console.log(`connection successfull`);
}).catch((e)=>{
    console.log(`gadbadi`);
})