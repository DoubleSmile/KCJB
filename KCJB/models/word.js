var client = require('../dao/redis_client')

var words;

if (!words) {
    client.smembers('__word',function(err,r) {
	if (r.length) words = RegExp(r.join('|'),'i');
	else words = RegExp('^$');
    });
}

exports.get = function() {if (!words) return RegExp(); return words; };
exports.set = function( w ) { words = w; };

