var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Gift = require('../models/gift');
var index = require('../dao/redis_client');
var Error = require('../errors');

/* GET users listing. */

router.post('/:id', function(req, res, next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    var redis_key = req.body.type;
    if (!redis_key) redis_key = 'gift';

    User.findById(req.session.token, function(err,from) {
	if (!from) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}

	User.findOne({id : req.params.id},function(err,to) {
	    if (!to) {
		res.json(Error.USER_NOT_EXIST);
		return;
	    }

	    index.hget('__'+redis_key,req.body.name,function(err,reply) {

		if (Number(reply)<=0) {
		    res.json(Error.BAD_PARAMETER);
		    return;
		}

		if (from.group<100 && from.score < Number(reply)) {
		    res.json(Error.SCORE_NOT_ENOUGH);
		    return;
		}

		var gift = new Gift({
		    from : from._id,
		    to : to._id,
		    pair : {
			from : from.id,
			to : to.id
		    },
		    count : 1,
		    name : req.body.name,
		    score : reply,
		});

		if (req.body.type === 'suscribe') {
		    gift.name = 'suscribe';
		    gift.duration = Number(req.body.name)*24*60*60*1000;
		} else if (req.body.count) {
		    gift.count = req.body.count;
		}

		gift.save(function(err) {
		    to.score += gift.total_score;
		    to.save(function(err) {
			if (from.group<100) {
			    from.score -= gift.total_score;
			    from.save(function(err) {
				res.json({succ:0});
			    });
			} else {
			    res.json({succ:0});
			}

		    });
		});
	    });
	});
    });
});

module.exports = router;
