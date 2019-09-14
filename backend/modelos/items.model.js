const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Item = new Schema({
    _itemId: {
        type: String
    },
    _name: {
        type: String
    },
    _seller: {
        type: String
    },
    _following: { 
        type: Boolean 
    },
    _lastUpdate: {
        type: String
    },
    _data: {
        type: {}
    },
});

Item.query.byItemId = function(id){
    return this.find({ _itemId: new RegExp(id)});
}

Item.query.byName = function(name){
    return this.find({ _name: new RegExp(name, 'i')});
}

Item.query.bySeller = function(seller){
    return this.find({ _seller: new RegExp(seller, 'g')});
}

Item.query.byFoll = function(){
    return this.find({ _following: true});
}

module.exports = mongoose.model('Item', Item);