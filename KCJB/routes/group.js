var express = require('express');
var router = express.Router();
var User = require('../models/user');
var manager = require('../models/manager');
var Error = require('../errors');

/* GET users listing. */
var is_manager = function(a) {
    return (a>=90 && a<95);
}

router.post('/:id', function(req, res, next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    var group = Number(req.body.group);
    if (!group) {
	res.json(Error.PARAMETER_ERROR);
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
	User.findOne({id : req.params.id},function(err,to) {
	    if (!to) {
		res.json(Error.USER_NOT_EXIST);
		return;
	    }

	    if (to.group >=90 && from.group !== 100) {
		res.json(Error.NO_PERMISSION);
		return;
	    }
	    var ogroup = to.group;
	    to.group = group;
	    to.save(function (err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return;
		}
		if (is_manager(ogroup) && !is_manager(group))
		    manager.remove(to._id);
		if (!is_manager(ogroup) && is_manager(group))
		    manager.add(to._id);
		res.json ({succ:0,msg:'ok'});
	    });
	});
    });
});

module.exports = router;
