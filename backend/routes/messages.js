const express = require('express')
const router = express.Router()
const multer = require("multer");
const Message = require('../models/Message')
const path = require("path");
const bcrypt = require('bcrypt');


module.exports = router

//Routes

router.get('/all', async (req, res) => {
    try {
        const Messages = await Message.find();
        res.json(Messages);
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

router.get('/:id', getMessage, (req, res) => {
    res.send(res.message)
})

router.get('/sender/:id', getMessageBySender, (req, res) => {
    res.send(res.message)
})

router.get('/recipient/:id', getMessageByRecipient, (req, res) => {
    res.send(res.message)
})

router.post('/', async (req, res) => {
    console.log(req.body);

   const message = new Message({
        message: req.body.message,
        date: req.body.date,
        sender: req.body.sender,
        recipient: req.body.recipient
   })

   try {
        const newMessage = await message.save()
        res.status(201).json(newMessage)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.patch('/:id', getMessage, async (req, res) =>  {
    if (req.body.message != null) {
        res.message.mesage = req.body.message
    }
    try {
        const updatedMessage = await res.message.save();
        res.json(updatedMessage);
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

router.delete('/:id', getMessage, async (req, res) =>  {
    try {
        const message = res.message;
        if (message) {
            await Message.deleteOne({ _id: message._id });
            return res.status(200).json({ message: "Deletion was successful" });
        }
           
        throw new Error("Message not found");
    
    } catch (err) {
        return res.status(400).json({ message: err.message });
    }
})

//Middleware

async function getMessage(req, res, next) {
    try {
        message = await Message.findById(req.params.id);
        if (message == null) {
            return res.status(404).json({ message: 'Cannot find message'})
        }
        res.message = message;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getMessageBySender(req, res, next) {
    try {
        message = await Message.find({ sender : req.params.id });
        if (message == null) {
            return res.status(404).json({ message: 'Cannot find message'})
        }
        res.message = message;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}

async function getMessageByRecipient(req, res, next) {
    try {
        message = await Message.find({ recipient : req.params.id });
        if (message == null) {
            return res.status(404).json({ message: 'Cannot find message'})
        }
        res.message = message;
        next();
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


