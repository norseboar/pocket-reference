"use strict"

var express = require('express');
var router = express.Router(); // despite being upper-case, express.Router()
                               // does /not/ need new
var path = require('path');
var User = require(path.join(__dirname, '/models/user'));
var Claim = require(path.join(__dirname, '/models/claim'));


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


  // HOME PAGE ================================================================
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
    res.render('claims', {user: req.user})
  });

  // LOGIN ====================================================================
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

  // REGISTER =================================================================
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

  // LOGOUT ===================================================================
  router.get('/logout', function(req, res){
    req.logout();
    res.redirect('/');
  });

  // REST APIS ================================================================
  // API TO ADD/REMOVE CLAIMS
  router.post('/api/add_claim', function(req, res){
    if(req.isAuthenticated()){
      var claim = new Claim();
      claim.title = req.body.title;
      claim.description = req.body.description;
      claim.url = req.body.url;
      claim.image = req.body.image;

      var user = req.user;

      if(!user.claims){
        user.claims = [];
      }
      user.claims.push(claim);
      user.save(function(err){
        if(err){
          res.send(err);
        }
        else {
          res.json({status: 0, message: 'claim added'})
        }
      });
    }
    else {
      res.json({status: 1, message: 'access denied: not authenticated'});
    }
  });

  // Login to pocket reference (will provide an authenticated session cookie)
  router.post('/api/login', function(req, res, next) {
    // If user already has a token, let them in
    if(req.isAuthenticated()) {
      res.json({status: 0, message: 'already authenticated'});
    } else {
      // Make sure user actually provided credentials
      if(!req.body.email || !req.body.password) {
        res.json({status: 1, message: 'access denied: no credentials'});
      }
      else {
        return next();
      }
    }
  }, passport.authenticate('local-login', {
    failureFlash: true
  }), function(req, res) {
    console.log('finished');
    res.json({message: req.flash('loginMessage')})
  });

  return router;
};
