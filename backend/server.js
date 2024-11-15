const express = require('express')
const app = express()
const cors = require('cors'); // Import cors
const path = require('path');



const mongoose = require('mongoose')
app.use(cors());
mongoose.connect('***REMOVED***', {useNewUrlParser: true})
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to Database'))


app.use('/profilePics', express.static(path.join(__dirname, '/profilePics')));

app.use(express.json())

const userRouter = require('./routes/users')
app.use('/users', userRouter)

app.listen(3001, () => console.log('Server Started'))