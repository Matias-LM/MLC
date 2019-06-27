const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let OfSel = new Schema({
    _sellerName: {
        type: String
    },
    _sellerId: {
        type: String
    },
});

OfSel.query.byName = function(name){
    return this.find({ _sellerName: new RegExp(name, 'i')});
}

module.exports = mongoose.model('OfSel', OfSel);