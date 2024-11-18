const express = require('express')
const session = require('express-session');
const MongoStore = require('connect-mongo')
const app = express()
const cors = require('cors'); // Import cors
const path = require('path');
app.use(cors({
    origin: 'http://localhost:3000', 
    credentials: true,              
}));

const mongoose = require('mongoose')

mongoose.connect('***REMOVED***', {useNewUrlParser: true})
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
            mongoUrl: '***REMOVED***', // Replace with your MongoDB URI
            collectionName: 'sessions',
        }),
    })
);


app.use(express.json())

const userRouter = require('./routes/users');
const gameRouter = require('./routes/games');
const gameImageRouter = require('./routes/gameimages');

app.use('/users', userRouter)
app.use('/game', gameRouter)
app.use('/gameimage', gameImageRouter)

app.listen(3001, () => console.log('Server Started'))


