const { registerUser, authUser, allUsers, updateUserPassword } = require('../controllers/userControllers')
const { protect } = require('../middleWares/authMiddleWare')

const route=require('express').Router()

route.route('/').post(registerUser).get(protect,allUsers);
route.route("/reset-password").put(updateUserPassword)
route.post("/login",authUser)


module.exports =route