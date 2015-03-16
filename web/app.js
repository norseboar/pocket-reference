var express = require('express');
var hbs = require('hbs');
var data = require('./data');

var app = express();
app.set('port', process.env.PORT || 3000);
app.set('view engine', 'hbs');
app.engine('hbs', hbs.__express);

app.get('/', function(req, res){
  res.render('index', {claims: data.getClaims});
});

var server = app.listen(app.get('port'), function() {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://localhost:%s', port);
});
