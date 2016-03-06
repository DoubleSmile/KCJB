var express = require('express');
var router = express.Router();
var Error = require('../errors');
var User = require('../models/user');
var chat = require('../chat_server');
var token_check = require('../middlewares/token_check');


/*
var buttons(doc) {
    return "<button class='btn btn-info btn-sm' data-toggle='modal' data-target='#myModal' onclick='getInfo("+doc.id+")'>编辑</button><button class='btn btn-danger btn-sm'>删除</button>";
}
*/

var user_profile = function(doc) {
    return {
	succ : 0,
	id : doc.id,
	username : doc.username || doc.display,
	nickname : doc.info.nickname || '',
	name : doc.info.name || '',
	qq : doc.info.qq || '',
	mobile : doc.info.mobile || '',
	mail : doc.info.mail || '',
	business : doc.info.business || '',
	group : doc.group,
	grant : doc.grant.state,
	score : doc.score
    };
}

router.get('/',function(req,res,next) {
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	res.json(user_profile(doc));
    });
});

//router.get('/:id',token_check);
router.get('/:id',function(req,res,next) {
    var id = Number(req.params.id);
    User.findOne({id : id}, function(err,doc) {
	if (!doc) {
	    res.json(Error.USER_NOT_EXIST);
	    return;
	}

	if (String(doc._id)===req.session.token) {
	    res.json(user_profile(doc));
	    return;
	}

	User.findById(req.session.token, function(err,from) {
	    if (!from) {
		res.json(Error.BAD_TOKEN);
		return;
	    }
	    if (from.group < 90) {
		res.json(Error.NO_PERMISSION);
		return;
	    }

	    res.json(user_profile(doc));
	    return;
	});
    });
});

//router.post('/:id',token_check);
//router.post('/:id',function(req,res,next) {
router.post('/',token_check);
router.post('/',function(req,res,next) {
    var id = Number(req.body.id);
    User.findOne({_id : req.session.token},function (err,from) {
	if (!from) {
	    res.json(Error.BAD_TOKEN);
	    return;
	} 

	if (!id) {
	    from.info = req.body;
	    from.save(function(err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return;
		}
		res.json(user_profile(from)); 
	    });
	    return;
	}


	if (from.group < 90) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}

	User.findOne({id : id}, function (err,to) {
	    if (!to) {
		res.json(Error.USER_NOT_EXIST);
		return;
	    }
	    if (String(from._id) != String(to._id) && to.group >= 90 && from.group !==100) {
		res.json(Error.NO_PERMISSION);
		return;
	    }
	    to.info = req.body;
	    if (req.body.grant) {
		to.grant.state = req.body.grant;
		to.grant.by = req.session.token;
		to.grant.createTime = Date.now();
		var idx = chat.all_id.indexOf(id);
		if (idx!==-1) chat.all_user[idx].grant = req.body.grant;
	    }
	    if (req.body.group) {
		to.group = req.body.group;
	    }
	    if (req.body.score && from.group == 100) {
		to.score = req.body.score;
	    }
	    to.save(function(err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return;
		}
		res.json(user_profile(to));
	    });
	});
    });
});

module.exports = router;
