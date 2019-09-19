const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let CatTime = new Schema({

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

CatTime.query.byName = function(name){
    return this.find({ _name: name});
}

CatTime.query.byDay = function(day){
    return this.find({ _day: day});
}

module.exports = mongoose.model('CatTime', CatTime);