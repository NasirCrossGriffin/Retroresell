const express = require('express')
const router = express.Router()
const multer = require("multer");
const Game = require('../models/Game')
const User = require('../models/User')
const path = require("path");
const bcrypt = require('bcrypt');


module.exports = router

//Routes

router.get('/', async (req, res) => {
    try {
        const Games = await Game.find();
        res.json(Games);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGame, (req, res) => {
    res.send(res.game)
})

router.get('/name/:name', getGameByName, (req, res) => {
    res.send(res.game)
})

router.post('/', async (req, res) => {
    console.log(req.body);

   const game = new Game({
        name: req.body.name,
        date: req.body.date,
        seller : User.find(req.body.seller)
   })

   try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getUser, async (req, res) =>  {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.email != null) {
        res.user.email = req.body.email
    }
    if (req.body.password != null) {
        res.user.password = await hashPassword(req.body.password)
    }
    if (req.body.image != null) {
        res.user.image = req.body.image
    }
    try {
        const updatedUser = await res.user.save();
        res.json(updatedUser);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/', (req, res) =>  {

})

//For storing profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../profilePics"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post("/uploadProfilePic", upload.single("profilePic"), (req, res) => {
    try {
        if (!req.file) {
            throw new Error("File upload failed");
        }
        res.json({ filePath: `/profilePics/${req.file.filename}` });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error.message);
        }
    }
});

//Middleware

async function getUser(req, res, next) {
    try {
        user = await User.findById(req.params.id);
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user'})
        }
        res.user = user;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getUserByName(req, res, next) {
    try {
        user = await User.findOne({ name: req.params.name });
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user'})
        }
        res.user = user;
        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
}

async function hashPassword(password) {
    const saltRounds = 10; // Number of salt rounds (higher is more secure, but slower)
    const salt = await bcrypt.genSalt(saltRounds);
    const hash = await bcrypt.hash(password, salt);
    return hash;
  }
  
  async function comparePassword(password, hash) {
    const match = await bcrypt.compare(password, hash);
    return match;
  }