const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    _name: {
        type: String
    },
});

Item.query.byName = function(name){
    return this.find({ _name: new RegExp(name, 'i')});
}

module.exports = mongoose.model('Item', Item);