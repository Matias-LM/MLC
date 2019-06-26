const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    name: {
        type: String
    },
    seller: {
        type: String
    },
    data: {
        type: {}
    },
});

module.exports = mongoose.model('Item', Item);