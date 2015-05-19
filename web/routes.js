"use strict"

var express = require('express');
var router = express.Router(); // despite being upper-case, express.Router()
                               // does /not/ need new
var request = require('request');
var cheerio = require('cheerio');
var path = require('path');
var url = require('url');

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

    if(req.body['remember-me'] === 'on') {
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
      var claimText = req.body.title;
      var claimUrl = req.body.url;

      // http will be added to url if there is no header
      var re = /^[A-Za-z]+:\/\//;
      if(!claimUrl.match(re)) {
        claimUrl = 'http://' + claimUrl;
      }

      var parsedUrl = url.parse(claimUrl);
      // get title of web page
      // 'page' is used as a prefix to not be confused with overall
      // req and res objects
      request({
        url: parsedUrl,
        jar: true
      }, function(pageErr, pageRes, pageBody) {
        var pageTitle = '';
        var imgSrc = '';
        if(!pageErr) {
          // Grab favicon of webpage as image
          var faviconPrefix = 'http://www.google.com/s2/favicons?domain=';
          imgSrc = faviconPrefix + parsedUrl.hostname;

          var pageParser = cheerio.load(pageBody);
          pageTitle = pageParser('title').text();
        }

        if(!claimText || !claimUrl) {
          res.json({status: 2, message: 'invalid claim'});
          return;
        }

        var claim = new Claim();
        claim.claimText = claimText;
        claim.pageTitle = pageTitle;
        claim.url = claimUrl;
        claim.imgSrc = imgSrc;

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
