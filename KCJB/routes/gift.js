var express = require('express');
var router = express.Router();
var redis = require('../dao/redis_client');
var User = require('../models/user');
var Error = require('../errors');

/* GET users listing. */
router.get('/', function(req, res, next) {
    redis.hgetall('__gift',function(err,reply) {
	var s = [];
	for (key in reply) {
	    s.push({name : key, score : reply[key]});
	}
	res.json(s);
    });
});


router.post('/',function(req,res,next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    if (!req.body.score) {
	res.json(Error.BAD_PARAMETER);
	return;
    }

    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	if (doc.group !== 100) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}
	var s = {};
	s[String(req.body.name)] = req.body.score;
	redis.hmset('__gift',s,function (err,reply) {
	    res.sendStatus(200);
	});
    });
});


module.exports = router;
