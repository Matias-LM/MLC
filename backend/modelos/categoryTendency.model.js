const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatTend = new Schema({

    _name: {
        type: String
    },
    _day: {
        type: []
    },
    _cant: {
        type: Number
    }

});

CatTend.query.byName = function(name){
    return this.find({ _name: name});
}

CatTend.query.byDay = function(day){
    return this.find({ _day: day});
}

module.exports = mongoose.model('CatTend', CatTend);