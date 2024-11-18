const express = require('express')
const router = express.Router()
const multer = require("multer");
const Game = require('../models/Game')
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

router.get('/user/:id', getGameByUser, (req, res) => {
    res.send(res.game)
})

router.post('/', async (req, res) => {
    console.log(req.body);

   const game = new Game({
        name: req.body.name,
        description: req.body.description,
        price: req.body.price,
        date: req.body.date,
        seller : req.body.seller
   })

   try {
        const newGame = await game.save()
        res.status(201).json(newGame)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getGame, async (req, res) =>  {
    if (req.body.name != null) {
        res.user.name = req.body.name
    }
    if (req.body.description != null) {
        res.user.description = req.body.description
    }
    if (req.body.price != null) {
        res.user.price = req.body.price
    }
    if (req.body.date != null) {
        res.user.date = req.body.date
    }
    if (req.body.seller != null) {
        res.user.seller = req.body.seller
    }
    try {
        const updatedGame = await res.game.save();
        res.json(updatedGame);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/', (req, res) =>  {

})

//Middleware

async function getGame(req, res, next) {
    try {
        game = await Game.findById(req.params.id);
        if (game == null) {
            return res.status(404).json({ message: 'Cannot find game'})
        }
        res.game = game;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getGameByUser(req, res, next) {
    try {
        game = await Game.find({ seller : req.params.id });
        if (game == null) {
            return res.status(404).json({ message: 'Cannot find game'})
        }
        res.game = game;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getGameByName(req, res, next) {
    try {
        game = await Game.findOne({ name: req.params.name });
        if (user == null) {
            return res.status(404).json({ message: 'Cannot find user'})
        }
        res.game = game;
        next()
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
    
}
