var path = require('path');
var express = require('express');
var hbs = require('express-hbs');
var mongo = require('mongodb');
var monk = require('monk');
var morgan = require('morgan');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

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
var db = monk(process.env.MONGOLAB_URI);
app.use(function(req, res, next){
  req.db = db;
  next();
});

app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended:false }));
app.use(bodyParser.json());
app.use(cookieParser());

// routing ====================================================================
var routes = require(path.join(__dirname, 'routes/index'));
app.use('/', routes);

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

app.use(function(err, req, res, next){
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});

module.exports = app;

// launch =====================================================================
var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
