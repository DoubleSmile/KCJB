var io = require('socket.io')();
var word_filter = require('./models/word');
var redis = require('./dao/redis_client');
var broadcast = require('./utils/broadcast');
var Bill = require('./models/bill');
var User = require('./models/user');
var AUTO_INC = require('./models/auto_inc');

var all_user_id = [];
var all_user = []
var all_socket = [];

var power = true;

var msg_queue = [];

var sensitive = function(str) {
    /*
    redis.smembers('__sensitive',function(err,reply) {
	if (!reply) return false;
	RegExp(
    });
    */
    var x = word_filter.get();
    return x.test(str);
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



function speaker_save(say,callback) {
    User.findOne({id : say.from}, '_id', function(err,from) {
	if (!from) callback(say);

	AUTO_INC.findOneAndUpdate({name : 'bill'},
		{$inc : {id : 1}},
		{new : true},
		function(err,idx) {
		    if (!idx) {
			callback(say);
			return;
		    }
		    var newBill = new Bill({
			id : idx.id,
			lobby : say.lobby,
			from : from._id,
			type : 'speaker',
			createTime : say.createTime,
			reason : say.context
		    });
		    newBill.save(function(err) {
			callback(say);
		    });
		});
    });
}



io.on('connection', function(socket) {

    socket.on('disconnect',function() {
	var id = socket.id;
	var idx = all_user_id.indexOf(id);
	if (idx===-1) {
	    return;
	}
	all_user_id.splice(idx,1);
	all_user.splice(idx,1);
	all_socket.splice(idx,1);
	socket.broadcast.emit('logout',idx);
    });

    socket.emit('who');

    socket.on('power',function() {
	var id = Number(socket.id);
	var idx = all_user_id.indexOf(id);
	if (idx===-1) return;
	if (all_user[idx].group!==100) return;
	if (power) power = false;
	else power = true;
	socket.emit('power',{now:power});
    });

    socket.on('who', function(user) {
	/*
	 * id
	 * display
	 * group
	 * grant
	 * qq
	 * ip 
	 */
	socket.emit('room',all_user);

	var id = Number(user.id);
	var idx = all_user_id.indexOf(id);
	if (idx==-1) {
	    socket.id = id;
	    socket.group = user.group;
	    all_user.push(user);
	    all_user_id.push(id);
	    all_socket.push(socket);
	    socket.broadcast.emit('login',user);
	} else {
	    all_socket[idx].emit('kick');
	    socket.emit('who');
//	    socket.id = id;
//	    socket.group = user.group;
//	    all_user[idx] = user;
//	    all_socket[idx] = socket;
	    //socket.broadcast.emit('login',user);
	    /*
	    if (socket==null) console.log('who !');
	    all_socket[idx].emit('kick',idx);
	    socket.id = id;
	    socket.group = user.group;
	    all_user[idx] = user;
	    all_socket[idx] = socket;
	    */
	}
    });

    socket.on('pre_msg', function(msg) {

	if (typeof(msg.from)=='string')
	    msg.from = Number(msg.from);
	if (typeof(msg.createTime)=='string')
	    msg.createTime = new Date(msg.createTime);
	if (typeof(msg.whisper)=='string')
	    msg.whisper = Boolean(msg.whisper);
	if (typeof(msg.to)=='string')
	    msg.to = Number(msg.to);
         msg.context = String(msg.context)
                .replace(/&/g, '&amp;')
                .replace(/"/g, '&quot;')
                .replace(/'/g, '&#39;')
                .replace(/</g, '&lt;')
                .replace(/>/g, '&gt;');

	var from_idx = all_user_id.indexOf(msg.from);
	var to_idx;
	if (from_idx===-1) return;
	msg.from_idx = from_idx;
	msg.from_display = all_user[from_idx].display;

	if (msg.to>=0) {
	    to_idx = all_user_id.indexOf(msg.to);
	    msg.to_idx = to_idx;
	    if(to_idx !== -1)
	    msg.to_display = all_user[to_idx].display ||'出错了';
	    else
	    msg.to_display = '名字出错';

	} else {
	    if (msg.to) delete msg.to;
	    msg.whisper = false;
	    msg.to_display = '大家';
	}

	if (power===false) {
	    socket.emit('msg',msg);
	    return;
	}

	if (all_user[from_idx].grant!==0) {
	    socket.emit('msg',msg);
	    return;
	}

	if (msg.to>=0 && msg.whisper) {
	    if (all_user[from_idx].group >= 90 || 
		    all_user[to_idx].group >= 90) {

		redis.incr('__mid',function(err,mid) {
		    msg.id = mid;
		    msg.pass = 1;
		    redis.set( '__msg_'+msg.id,
			    JSON.stringify(msg),
			    'EX',30*60,
			    function(err,reply) {
				all_socket.forEach(function(s) {
				    if (s.group>=90) s.emit('msg',msg);
				    else if (s.id === msg.to) s.emit('msg',msg);
				});
				if (socket.group<90) socket.emit('msg',msg);
			    });
		});
	    } else {
		socket.emit('msg',{
		    from : -1,
		    from_display : '系统',
		    to : socket.id,
		    to_display : msg.from_display,
		    context : '只能对客服和分析师说悄悄话',
		    pass : true
		});
	    }	
	    return;
	}  

	if (socket.group>=90) {
	    redis.incr('__mid',function(err,mid) {
		msg.id = mid;
		msg.pass = 1;
		redis.set('__msg_'+mid,JSON.stringify(msg),'EX',30*60,function(err,reply) {
		    socket.broadcast.emit('msg', msg);
		});
	    });
	    return;
	}



	redis.incr('__mid',function(err,mid) {
	    msg.id = mid;

	    redis.set('__msg_'+mid,JSON.stringify(msg),'EX',30*60,function(err,reply) {
		socket.emit('msg',msg);
		all_socket.forEach(function(s) {
		    if (s.group >= 90) {
			s.emit('pre_msg',msg);
		    }
		});
	    });
	});
    });

    socket.on('msg', function(msg_id) {
	redis.get('__msg_'+msg_id,function(err,msgStr) {
	    if (!msgStr) return;
	    msg = JSON.parse(msgStr);
	    if (msg.pass) return;
	/*
	 * msg : {
	 *   id
	 *   from : id
	 *   from_idx
	 *   to : id [option]
	 *   to_idx
	 *   createTime : Date
	 *   whisper : bool
	 *   context : text
	 * }
	 */

	    var from_idx = all_user_id.indexOf(msg.from);
	    var to_idx;


	    if (from_idx===-1) return;
	    msg.from_idx = from_idx;
	    msg.from_display = all_user[from_idx].display;

	    if (msg.to>=0) {
		to_idx = all_user_id.indexOf(msg.to);
		msg.to_idx = to_idx;
		msg.to_display = all_user[to_idx].display;
	    } else {
		msg.to_display = '大家';
	    }

	    if (power===false) {
		return;
	    }

	    if (all_user[from_idx].grant!==0) {
		socket.emit('msg',msg);
		return;
	    }
	    /*
	    if (msg.to>=0 && msg.whisper) {

		if (all_user[from_idx].group >= 90 || 
			all_user[to_idx].group >= 90) {

		    msg.pass = 1;

		    redis.set( '__msg_'+msg.id,
			    JSON.stringify(msg),
			    'EX',30*60,
			    function(err,reply) {
				socket.emit('msg',msg);
			    });

		    all_socket[from_idx].emit('msg',msg);
		    all_socket[to_idx].emit('msg',msg);
		}

	    } else
		*/
	    {

		msg.pass = 1;

		redis.set('__msg_'+msg.id,JSON.stringify(msg),'EX',30*60,
			function(err,reply) {});

		all_socket.forEach(function(s) {
		    if (s.group<90 && s.id !== msg.from) {
			s.emit('msg',msg);
		    }
		    else if (s.group>=90) {
			s.emit('passed',msg.id);
		    }
		});
	    
		//socket.broadcast.emit('msg',msg);
	    }
	});
    });

    /*
    socket.on('bill', function(billMsg) {
	console.log(billMsg);
	Bill.bind(billMsg,function(err,bill) {
	    console.log({where : 'afterbind', data : bill});
	    if (!bill) {
		socket.emit('bill',err);
		return;
	    }
	    Bill.create(bill,function(err,b) {
		if (!b) {
		    socket.emit('bill',err);
		    return;
		}
		Bill.to_msg(b,function(r) {
		    console.log(all_socket.length);
		    all_socket.forEach(function(s) {
			Bill.broadcast(s,r);
		    });
		});
	    });
	});
	/*
	 * bill : {
	 *    id Number
	 *    from : id
	 *    category : String
	 *    product : String
	 *    lobby : boolean
	 *    type : Number
	 *    openPrice :Number    
	 *    checkUpPrice : Number
	 *    checkLowPrice : Number
	 *    operation : 
	 *    createTime : 
	 * }
	 */
    //});

    socket.on('speaker', function(say) {
	/*
	 * say : {
	 *    from : id
	 *    msg  : Msg
	 *    lobby : boolean
	 *    createTime : 
	 * }
	 */
	speaker_save(say,function(say) {
	    var idx = all_user_id.indexOf(say.from);
	    if (idx!==-1) {
		if (say.group < 90) return;
		all_socket.forEach(function(s) {
		    broadcast('speaker',s,{
			from_id : say.from,
		       	lobby : say.lobby,
		       	from : say.from, 
			from_idx : idx, 
			display : all_user[idx].display, 
			msg : say.context, 
			createTime : date_format(say.createTime)
		    });
		});
	    }
	});
    });

});
exports.listen = function (server) {
    return io.listen(server);

}
exports.all_socket = all_socket;

exports.all_user = all_user;
exports.all_id = all_user_id;
