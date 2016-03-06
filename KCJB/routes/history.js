var express = require('express');
var router = express.Router();
var User = require('../models/user');

var redis = require('../dao/redis_client');

/* GET users listing. */
router.get('/',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json([]);
	return;
    }
    User.findById(req.session.token,'-_id id group', function(err,doc) {
	if (!doc) {
	    res.json([]);
	    return;
	}
	req.user_id = doc.id;
	req.user_group = doc.group;
	next();
    });
});

router.get('/', function(req, res, next) {
    redis.keys('__msg_*',function(err,keys) {
        if (!keys) { res.json([]); return; }
	redis.mget(keys,function(err,doc) {
            if (!doc) { res.json([]); return; }
	    res.json(doc.map(JSON.parse).
		    sort(function(a,b) {
			if (a.createTime < b.createTime) return -1;
			if (a.createTime > b.createTime) return  1;
			else return 0;
		    }).filter(function(msg) {
			if (req.user_group>=90) return true;
			if (msg.from == req.user_id) return true;
			if (!msg.pass) return false;
			if (!msg.whisper) return true;
			if (msg.to !== req.user_id) return false;
		    })
		    );
	});
    });
});

module.exports = router;
