var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
    from : {type :Schema.Types.ObjectId, ref : 'User'},
    to : {type :Schema.Types.ObjectId, ref : 'User'},
    pair : {from : Number, to : Number},
    name : String,
    count : {type : Number, default : 1},
    score : {type : Number, default : 0},
    createTime : {type : Date, default : Date.now},
    duration : {type : Number,default : 0}
});

schema.virtual('expire').get(function() {
    if (this.duration===0) return false;
    return this.createTime.getTime() + this.duration < Date.now();
});

schema.virtual('total_score').get(function(){
    return this.count * this.score;
});

module.exports = mongoose.model('gift', schema);
