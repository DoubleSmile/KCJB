var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    ip : String,
    createTime : {type : Date, default : Date.now},
    creator    : {type : Schema.Types.ObjectId, ref : 'User'},
});

module.exports = mongoose.model('ipfilter', schema);
