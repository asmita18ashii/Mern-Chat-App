const express=require("express");
const { protect } = require("../middleWares/authMiddleWare");

const sendMessageController=require("../controllers/sendMessageController")
const allMessagesController=require("../controllers/allMessagesController")

const router=express.Router();

router.route("/").post(protect,sendMessageController);
router.route("/:chatId").get(protect,allMessagesController);


module.exports=router