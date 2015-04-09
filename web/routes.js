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
    console.log('in add claim');
    if(req.isAuthenticated()){
      console.log('authenticated');
      var claim = new Claim();
      claim.title = req.body.title;
      claim.description = req.body.description;
      claim.url = req.body.url;
      claim.image = req.body.image;

      console.log('claim created');
      var user = req.user;

      if(!user.claims){
        console.log('creating claims array');
        user.claims = [];
      }
      user.claims.push(claim);
      console.log('about to save');
      user.save(function(err){
        if(err){
          console.log('error');
          res.send(err);
        }
        else {
          console.log('claim added');
          res.json({ message: 'claim added' })
        }
      });
    }
    else {
      console.log('unauthenticated server')
      // TODO: Send back unauthenticated error
    }
  });

  return router;
};
