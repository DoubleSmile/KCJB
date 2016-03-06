var express = require('express');
var router = express.Router();

var get_ip = require('../utils/ip');
var Error = require('../errors');
var User = require('../models/user');

var user_info = function (doc,ip) {
    return {
	succ : 0,
	id   : doc.id,
	display : doc.display,
	grant : doc.grant.state,
	group : doc.group,
	expire : doc.expire,
	manager : doc.manager ? doc.manager.id : 0,
	ip : ip,
	score : doc.score
    };
}


router.get('/', function(req,res,next) {
    if (!req.session) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    if (!req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token)
	.populate('manager','id -_id')
	.exec(function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	res.json(user_info(doc,get_ip(req)));
	return;
    });
});

module.exports = router;
