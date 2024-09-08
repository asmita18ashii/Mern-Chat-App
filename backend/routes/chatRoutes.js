
const route=require('express').Router()
const { accessChat, fetchChats, createGroupChat, renameGroup, addNewMember, removeFromGroup } = require('../controllers/chatControllers');
const { protect } = require('../middleWares/authMiddleWare')

route.route('/').post(protect,accessChat);
route.route('/').get(protect,fetchChats)
route.route('/groups').post(protect,createGroupChat)
route.route('/groups/rename').put(protect,renameGroup)
route.route('/groups/addmember').put(protect,addNewMember)
route.route('/groups/removemember').put(protect,removeFromGroup)
// route.route('/groupadd').put(protect,addToGroup)








module.exports =route