const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");

const accessChat = asyncHandler(async (req, res) => {
    const { userId } = req.body;
    if (!userId) {
        console.log("userId params not sent with request ");
        return res.sendStatus(400)
    }

    var isChat = await Chat.find({
        isGroupChat: false,
        $and: [
            { users: { $elemMatch: { $eq: req.user._id } } },   //it should have current user logged in (token will have this id) 
            { users: { $elemMatch: { $eq: userId } } },         //it should have the user id that is being passed
        ]
    }).populate("users", "-password").populate("latestMessage"); //it chat found it will populate users array excluding -password, see in chat modal we defined there ref user  now again populate the latestMessage

    //inside message modal we were having sender details so we have to populate that as well
    isChat = await User.populate(isChat, {
        path: 'latestMessage.sender',  //where we have to populate 
        select: "name pic email" //what all the feilds we have to populate
    })
    if (isChat.length > 0) {
        res.sendStatus(200).send(isChat[0])
    }
    else {
        var chatData = {
            chatName: "sender",
            isGroupChat: false,
            users: [req.user._id, userId]
        };
        try {
            const createdChat = await Chat.create(chatData)

            const fullChat = await Chat.findOne({ _id: createdChat._id }).populate("users", "-password");
            res.status(200).send(fullChat)
        } catch (error) {
            res.status(400)
            throw new Error(error.message);
        }
    }
})

const fetchChats = asyncHandler(async (req, res) => {
    try {
        Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
            .populate("users", "-password")
            .populate("groupAdmin", "-password")
            .populate("latestMessage")
            .sort({ updatedAt: -1 })
            .then(async (results) => {
                results = await User.populate(results, {
                    path: "latestMessage.sender",
                    select: "name pic email"
                });
                res.status(200).send(results)
            });
    } catch (err) {
        console.log(err)
        res.status(400)
        throw new Error(err.message)
    }
})


const createGroupChat = asyncHandler(async (req, res) => {
    if (!req.body.users || !req.body.name) {
        return res.status(400).send({ message: "Please fill all the fields" })
    }
    var users = JSON.parse(req.body.users);

    if (users.length < 2) {
        return res.sendStatus(400).send("More then 2 users are required to form a group chat");
    }

    users.push(req.user);

    try {
        const groupChat = await Chat.create({
            chatName: req.body.name,
            users: users,
            isGroupChat: true,
            groupAdmin: req.user
        });

        const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
            .populate("users", "-password")
            .populate("groupAdmin", "-password");

        res.status(200).json(fullGroupChat);
    } catch (err) {
        res.status(400);
        throw new Error(err.message)
    }
})

const renameGroup = asyncHandler(async (req, res) => {
    const { chatId, chatName } = req.body;

    const updatedChat = await Chat.findByIdAndUpdate(chatId,
        { chatName }, { new: true }).populate('users', "-password").populate("groupAdmin", "-password");

    if (!updatedChat) {
        res.status(404)
        throw new Error("Chat Not Found");
    } else {
        res.json(updatedChat)
    }


})


const addNewMember = asyncHandler(async (req, res) => {
    const { chatId, memberId } = req.body

    const added = await Chat.findByIdAndUpdate(chatId, { $push: { users: memberId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password");
    if (!added) {
        res.status(404)
        throw new Error("Chat Not Found");
    } else {
        res.json(added)
    }
})

const removeFromGroup = asyncHandler(async (req, res) => {
    const { chatId, memberId } = req.body

    const removed = await Chat.findByIdAndUpdate(chatId, { $pull: { users: memberId } }, { new: true }).populate("users", "-password").populate("groupAdmin", "-password")

    if (!removed) {
        res.status(404)
        throw new Error("Chat Not Found");
    } else {
        res.json(removed)
    }
})



module.exports = { accessChat, fetchChats, createGroupChat, renameGroup, addNewMember, removeFromGroup }