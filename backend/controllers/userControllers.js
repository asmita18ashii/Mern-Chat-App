const asyncHandler = require("express-async-handler");
const User = require('../models/userModel');
const { generateToken } = require("../config/generateToken");

//signup func
const registerUser = asyncHandler(
    async (req, res) => {
        const { name, email, password, pic } = req.body;
        if (!name || !email || !password) {
            res.status(400)
            throw new Error("Please Enter all the Fields")
        }
        const userExist = await User.findOne({ email })

        if (userExist) {
            res.status(400);
            throw new Error('User already exist');
        }

        const user = await User.create({
            name, email, password, pic
        })

        if (user) {
            res.status(200).json({
                _id: user._id,
                name: user.name,
                email: user.email,
                pic: user.pic,
                token: generateToken(user._id)
            });

        } else {
            res.status(400)
            throw new Error("Failed to create the user")
        }
    }
)

//login func
const authUser = asyncHandler(async (req, res) => {
    console.log();
    
    const { email, password } = req.body
    const user = await User.findOne({ email })

    if (user && (await user.matchPassword(password))) {
        res.status(200).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            pic: user.pic,
            token: generateToken(user._id)
        });
    } else {
        res.status(400)
        throw new Error('User not Found')
    }
})

//  search user/users func
//    /user?search=piyush
const allUsers = asyncHandler(async (req, res) => {

    const keyword = req.query.search ? {
        $or: [
            { name: { $regex: req.query.search, $options: 'i' } },         //https://www.mongodb.com/docs/manual/reference/operator/query/regex/#std-label-regex-case-insensitive
            { email: { $regex: req.query.search, $options: 'i' } }
        ]

    } : {};
    // console.log('jj',keyword);
    //$ne ==>not equal to(used because id should not be req.use.id the one who logged in)
    const users = await User.find(keyword).find({ _id: { $ne: req.user._id } })

    res.send(users)
})

const updateUserPassword = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (email && password) {
        // Find the user by email
        const user = await User.findOne({ email: email });
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.password = password; // This will trigger the pre-save hook
        const updatedUser = await user.save();

        res.json(updatedUser);
    } else {
        res.status(400);
        throw new Error('Email and password are required');
    }
});

module.exports = { registerUser, authUser, allUsers, updateUserPassword }