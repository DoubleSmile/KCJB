var AutoInc = require('../models/auto_inc');
var User = require('../models/user');

var reg = function(user,callback) {
    AutoInc.findOneAndUpdate({name : 'user'},
	    {$inc : {id : 1}},
	    {new :true},
	    function (err,doc) {
		if (!doc) {
		    callback(err,null);
		    return;
		}
		var newUser = new User(user);
		newUser.id = doc.id;
		newUser.save(function (err) {
		    if (err) callback(err,null);
		    else callback(null,newUser);
		});
	    });
}

module.exports = reg;
