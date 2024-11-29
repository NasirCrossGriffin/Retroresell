const express = require('express')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const app = express()
const http = require('http')
const server = http.createServer(app);
const cors = require('cors'); // Import cors
const path = require('path');
const { Server } = require("socket.io");
const watchMessages = require("./WatchMessages");
const io = new Server(server,  {
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST"], // Allow these HTTP methods
        credentials: true, // Allow cookies to be sent with requests
    },
});

app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,              
}));

const mongoose = require('mongoose')

mongoose.connect('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.use('/profilePics', express.static(path.join(__dirname, '/profilePics')));

app.use('/gameImages', express.static(path.join(__dirname, '/gameImages')));

app.use(
    session({
        secret: 'your_secret_key', // Replace with a secure secret
        resave: false, // Don't save session if it wasn't modified
        saveUninitialized: false, // Don't create a session until something is stored
        cookie: {
            httpOnly: true, // Prevent JavaScript access to cookies
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax', // Allow cross-origin cookies
            maxAge: 1000 * 60 * 60 * 24, // 1-day expiration
        },
        store: MongoStore.create({
            mongoUrl: 'xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx', // Replace with your MongoDB URI
            collectionName: 'sessions',
        }),
    })
);

io.on("connection", (socket) => {
    console.log("A user connected");

    // Emit an event to the connected client
    socket.emit("welcome", { message: "Welcome to the real-time server!" });

    // Handle incoming messages
    socket.on("message", (data) => {
        console.log("Message received:", data);
        io.emit("broadcast", data); // Broadcast the message to all connected clients
    });

    // Handle disconnect
    socket.on("disconnect", () => {
        console.log("A user disconnected");
    });
});

watchMessages(io);

app.use(express.json())

const userRouter = require('./routes/users');
const gameRouter = require('./routes/games');
const gameImageRouter = require('./routes/gameimages');
const messagesRouter = require('./routes/messages');

app.use('/users', userRouter);
app.use('/game', gameRouter);
app.use('/gameimage', gameImageRouter);
app.use('/message', messagesRouter);

app.get('/', (req, res) => {
    res.redirect('/retroresell');
});

app.use(express.static(path.join(__dirname, "build")));

// Serve React for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Start the server
const PORT = 3001;
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});


