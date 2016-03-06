var express = require('express');
var router = express.Router();
var words = require('../models/word');
var User = require('../models/user');
var Error = require('../errors');
var redis = require('../dao/redis_client');

/* GET users listing. */

router.post('/add',function(req,res,next) {

    var word = req.body.word;

    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    } 

    User.findById(req.session.token, function(err,doc) {

	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	} 

	if (doc.group !== 100) {
	    res.json(Error.NO_PERMISION);
	    return;
	}

	redis.sadd('__word',word,function(err,reply) {
	    redis.smembers('__word',function(err,r) {
		if (r.length) words.set(RegExp(r.join('|'),'i'));
		else words.set(RegExp('^$'));
		res.json({succ : 0});
	    });
	})
    });
});

router.post('/delete',function(req,res,next) {

    var word = req.body.word;

    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    } 

    User.findById(req.session.token, function(err,doc) {

	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	} 

	if (doc.group !== 100) {
	    res.json(Error.NO_PERMISION);
	    return;
	}

	redis.srem('__word',word,function(err,reply) {
	    redis.smembers('__word',function(err,r) {
		if (r.length) words.set(RegExp(r.join('|'),'i'));
		else words.set(RegExp('^$'));
		res.json({succ : 0});
	    });
	})
    });
});

module.exports = router;
