var Gift = require('../models/gift');

var empty_reply = function(r) {
    return {type : 'guest', createTime : r.createTime};
}

module.exports = function(e, socket,reply) {
    if (reply.lobby) {
	if (socket.group == 0) {
	    socket.emit(e,empty_reply(reply));
	} else {
	    socket.emit(e,reply);
	}
    } else {
	if (reply.from_id === socket.id) {
	    socket.emit(e,reply);
	    return;
	}
	if (socket.group === 100) {
	    socket.emit(e,reply);
	    return;
	}

	Gift.find({
	    'pair.to' :  reply.from_id,
	    'pair.from' :  socket.id,
	    name : 'suscribe'
	},function(err,docs) {

		docs.forEach(function(doc){
			if (!doc.expire) {
					socket.emit(e,reply);
					return;
				}
		});
	    // console.log('GIFT',socket.id,reply.from_id,doc);
	    // if (!doc) return;
	    // if (doc.expire) return;
	    //socket.emit(e,reply);
	});
	// Gift.findOne({
	//     'pair.to' :  reply.from_id,
	//     'pair.from' :  socket.id,
	//     name : 'suscribe'
	// },function(err,doc) {
	//     console.log('GIFT',socket.id,reply.from_id,doc);
	//     if (!doc) return;
	//     if (doc.expire) return;
	//     socket.emit(e,reply);
	// });
    }
}
