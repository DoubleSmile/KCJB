var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    id : Number,
    from : {type : Schema.Types.ObjectId, ref : 'User'},
    product : {type : Schema.Types.ObjectId, ref : 'Product'},
    lobby : Boolean,
    type : String,
    openPrice : Number,
    finnishPrice : Number,
    checkUpPrice : {type : Number, default : 0},
    checkLowPrice : {type : Number, default : 0},
    operation : String,
    reason : String,
    finnishTime : {type : Date,default :Date.now},
    createTime : {type : Date,default :Date.now}
});

schema.virtual('benefit').get(function() {
    if (this.operation !== 'finnish' && this.operation !== 'reduce') 
	return 0;
    if (/more/.test(this.type)) {
	return ((this.finnishPrice - this.openPrice - this.product.cost)*this.product.factor).toFixed(2);
    } else {
	return ((this.openPrice - this.finnishPrice - this.product.cost)*this.product.factor).toFixed(2);
    }
});

module.exports = mongoose.model('bill', schema);

