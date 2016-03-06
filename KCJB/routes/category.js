var express = require('express');
var router = express.Router();
var detail = require('../models/product');

var category = require('../models/category');

/* GET users listing. */
router.get('/', function(req, res, next) {
    category(function(c) {res.json(c)});
    return;
});

router.get('/detail', function(req,res,next) {
    detail.find({},function(err,doc) {
	if (!doc) {
	    res.json([]);
	} else {
	    res.json(doc);
	}
    });
});

module.exports = router;
