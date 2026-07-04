//STEP 1 import Mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const messageSchema = new Schema(
    {
        message: {type: String, required: true, unique: false},
        date: {type: Date, required: true},
        sender: { 
            type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId
            ref: 'User', // References the 'User' model
            required: true 
          },
          recipient: { 
            type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId
            ref: 'User', // References the 'User' model
            required: true 
          }
    }
)

module.exports = mongoose.model('Message', messageSchema);

