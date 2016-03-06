var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var config = require('../config');

var schema = new Schema({
    username   : String,
    id         : Number,
    password   : String,
    ip         : String,
    createTime : {type :Date, default : Date.now},
    info       : {
	nickname : {type : String, default : ''},
	name     : String,
	qq       : String,
	mobile   : String,
	mail     : String,
	business : String,
    },
    security     : {
	question : String,
	answer   : String,
    },
    group        : {type : Number, default : 0},
    /*grant  0 normal
     *grant -1 mute
     *grant -2 inactive
     * */
    grant        : {
	state      : {type : Number, default : 0},
	by         : {type : Schema.Types.ObjectId, ref : 'User'},
	createTime : {type : Date, default : Date.now},
    },
    manager         : {type : Schema.Types.ObjectId, ref : 'User'},
    score           : {type : Number, default :0},
});

schema.pre('save',function(next) {
    if (this.username) {
       this.username = 
       this.username.
          replace(/&/g,'&amp;').
          replace(/"/g,'&quot;').
          replace(/'/g,'&#39;').
          replace(/</g,'&lt;').
          replace(/>/g,'&gt;');
    }
    if (this.info.nickname) {
       this.info.nickname = 
       this.info.nickname.
          replace(/&/g,'&amp;').
          replace(/"/g,'&quot;').
          replace(/'/g,'&#39;').
          replace(/</g,'&lt;').
          replace(/>/g,'&gt;');
    }
    next();
});

schema.virtual('expire').get(function() {
    if (this.group!=0) return 0;
    if (config.guest_expire === 0) return 0;
    return (this.createTime.getTime() + config.guest_expire - Date.now());
});

schema.virtual('display').get(function() {
    var display = this.info.nickname || '';
    if (display === '') display = this.username || '';
    if (display === '') display = 'guest_'+ this.id;
    return display;
});

var User = mongoose.model('User',schema);

User.findOne({},function(err,doc) {
    if (doc) {
	return;
    }
    var root = new User({
	username : 'root',
	id       : 0,
	password : config.root_password,
	group    : 100,
	ip       : '',
    }).save(function(err) {
    });
});

module.exports = User;
