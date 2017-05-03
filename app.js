
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , login = require('./routes/login')
  , http = require('http')
  , bodyparser = require('body-parser')
  , path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3001);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
//app.use(express.bodyParser());
app.use(express.methodOverride());

app.use(bodyparser.urlencoded({extended : false}));
app.use(bodyparser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.use(app.router);


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.get('/users', user.list);
app.get('/login', login.signin);
app.post('/application', login.signedin);
app.post('/generateuml', login.generateuml);
app.post('/grades', login.grades);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});
