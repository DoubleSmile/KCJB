var express = require('express');
var router = express.Router();

var User = require('../models/user');
var Error = require('../errors');

/* GET home page. */

router.post('/', function(req, res, next) {
    if (!req.body.opass) {
	res.json(Error.NO_PASSWORD);
	return;
    }
    if (!req.body.pass) {
	res.json(Error.NO_PASSWORD);
	return;
    }

    if (req.body.pass !== req.body.repass) {
	res.json(Error.PASSWORD_NOT_MATCH);
	return;
    }

    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	if (doc.password !== req.body.opass) {
	    res.json(Error.WRONG_PASSWORD);
	    return;
	}

	doc.password = req.body.pass;

	doc.save(function(err) {
	    if (err) {
		res.json(Error.UNKNOWN);
		return;
	    }
	    res.json({succ : 0, msg : 'ok'});
	});
    });
});

module.exports = router;
