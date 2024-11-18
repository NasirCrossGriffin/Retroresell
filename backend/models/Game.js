//STEP 1 import Mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');

const Schema = mongoose.Schema;

const gameSchema = new Schema(
    {
        name: {type: String, required: true, unique: false},
        description: {type: String, required: true, unique: false},
        price: {type: Number, required: true, unique: false},
        date: {type: Date, required: true},
        seller: { 
            type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId
            ref: 'User', // References the 'User' model
            required: true 
          }
    }
)

module.exports = mongoose.model('Game', gameSchema);

