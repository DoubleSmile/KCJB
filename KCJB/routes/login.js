var express = require('express');
var router = express.Router();
var User = require('../models/user');
var get_ip = require('../utils/ip');
var register = require('../utils/reg');
var Error = require('../errors');


var succ = {succ : 0, msg : 'ok'};

var guest_login = function(req,res,next) {

    var ip = get_ip(req);
    var username = req.body.username || '';

    if (!(username === '')) {
	next();
	return;
    }

    User.findOne({ip : ip}, function(err,doc) {
	if (doc) { //ip in users
	    if (doc.group != 0) { //is guest
		res.json(Error.GUEST_IP_REGISTED);
		return;
	    }
	    if (doc.expire < 0) {
		res.json(Error.GUEST_EXPIRED);
		return;
	    } else {
		if (doc.grant.state === -1) {
		    res.json(Error.BAN);
		    return;
		}
		req.session.token = doc._id;
		res.json(succ);
		return;
	    }
	} else 
	{ //new guest
	    register({ip : ip, group : 0}, function(err,doc) {
		if (doc) {
		    req.session.token = doc._id;
		    res.json(succ);
		    return;
		} 
		res.json(Error.UNKNOWN);
		return;
	    });
	}
    });
}

var user_login = function(req, res, next) {
    var username = req.body.username;
    var password = req.body.password || '';
    if (password === '') {
	res.json(Error.NO_PASSWORD);
	return;
    }
    User.findOne({username : username}, function(err,doc) {
	if (!doc) {
	    res.json(Error.USER_NOT_EXIST);
	    return;
	}
	if (!(doc.password === password)) {
	    res.json(Error.WRONG_PASSWORD);
	    return;
	}
	if (doc.grant.state === -1) {
	    res.json(Error.USER_BAN);
	    return;
	}
	req.session.token = doc._id;
	res.json(succ);
    });
}


router.get('/', function(req,res,next) {
    if (!req.session) {
	res.json(Error.NO_LOGIN);
	return;
    }
    if (!req.session.token) {
	res.json(Error.NO_LOGIN);
	return;
    }
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	res.json(succ);
    });
});

router.post('/',guest_login);
router.post('/',user_login);

module.exports = router;
