const mongoose=require('mongoose');
const dotenv=require('dotenv')

dotenv.config()
const connectDB=async()=>{
    try{
        
        const conn=await mongoose.connect(process.env.MONGO_URI,{
            
        }) 
        console.log("mongoDb connected",conn.connection.host.cyan.underline);
            
    }catch(err){
        console.log(err.red)
        process.exit()
    }
}

module.exports=connectDB