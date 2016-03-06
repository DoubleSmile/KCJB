var express = require('express');
var router = express.Router();
var Error = require('../errors');
var Black = require('../models/ipfilter');
var User = require('../models/user');

function date_format(t) {
    var a = new Date(t);
    var str = '';
    str = str + String(a.getFullYear());
    str = str + '-';
    str = str + String(a.getMonth()+1);
    str = str + '-';
    str = str + String(a.getDate());
    str = str + ' ';
    str = str + String(a.getHours());
    str = str + ':';
    str = str + String(a.getMinutes());
    return str;
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
	.exec(function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	if (doc.group < 90) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}

	Black.find({})
	    .populate('creator')
	    .exec(function (err,doc) {
		if (!doc) {
		    res.json({succ : 0,data : []});
		    return;
		}
		res.json({succ : 0,
		    data : doc.map(function(x) {
			return {
			    ip : x.ip,
			    by : x.creator.display,
			    createTime : date_format(x.createTime)
			}
		    })});
	    });
    });
});

router.post('/add',function(req,res,next) {
    var ip = req.body.ip;
    if (!ip || ip==='') {
	res.json(Error.BAD_PARAMETER);
	return;
    }

    if (!req.session) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    if (!req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    User.findById(req.session.token)
	.exec(function(err,doc) {
	    if (!doc) {
		res.json(Error.BAD_TOKEN);
		return;
	    }
	    if (doc.group < 90) {
		res.json(Error.NO_PERMISSION);
		return;
	    }

	    Black.findOne({ip : ip},function(err,doc) {
		if (doc) {
		    res.json(Error.BAD_PARAMETER);
		    return;
		} else {
		    var x = new Black({
			ip : ip,
			creator : req.session.token,
			createTime : new Date()
		    });
		    x.save(function(err) {
			if (err) {
			    res.json(Error.UNKNOWN);
			    return;
			}
			res.json({succ : 0});
			return;
		    });
		}
	    });
	});

});


router.post('/remove',function(req,res,next) {
    var ip = req.body.ip;
    if (!ip || ip==='') {
	res.json(Error.BAD_PARAMETER);
	return;
    }

    if (!req.session) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    if (!req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    User.findById(req.session.token)
	.exec(function(err,doc) {
	    if (!doc) {
		res.json(Error.BAD_TOKEN);
		return;
	    }
	    if (doc.group < 90) {
		res.json(Error.NO_PERMISSION);
		return;
	    }

	    Black.findOne({ip : ip},function(err,doc) {
		if (!doc) {
		    res.json(Error.BAD_PARAMETER);
		    return;
		} 

		Black.findByIdAndRemove(doc._id,
			function(err,doc) {
			    if (err) {
				res.json(Error.UNKNOWN);
				return;
			    }
			    res.json({succ : 0});
			    return;
			});

	    });
	});
});


module.exports = router;
