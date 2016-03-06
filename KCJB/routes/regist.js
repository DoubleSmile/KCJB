var express = require('express');
var router = express.Router();
var User = require('../models/user');
var get_ip = require('../utils/ip');
var register = require('../utils/reg');
var manager = require('../models/manager');
var Error = require('../errors');
var ID = require('../models/auto_inc');


var succ = {succ : 0, msg : 'ok'};

var user_reg = function(req, res, next) {

    var username = req.body.username || '';
    var password = req.body.password || '';
    var repeat = req.body.repeat || '';

    if (username ==='') {
	res.json(Error.NO_USERNAME);
	return;
    }

    if (password === '') {
	res.json(Error.NO_PASSWORD);
	return;
    }

    if (password !== repeat) {
	res.json(Error.PASSWORD_NOT_MATCH);
	return;
    }

    var ip = get_ip(req);


    User.findOne({username : username}, function(err,doc) {
	if (doc) {
	    res.json(Error.USER_EXISTS);
	    return;
	}
        ID.findOneAndUpdate({name:'user'},{$inc : {id : 1}}, {new : true},
        function(err,idx) {
             if (!idx) { res.json(Error.UNKNOWN); return; }
	User.findOne({ip : ip}, function(err,doc) {
	    if (doc && doc.group==0) {
               // doc.id = idx.id;
		doc.username = username;
		doc.password = password;
		doc.info = req.body;
		doc.group = 1;
		doc.grant.state = 0;
	    } else {
		doc = new User({
                     id : idx.id,
		    username : username,
		    password : password,
		    info : req.body,
		    ip : ip,
		    group : 1,
		});
	    }

	    manager.get(function(x) {
		if (x) doc.manager = x;
		doc.save(function(err) {
		    if (err) {
			res.json(Error.UNKNOWN);
			return;
		    }
		    req.session.token = doc._id;
		    res.json(succ);
		    return;
		});
	    });
	});
        });
    });
}


router.post('/',user_reg);

module.exports = router;
