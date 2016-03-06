var express = require('express');
var router = express.Router();
var Bill = require('../models/bill');
var Gift = require('../models/gift');
var AUTOINC = require('../models/auto_inc');
var User = require('../models/user');
var Error = require('../errors');
var Product = require('../models/product');
var all_socket = require('../chat_server').all_socket;

var broadcast = require('../utils/broadcast');

function type(ctype) {
    if (ctype=='speaker') return '行情提醒';
    var s1 = '卖空';
    if (/more/.test(ctype)) s1 = '买多';
    var s2 = '现价';
    if (/hang/.test(ctype)) s2 = '挂单';
    return s2+s1;
}

function state(doc) {
    if (/hang/.test(doc.type) && doc.operation==='open') return '挂单';
    if (doc.operation==='open') 
	return '开仓';
    if (doc.operation==='add') 
	return '增仓';
    if (doc.operation==='reduce')
	return '减仓';
    if (doc.operation==='cancel')
	return '撤单';
    if (doc.operation==='finnish')
	return '平仓';
    if (doc.operation==='deal')
	return '挂单成交';
}

function button1(doc) {
    if (/hang/.test(doc.type)) {
	return "";
    }
    return "<button class='btn btn-danger btn-sm' onclick='opera_finnish()'>平仓</button>";
}

function button2(doc) {
    if (/hang/.test(doc.type)) {
	return "<button class='btn deal btn-info btn-sm' onclick='opera_deal()'>成交</button><button id='"+doc.id+"' class='btn btn-warning btn-sm' onclick='opera_cancel()'>撤单</button>";
    }
    if (doc.operation==='open'
	    ||doc.operation==='add' || doc.operation==='deal') {
	return "<button class='btn btn-info add btn-sm' onclick='opera_add()'>增仓</button><button class='btn btn-info sub btn-sm' onclick='opera_reduce()'>减仓</button>";
    }
    return "";
}
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

function bill_to_msg (doc) {
    var ft = '';

    if (doc.type === 'speaker') {
	return {
	    id : doc.id,
	    from : doc.from.display,
	    lobby : doc.lobby,
	    type : 'speaker',
	    reason : doc.reason,
	    createTime : date_format(doc.createTime)
	}
    }

    if (doc.operation === 'finnish' ||
	    doc.operation === 'reduce' ||
	    doc.operation === 'cancel') ft = date_format(doc.finnishTime);

	s = {
	    id : doc.id,
	    from : doc.from.display,
	    from_id : doc.from.id,
	    product : doc.product.name,
	    lobby : doc.lobby,
	    type : doc.type ? type(doc.type) : 'test',
	    openPrice : doc.openPrice,
	    finnishPrice : doc.finnishPrice || '',
	    checkUpPrice : Number(doc.checkUpPrice) || 0,
	    checkLowPrice : Number(doc.checkLowPrice) || 0,
	    operation : doc.operation,
	    createTime : date_format(doc.createTime),
	    finnishTime : ft,
	    benefit : doc.benefit || 0,
	    state : state(doc),
	    reason : doc.reason || '',
	    button1 : button1(doc),
	    button2 : button2(doc),
	};
	return s;
}


function get_bill(query,res) {
    Bill.find(query)
	.populate('from')
	.populate('product')
	.select('-_id finnishTime id from product lobby type openPrice finnishPrice checkUpPrice checkLowPrice operation createTime')
	.exec(function(err,doc) {
	    if (!doc) res.json([]);
	    else {
		var s = [];
		doc.forEach(function(x) {
		    s.push(bill_to_msg(x));
		});
		res.json({succ : 0, data : s});
	    }
	});
}

router.get('/history',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token,function(err,user) {
	var sus = [];
        if (!user) {
            res.json([]);
            return;
        }
	if (user.group >= 90) {
	    Bill.find()
		.sort({finnishTime : -1})
		.limit(10)
		.populate('from')
		.populate('product')
		.exec(function(err,bill) {
		    res.json(bill.map(bill_to_msg).reverse());
		});
	    return;
	} 

	Gift.find({'pair.from' : user.id, name : 'suscribe'},
		'-_id to')
	    .exec(function(err,s) {
		if (!s) {
		    s = [];
		    res.json([]);
		    return;
		} else s = s.map(function(x) {return s.to});

		Bill.find({$or : [{to : {$in : s}},{lobby : true}]})
		    .sort({finnishTime : -1})
		    .limit(10)
		    .populate('from')
		    .populate('product')
		    .exec(function(err,bill) {
			res.json(bill.map(bill_to_msg).reverse());
		    });
	    });
    });
});

