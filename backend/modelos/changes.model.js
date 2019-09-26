const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let Changes = new Schema({
    _itemId: {
        type: String
    },
    _field: {
        type: String
    },
    _prevValue:{
        type: String
    },
    _nextValue: {
        type: String
    },
});

Changes.query.byItemId = function(id){
    return this.find({ _itemId: id});
}

module.exports = mongoose.model('Changes', Changes);