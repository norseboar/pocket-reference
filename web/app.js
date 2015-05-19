"use strict"

var path = require('path');
var express = require('express');
var hbs = require('express-hbs');
var mongoose = require('mongoose');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var session = require('express-session');
var passport = require('passport');
var flash = require('connect-flash');
var io = require('socket.io');

// configuration ==============================================================
var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// Set up handlebars
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views/layout.hbs')
}));

// Connect to MongoDB
// Every request is probably overkill, this is a rough solution
mongoose.connect(process.env.MONGOLAB_URI);

// set up passport
var passportConfig = require(path.join(__dirname, 'config/passport'));
passportConfig(passport);
app.use(session({
  name: 'pocket-ref.connect.sid',
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  // Cookie does not need to be secure if in dev environment
  cookie: { secure: app.get('env') === 'development' ? false : true }
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(flash());
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(cookieParser());

// routing ====================================================================
var routes = require(path.join(__dirname, 'routes'));
var router = routes(passport);
app.use('/', router);

// Catch 404 and forwarding to error handler
app.use(function(req, res, next){
  var err = new Error('Not Found');
  err.status = 404;
  next(err)
});

// Error handlers
if (app.get('env') === 'development'){
  app.use(function(err, req, res, next){
    res.status(err.status || 500);
    res.render('error', {
      message:err.message,
      error: err
    });
  });
}

module.exports = app;

// launch =====================================================================
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Pocket Reference server listening on port ', port);
});

io.listen(server);
