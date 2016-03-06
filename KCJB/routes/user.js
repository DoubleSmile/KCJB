var express = require('express');
var router = express.Router();
var User = require('../models/user');
var Error = require('../errors');

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

function info(x) {
    return {
	id : x.id,
	username : x.username ? x.username : x.display,
	nickname : x.info.nickname,
	name : x.info.name ? x.info.name : '',
	group : x.group,
	ip : x.ip,
	manager : x.manager ? x.manager.display : '',
	grant : x.grant.state,
	createTime : date_format(x.createTime),
	button :  "<button class='btn btn-info btn-sm ng-scope' onclick='getInfo1("+x.id+")' data-toggle=\"modal\" data-target=\"#myModal\">编辑</button>"
    };
}

function info_2(x) {
    return {
	id : x.id,
	username : x.username ? x.username : x.display,
	nickname : x.info.nickname,
	name : x.info.name ? x.info.name : '',
	grant : x.grant.state,
	by : x.grant.by.display,
	createTime : date_format(x.grant.createTime),
	button :  "<button class='btn btn-info btn-sm ng-scope' onclick='getInfo1("+x.id+")' data-toggle=\"modal\" data-target=\"#myModal\">编辑</button>"
    };
}

/* GET users listing. */
router.get('/', function(req, res, next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN); 
	return;
    }
    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN); 
	    return;
	}
	if (user.group < 90) {
	    res.json(Error.NO_PERMISSION); 
	    return;
	}
	var t = 90;
	if (user.group == 100) t = 100;

	User.find({group : {$lt : t}})
	    .populate('manager')
	    .exec(function(err,doc) {
		if (!doc) {
		    res.json(Error.UNKNOWN); 
		    return;
		}
		var s = [];
		doc.forEach(function(x) {
		    s.push(info(x));
		});
		res.json({data:s});
	    });
    });
});

router.get('/abnormal', function(req,res,next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN); 
	return;
    }
    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN); 
	    return;
	}
	if (user.group < 90) {
	    res.json(Error.NO_PERMISSION); 
	    return;
	}
	User.find({"grant.state" : {$ne : 0}}) 
	    .populate('manager')
	    .populate('grant.by')
	    .exec(function(err,doc) {
		if (!doc) {
		    res.json(Error.UNKNOWN); 
		    return;
		}
		var s = [];
		doc.forEach(function(x) {
		    s.push(info_2(x));
		});
		res.json({data:s});
	    });

    });
});

module.exports = router;
