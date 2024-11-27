const asyncHandler=require("express-async-handler")
const Message = require("../models/messageModel")


const getMessages=asyncHandler(async(req,res)=>{
 try{

    const messages=await Message.find({chat:req.params.chatId}).populate("sender","name pic email").populate("chat");

    res.json(messages);



 }catch(error){
    res.status(400)
    return new Error(error?.message)

 }
})


module.exports=getMessages