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
      res.render('index', {loggedIn: false});
    }
  });

  // CLAIMS PAGE (default for logged in users)
  router.get('/=', isLoggedIn, function(req, res){
    // If user is logged in, show their claims
    res.render('claims', {user: req.user, loggedIn: true})
  });

  // LOGIN ====================================================================
  // show login form
  router.get('/login', function(req, res){
    // render, passing in any flash data (if it exists)
    res.render('login', {message: req.flash('loginMessage'), loggedIn: false});
  });

  // process login form
  router.post('/login', function(req, res, next) {
    console.log(req.body);

    if(req.body['remember-me'] === 'on') {
      console.log('remembering');
      req.session.cookie.expires = new Date(Date.now() +
          2592000); // Thirty days worth of seconds
    }
    return next();
  }, passport.authenticate('local-login', {
    successRedirect: '/=',
    failureRedirect: '/login',
    failureFlash: true
  }));

  // REGISTER =================================================================
  router.get('/register', function(req, res){
    // render, passing in any flash data (if it exists)
    res.render('register', {message: req.flash('registerMessage'),
        loggedIn: false});
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
      var title = req.body.title;
      var description = req.body.description;
      var url = req.body.url;
      var image = req.body.image;

      if(!title || !url) {
        console.log('about to return and ignore');
        res.json({status: 2, message: 'invalid claim'});
        return;
      }

      // http will be added to url if there is no header
      var re = /^[A-Za-z]+:\/\//;
      if(!url.match(re)) {
        url = 'http://' + url;
      }


      var claim = new Claim();
      claim.title = title;
      claim.description = description;
      claim.url = url;
      claim.image = image;

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
        // Check if the user would like the cookie to be long-lived
        if(req.body.rememberMe) {
          req.session.cookie.expires = new Date(Date.now() +
              2592000); // Thirty days worth of seconds
        }
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
