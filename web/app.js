var path = require('path');
var express = require('express');
var hbs = require('express-hbs');
var data = require('./data');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.express4({
  defaultLayout: path.join(__dirname, 'views/layout.hbs')
}));

app.use(express.static(path.join(__dirname, 'public')));

// Catch 404 and forwarding to error handler
// TODO: add other 'use' statements so that good paths are caught first. This
// one should act as a catch-all  for other paths

// app.use(function(req, res, next){
//   var err = new Error('Not Found');
//   err.status = 404;
//   next(err)
// });

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

app.get('/', function(req, res){
  res.render('index', {claims: data.getClaims});
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
