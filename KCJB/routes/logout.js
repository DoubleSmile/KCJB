var express = require('express');
var getIP = require('../utils/ip');
var router = express.Router();

/* GET users listing. */
router.post('/', function(req, res, next) {
    if (req.session && req.session.token) {
	//delete req.session.token;
	req.session.destroy();
    }
    res.json({succ :0 ,msg : 'ok'});
    return;
});

module.exports = router;
