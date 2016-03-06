var Error = require('../errors');
var User = require('../models/user');

module.exports = function (req,res,next) {

    console.log(req.session);
    if ((!req.session) || (!req.session.token)) {
	    console.log('redirect 1');
	res.redirect('/login.html');
	return;
    }
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    console.log('redirect 2');
	    res.redirect('/login.html');
	    return;
	}

	next();
    });
}