/*my all bill*/
router.get('/:id',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token,function(err,from) {
	if (!from) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	User.findOne({id : req.params.id},function(err,to) {
	    if (!to) {
		res.json(Error.UNKNOWN);
		return;
	    }

	   Gift.find({
		'pair.from' :  from.id,
		'pair.to' : to.id,
		name : 'suscribe'
	    }, function(err,suscribe) {

	    	//console.log("su:"+suscribe);
	    	var validItem=null;
		    if(suscribe){
		    		suscribe.forEach(function(item){
		    		if(!item.expire)
		    			validItem=item;
		    	});
	    	}
	    	
	    	//console.log("va:"+validItem);
			if (String(from._id) !== String(to._id) && from.group < 100) {

				if ( !validItem || validItem.expire)
				{
					res.json(Error.NO_PERMISSION);
					return;
			    }
			}

			get_bill({from : to._id, type : {$ne : 'speaker'}},res);

	    });
	 //    Gift.findOne({
		// 'pair.from' :  from.id,
		// 'pair.to' : to.id,
		// name : 'suscribe'
	 //    }, function(err,suscribe) {


		// if (String(from._id) !== String(to._id) && from.group < 100) {
		//     if (!suscribe || suscribe.expire) {
		// 	res.json(Error.NO_PERMISSION);
		// 	return;
		//     }
		// }

		// get_bill({from : to._id, type : {$ne : 'speaker'}},res);


	    // });
	});
    });
});


/*my bill can be handled*/
router.get('/', function(req, res, next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }
    User.findById(req.session.token,function(err,doc) {
	if (!doc) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}
	get_bill({
	    $or : [
	    {operation : 'add',
		from : req.session.token,
		type : {$ne : 'speaker'},
	    },
	    {operation : 'open',
		from : req.session.token,
		type : {$ne : 'speaker'}
	    },
	    {operation : 'deal',
		from : req.session.token,
		type : {$ne : 'speaker'}
	    }
	    ]
	},res);
    });
});

router.post('/',function(req,res,next) {
    if (!req.session && !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    if (!req.body.category) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    if (!req.body.product) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    if (!Number(req.body.openPrice)) {
	res.json(Error.BAD_PARAMENTER);
	return;
    }

    if (!Number(req.body.checkUpPrice)) {
	req.body.checkUpPrice = 0;
    }

    if (!Number(req.body.checkLowPrice)) {
	req.body.checkLowPrice = 0;
    }

    User.findById(req.session.token,function(err,user) {
	if (!user) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}

	if (user.group < 95) {
	    res.json(Error.NO_PERMISSION);
	    return;
	}

	Product.findOne({
	    category : req.body.category, 
	    name     : req.body.product
	}, function(err,product) {
	    if (!product) {
		res.json(Error.BAD_PARAMETERS);
		return;
	    }
	    AUTOINC.findOneAndUpdate({name:'bill'},
		    {$inc : {id:1}},
		    {new : true},
		    function(err,idx) {
			if (!idx) {
			    res.json(Error.UNKNOWN);
			    return;
			}
			var newBill = new Bill(req.body);
			newBill.id = idx.id;
			newBill.from = user._id;
			newBill.product = product._id;
			newBill.save(function(err){
			    if (err) {
				res.json(Error.UNKNOWN);
				return;
			    }
			    var msg = bill_to_msg(newBill);
			    msg.product = product.name,
			    msg.from = user.display;
			    msg.from_id = user.id;
			    msg.succ = 0;
			    res.json(msg);
			    all_socket.forEach(function(s) {
				broadcast('bill',s,msg);
			    });


			});
		    });
	});

    });
});

router.delete('/:id',function(req,res,next) {
    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return; 
    }
    User.findById(req.session.token,function(err,user) {
	if (!user) {
            res.json (Error.BAD_TOKEN);
            return;
        }
        if (user.group !== 100) {
            res.json (Error.BAD_TOKEN);
            return;
        }
        Bill.findOneAndRemove({id : req.params.id},function(err,reply) {
              if (!err) res.json({succ : 0 ,msg : 'ok'});
              else res.json('wrong');
        });
    })
});

