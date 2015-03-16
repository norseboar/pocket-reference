var express = require('express');
var data = require('../data');

var router = express.Router();

// GET home page
router.get('/', function(req, res, next){
  res.render('index', {claims: data.getClaims});
});

module.exports = router;
