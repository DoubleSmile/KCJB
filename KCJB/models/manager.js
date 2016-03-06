var client = require('../dao/redis_client')

exports.get = function(callback) {
    client.rpop('__manager', function(err,m) {
	callback(m);
	if (m) client.lpush('__manager',m);
    });
};


exports.add = function(m) {
    client.lpush('__manager',m);
}

exports.remove = function (m) {
    client.lrem('__manager',1,m);
}
