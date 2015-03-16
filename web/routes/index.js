var express = require('express');
var data = require('../data');
var router = express.Router();

// GET home page
router.get('/', function(req, res, next){
//   var db = req.db;
//   var collection = db.get('claimscollection');
  // collection.find({},{},function(e, docs){
  //   res.render('index', {claims: docs})
  // });
  res.render('index', {claims: data.getClaims});
});

module.exports = router;
