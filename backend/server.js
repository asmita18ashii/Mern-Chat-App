const express = require('express')
const { chats } = require('./data/data')
const cors = require('cors')
const dotenv = require('dotenv')
const connectDB = require('./config/db')
const color = require('colors')
const userRoute = require('./routes/usersRoute')
const chatRoute = require('./routes/chatRoutes');
const messageRoute = require("./routes/messageRoutes");
const { notFound, errorHandler } = require('./middleWares/errorMiddleWare')
const path = require("path")
const app = express();

dotenv.config()


connectDB()

app.use(cors({
    origin: 'http://localhost:3000', // Your React app's URL
    credentials: true, // Allow cookies if needed
}))
app.use(express.json())

app.use('/user', userRoute)
app.use('/chats', chatRoute)
app.use('/messages', messageRoute)




app.use(notFound)
app.use(errorHandler)

const port = process.env.PORT

/**............................Deployment......................... */

const _dirName1 = path.resolve();
if (process.env.NODE_ENV === "production") {
    app.use(express.static(path.join(_dirName1, "/frontend/build")))

    app.get("*", (req, res) => {
        res.sendFile(path.resolve(_dirName1, "frontend", "build", 'index.html'))
    })
} else {
    app.get('/', (req, res) => {
        res.sendStatus(200).send('api is running')
    })
}

/**............................Deployment......................... */





const server = app.listen(port, console.log(`server started on server ${port}`.yellow.bold))

const io = require('socket.io')(

    server, {
    pingTimeout: 60000,
    cors: {
        origin: 'http://localhost:3000', // Allow your frontend's origin
        methods: ['GET', 'POST'],       // Allowed methods
        credentials: true,              // Allow cookies
    }
}
)

io.on('connection', (socket) => {

    socket.on("setup", (userData) => {
        socket.join(userData._id);
        console.log(userData._id)
        socket.emit('connected')
    });

    socket.on("joinChat", (room) => {
        socket.join(room);
        console.log('user Joined room ' + room)
    });

    socket.on("typing", (room) =>
        socket.in(room).emit("typing")

    )

    socket.on("stop typing", (room) =>
        socket.in(room).emit("stop typing")
    )

    socket.on("newMessage", (newMessageReceived) => {
        var chat = newMessageReceived.chat;
        if (!chat.users) return console.log('chat.users not defined');

        chat.users.forEach(user => {
            if (user._id == newMessageReceived.sender._id) return
            socket.in(user._id).emit('message received', newMessageReceived)
        })
    });

    socket.off('setup', (userData) => {
        console.log("user disconnected")
        socket.leave(userData._id)
    })
})