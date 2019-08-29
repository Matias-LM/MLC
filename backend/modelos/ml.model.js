const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({

    _accesToken: {
        type: String
    }
    
});

module.exports = mongoose.model('Item', Item);