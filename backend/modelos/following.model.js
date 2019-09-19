const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let FollSell = new Schema({
    _name: {
        type: String
    },
});

FollSell.query.byName = function(name){
    return this.find({ _name: name});
}

module.exports = mongoose.model('FollSell', FollSell);