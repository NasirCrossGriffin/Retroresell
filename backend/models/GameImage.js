//STEP 1 import Mongoose
const mongoose = require('mongoose');

const uniqueValidator = require('mongoose-unique-validator');


const Schema = mongoose.Schema;

const gameImageSchema = new Schema(
    {
        image: {type: String, required: true, unique: true},
        game: { 
            type: mongoose.Schema.Types.ObjectId, // Refers to an ObjectId
            ref: 'Game', // References the 'User' model
            required: true 
          }
    }
)
 
module.exports = mongoose.model('GameImage', gameImageSchema);

