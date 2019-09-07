const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatTend = new Schema({

    _name: {
        type: String
    },
    _day: {
        type: String
    },
    _cant: {
        type: Number
    }

});

CatTend.query.byName = function(name){
    return this.find({ _name: new RegExp(name, 'i')});
}

CatTend.query.byDay = function(day){
    return this.find({ _day: new RegExp(day, 'i')});
}

module.exports = mongoose.model('CatTend', CatTend);