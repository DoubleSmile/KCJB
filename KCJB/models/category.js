var client = require('../dao/redis_client')

module.exports = function(callback) {
    client.smembers('__category',function(err,cat) {
	if (err) {
	    callback(err,[]);
	    return;
	}

	var all = [];
	for (var i=0; i<cat.length; ++i) {
	    all.push({name : cat[i], products : []});
	}

	var grab_products = function(i,cb) {
	    console.log(i);
	    if (i==cat.length) {
		cb(all);
		return;
	    }

	    client.smembers(all[i].name,function(err,reply) {
		if (reply) {
		    all[i].products = reply;
		}
		grab_products(i+1,cb);
	    });
	} 

	grab_products(0,callback);
    });
};

