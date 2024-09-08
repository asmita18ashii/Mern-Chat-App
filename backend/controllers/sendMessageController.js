const asyncHandler = require("express-async-handler");
const MessageModel = require("../models/messageModel");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");

const sendMessage = asyncHandler(async (req, res) => {
    const { content, chatId } = req.body;

    if (!content || !chatId) {
        return res.sendStatus(400);
    }

    var newMessage = {
        sender: req.user._id,
        content: content,
        chat: chatId,
    }

    try {
        var message = await MessageModel.create(newMessage);

        message = await message.populate("sender", "name pic");

        message = await message.populate("chat");
        message = await User.populate(message, {
            path: "chat.users",
            select: "name pic email",
        })

        await Chat.findByIdAndUpdate(chatId, {
            latestMessage: message,
        })

        res.json(message)


    } catch (error) {

        res.status(400)
        return new Error(error.message);
    }
})


module.exports = sendMessage