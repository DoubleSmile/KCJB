var get_ip = require('../utils/ip');
var Ipfilter = require('../models/ipfilter');
var Error = require('../errors');

var middleware = function(req,res,next) {
    var ip = get_ip(req);
    Ipfilter.findOne({ip : ip}, function(err,doc) {
	if (!doc) {
	    next();
	} else {
	    res.json(Error.IP_BAN);
	}
    });
};

module.exports = middleware;