/*
 * POST /api/bill/0 -- id
 * {
 *    operation : 'reduce' 'finnish' 'add' 'deal' 'cancel'
 *    openPrice
 *    checkUpPrice
 *    checkLowPrice
 * }
 */
router.post('/:id',function(req,res,next) {

    if (!req.session || !req.session.token) {
	res.json(Error.BAD_TOKEN);
	return;
    }

    if (!Number(req.body.checkUpPrice)) {
	req.body.checkUpPrice = 0;
    }

    if (!Number(req.body.checkLowPrice)) {
	req.body.checkLowPrice = 0;
    }

    Bill.findOne({id : req.params.id})
	.populate('from')
	.populate('product')
	.exec(function(err,bill) {

	if (!bill) {
	    res.json(Error.BAD_PARAMETER);
	    return;
	}
	if (bill.from._id != req.session.token) {
	    res.json(Error.BAD_TOKEN);
	    return;
	}

	if (req.body.operation === 'finnish' ||
		req.body.operation === 'reduce' ||
		req.body.operation === 'cancel') {

	    if (req.body.operation !== 'cancel') {
		if (req.body.checkUpPrice) {
		    bill.checkUpPrice = req.body.checkUpPrice;
		    bill.checkLowPrice = 0;
		    bill.finnishPrice = bill.checkUpPrice;
		}
		else if (req.body.checkLowPrice) {
		    bill.checkUpPrice = 0;
		    bill.checkLowPrice = req.body.checkLowPrice;
		    bill.finnishPrice = bill.checkLowPrice;
		} else {
		    res.json(Error.BAD_PARAMETER);
		    return;
		}
	    } else {
		bill.reason = req.body.reason;
	    }
	    bill.finnishTime = Date.now();
	    bill.operation = req.body.operation;
	    bill.save(function(err) {
		if (err) {
		    res.json(Error.UNKNOWN);
		    return;
		}
		res.json({succ : 0, remove : bill.id});
		var msg = bill_to_msg(bill);
		msg.product = bill.product.name,
		msg.from = bill.from.display;
		msg.from_id = bill.from.id;
		msg.succ = 0;

		all_socket.forEach(function(s) {
		    broadcast('bill',s,msg);
		});

	    });
	    return;
	}
	if (req.body.operation === 'deal') {
	    bill.openPrice = req.body.openPrice;
	    bill.checkUpPrice = req.body.checkUpPrice;
	    bill.checkLowPrice = req.body.checkLowPrice;
	    bill.operation = 'deal';
	    if (/less/.test(bill.type)) bill.type = 'dealless';
	    else bill.type = 'dealmore';
	    bill.save(function(err) {
		var msg = bill_to_msg(bill);
		msg.product = bill.product.name,
		msg.from = bill.from.display;
		msg.from_id = bill.from.id;
		msg.succ = 0;
		res.json(msg);
		all_socket.forEach(function(s) {
		    broadcast('bill',s,msg);
		});
	    });
	    return;
	}
	if (req.body.operation === 'add') {
	    if (!req.body.openPrice) {
		res.json(Error.BAD_PARAMETER);
		return;
	    }
	    AUTOINC.findOneAndUpdate({name:'bill'},
		    {$inc : {id:1}},
		    {new : true},
		    function(err,idx) {
			if (!idx) {
			    res.json(Error.UNKNOWN);
			    return;
			}
			var newBill = new Bill();
			newBill.from = bill.from._id;
			newBill.product = bill.product._id;
			newBill.lobby = bill.lobby;
			newBill.type = /more/.test(bill.type) ? 'cashmore' : 'cashless';
			newBill.id = idx.id;
			newBill.openPrice = req.body.openPrice;
			newBill.operation = req.body.operation;


			if (req.body.checkUpPrice) 
			    newBill.checkUpPrice = req.body.checkUpPrice;
			if (req.body.checkLowPrice) 
			    newBill.checkLowPrice = req.body.checkLowPrice;

			newBill.save(function(err){
			    if (err) {
				res.json(Error.UNKNOWN);
				return;
			    }
			    var msg = bill_to_msg(newBill);
			    msg.operation = req.body.operation;
			    msg.product = bill.product.name,
			    msg.from = bill.from.display;
			    msg.from_id = bill.from.id;
			    msg.succ = 0;
			    res.json(msg);

			    all_socket.forEach(function(s) {
				broadcast('bill',s,msg);
			    });
			});
		    });
	    return;
	}
    });
});


module.exports = router;
