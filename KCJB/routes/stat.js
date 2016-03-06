var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var User = require('../models/user');
var Gift = require('../models/gift');
var Error = require('../errors');

function is_sus(sus,id) {
    for (i in sus) {
	if (sus[i].pair.to == id &&
	       	(!sus[i].expire)) 
	    return true;
    }
    return false;
}

router.get('/',function(req,res,next) {
    if (!req.session && !req.session.token) {
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

	Bill.find({type : {$ne : 'speaker'}})
	    .populate('from')
	    .populate('product')
	    .exec(function(err,doc) {
		var s = {};
		var key;
		doc.forEach(function(x) {
		    key = 'U'+x.from.id;
		    if (!s[key]) {
			s[key] = {
			    display : x.from.display,
			    count : 0,
			    finnish_count : 0,
			    succ_count : 0,
			    benefit : 0,
			};
		    }
		    s[key].count ++;
		    s[key].benefit += Number(x.benefit);
		    if (x.benefit && x.benefit >= 0) 
			s[key].succ_count++;
		    if (x.operation==='finnish'
			    || x.operation==='reduce') 
			s[key].finnish_count++;

		});
		var l = [];
		for (x in s) l.push({
		    display : s[x].display,
		    count : s[x].count,
		    succ_count : s[x].succ_count,
		    unfinnish_count : s[x].count-s[x].finnish_count,
		    succ_rate : Number(s[x].succ_count / s[x].finnish_count * 100).toFixed(2)+'%',
		    benefit : (s[x].benefit).toFixed(2),
		});
		res.json({data: l});
	    });
    });
});


/*my all bill*/
router.get('/:x',function(req,res,next) {

    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    var query = {
	$or : [
	{type : 'cashmore'},
	{type : 'cashless'},
	{type : 'dealmore'},
	{type : 'dealless'},
	]
    };

    var t = new Date();
    if (req.params.x === 'd') {
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	query.finnishTime = {
	    $gt : t.getTime()
	};
    } else if (req.params.x === 'w') {
	var d = t.getDay();
	if (d==0) d = 7;
	t.setTime(t.getTime() - (d-1)*24*60*60*1000);
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	query.finnishTime = {
	    $gt : t.getTime()
	};
    } else if (req.params.x === 'l') {
	var d = t.getDay();
	if (d==0) d = 7;
	t.setTime(t.getTime() - (d-1)*24*60*60*1000);
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	query.finnishTime = {
	    $gt : t.getTime() - 7*24*60*60*1000,
	    $lt : t.getTime() - 1,
	}
    } else if (req.params.x === 'm') {
	t.setDate(1);
	t.setHours(0);
	t.setMinutes(0);
	t.setSeconds(0);
	t.setMilliseconds(0);
	query.finnishTime = {
	    $gt : t.getTime(),
	}
    } else if (req.params.x !== 'a') {
	res.json(Error.UNKNOWN);
    }
    
    Gift.find({
	from : req.session.token,
	name : 'suscribe'
    },function (err,sus) {

	Bill.find(query)
	    .populate('from')
	    .populate('product')
	    .exec(function(err,doc) {
		var s = {};
		var key;
		doc.forEach(function(x) {
		    key = 'U'+x.from.id;
		    if (!s[key]) {
			var flag = (x.from._id == req.session.token);
			if (!flag) flag = is_sus(sus,x.from.id);
			s[key] = {
			    id : x.from.id,
			    display : x.from.display,
			    count : 0,
			    succ_count : 0,
			    benefit : 0,
			    suscribed : flag ? '查看明细' : '订阅喊单',
			    choice : (!flag) ? '#modallist' : '#modaltable'
			};
		    }
		    s[key].count ++;
		    s[key].benefit += Number(x.benefit);
		    if (x.benefit >= 0) 
			s[key].succ_count++;
		});
		var l = [];
		for (x in s) {
s[x].benefit = (s[x].benefit).toFixed(2);
l.push(s[x]);
}
		res.json({data:l});
	    });
    });

});


module.exports = router;
