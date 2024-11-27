const express = require('express')
const router = express.Router()
const multer = require("multer");
const GameImage = require('../models/GameImage')
const path = require("path");
const bcrypt = require('bcrypt');
const { error } = require('console');


module.exports = router

//Routes

router.get('/', async (req, res) => {
    try {
        const GameImages = await GameImage.find();
        res.json(GameImages);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getGameImage, (req, res) => {
    res.send(res.gameimage)
})

router.get('/game/:id', getGameImageByGame, (req, res) => {
    res.send(res.gameImage)
})

router.post('/', async (req, res) => {
    console.log(req.body);

   const gameimage = new GameImage({
        image : req.body.image,
        game : req.body.game
   })

   try {
        const newGameImage = await gameimage.save()
        res.status(201).json(newGameImage)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getGameImage, async (req, res) =>  {
    if (req.body.image != null) {
        res.gameImage.image = req.body.image
    }
    try {
        const updatedGameImage = await res.gameImage.save();
        res.json(updatedGameImage);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getGameImage, async (req, res) =>  {
    try {
        const gameImage = res.gameImage;
        if (gameImage) {
            await GameImage.deleteOne({ _id: gameImage._id });
            return res.status(200).json({ message: "Deletion was successful" })
        }

        throw new Error("Game Image not found");
    } catch (err) {
        return res.status(400).json({ message: err.message })
    }
})

//For storing profile pictures
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../gameImages"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({ storage });

router.post("/uploadGameImages", upload.single("gameImage"), (req, res) => {
    console.log(req.body)
    try {
        if (!req.file) {
            throw new Error("File upload failed");
        }
        res.json({ filePath: `/gameImages/${req.file.filename}` });
    } catch (error) {
        if (!res.headersSent) {
            res.status(500).send(error.message);
        }
    }
});

//Middleware

async function getGameImage(req, res, next) {
    try {
        gameImage = await GameImage.findById(req.params.id);
        if (gameImage == null) {
            return res.status(404).json({ message: 'Cannot find game image'})
        }
        res.gameImage = gameImage;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getGameImageByGame(req, res, next) {
    try {
        gameImage = await GameImage.find({game : req.params.id});
        if (gameImage == null) {
            return res.status(404).json({ message: 'Cannot find game image'})
        }
        res.gameImage = gameImage;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

