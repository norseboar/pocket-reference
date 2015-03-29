"use strict"

var express = require('express');
var router = express.Router(); // despite being upper-case, express.Router()
                               // does /not/ need new

module.exports = function (passport){
  // Authentication logic
  var isLoggedIn = function(req, res, next){
    if(req.isAuthenticated()){
      return next();
    }
    else {
      res.redirect('/');
    }
  };


  // HOME PAGE ==================================================================
  router.get('/', function(req, res){
    if(req.isAuthenticated()){
      res.redirect('/=');
    }
    else {
      // If user is not logged in, show landing page
      res.render('index');
    }
  });

  // CLAIMS PAGE (default for logged in users)
  router.get('/=', isLoggedIn, function(req, res){
    // If user is logged in, show their claims
    var db = req.db;
    var collection = db.get('claimscollection');
    collection.find({},function(e, docs){
      res.render('claims', {claims: docs, user: req.user})
    });
  })

  // LOGIN ======================================================================
  // show login form
  router.get('/login', function(req, res){
    // render, passing in any flash data (if it exists)
    res.render('login', { message: req.flash('loginMessage')});
  });

  // process login form
  router.post('/login', passport.authenticate('local-login', {
    successRedirect: '/=',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // REGISTER ===================================================================
  router.get('/register', function(req, res){
    // render, passing in any flash data (if it exists)
    res.render('register', {message: req.flash('registerMessage')});
  });

  // process registration form
  router.post('/register', passport.authenticate('local-register', {
    successRedirect: '/=', // redirect to the user's claims page
    failureRedirect: '/register', // redirect back to registration page if there
                                  // is error
    failureFlash: true // allow flash messages
  }));

  // LOGOUT =====================================================================
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  return router;
};
