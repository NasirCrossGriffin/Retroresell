const express = require('express')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const app = express()
const http = require('http')
const server = http.createServer(app);
const cors = require('cors'); // Import cors
const path = require('path');
const { Server } = require("socket.io");
const AWS = require('aws-sdk');
const watchMessages = require("./WatchMessages");
if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
    console.log("Loaded .env file for development");
} else {
    console.log("Running in production mode");
}
console.log(process.env.AWS_SECRET)
console.log(process.env.AWS_ACCESS)



const io = process.env.PORT ? new Server(server) : new Server(server,  {
    cors: {
        origin: "http://localhost:3000", // Allow requests from this origin
        methods: ["GET", "POST"], // Allow these HTTP methods
        credentials: true, // Allow cookies to be sent with requests
    },
});

if (process.env.NODE_ENV !== "production") {
    console.log("cors accepted for port 3000")
    app.use(cors({
        origin: 'http://localhost:3000', 
        credentials: true,              
    }));
}

const mongoURL = process.env.MONGO_URL;

const session_secret = process.env.SESSION_SECRET; // Fetch from environment variables


const mongoose = require('mongoose')

mongoose.connect((mongoURL), {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


// Configure AWS SDK
AWS.config.update({
    accessKeyId: process.env.AWS_ACCESS,       // Correct variable for access key
    secretAccessKey: process.env.AWS_SECRET,  // Correct variable for secret key
    region: 'us-east-2',                      // Your bucket region
});
  
  // Create S3 instance
  const s3 = new AWS.S3();

app.use('/profilePics', express.static(path.join(__dirname, '/profilePics')));

app.use('/gameImages', express.static(path.join(__dirname, '/gameImages')));

app.use(
    session({
        secret: session_secret, // Replace with a secure secret
        resave: false, // Don't save session if it wasn't modified
        saveUninitialized: false, // Don't create a session until something is stored
        cookie: {
            httpOnly: true, // Prevent JavaScript access to cookies
            secure: false, // Set to true if using HTTPS
            sameSite: 'Lax', // Allow cross-origin cookies
            maxAge: 1000 * 60 * 60 * 24, // 1-day expiration
        },
        store: MongoStore.create({
            mongoUrl: mongoURL, // Replace with your MongoDB URI
            collectionName: 'sessions',
        }),
    })
);

io.on("connection", (socket) => {
    console.log("A user connected");

    socket.on("message", (data) => {
        console.log("Message received:", data);
        io.emit("broadcast", data); // Broadcast to all clients
    });

    socket.on("disconnect", (reason) => {
        console.log("User disconnected:", reason);
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
    res.redirect('/storefront');
});

const uploadRoute = require('./routes/upload'); // Adjust the path as needed

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/aws', uploadRoute);

app.use(express.static(path.join(__dirname, "build")));

// Serve React for all non-API routes
app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, "build", "index.html"));
});

// Start the server
const PORT = process.env.PORT || 3001; // Use $PORT in production, 3001 for local dev
server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});



