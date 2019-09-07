const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatSell = new Schema({

    _name: {
        type: String
    },
    _cant: {
        type: Number
    },
    
});

CatSell.query.byName = function(name){
    return this.find({ _name: new RegExp(name, 'i')});
}

module.exports = mongoose.model('CatSell', CatSell);