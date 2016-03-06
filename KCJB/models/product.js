var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    name : String,
    category : String,
    out_price : Number,
    in_price : Number,
    cost : Number,
    factor : {type :Number, default : 1}
});

schema.virtual('change_rate').get(function() {
    if (this.out_price === 0) return 0;
    return this.in_price / this.out_price;
});

module.exports = mongoose.model('Product', schema);

