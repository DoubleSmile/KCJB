var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var session = require('express-session');
var redis_session = require('connect-redis')(session);
var io = require('socket.io');

var config = require('./config');
mongoose.connect(config.db);

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/favicon.ico'));
//app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session({
    store : new redis_session(),
    resave : true,
    saveUninitialized : true,
    //cookie : {maxAge : -1}
    secret : 'oc_secret_test',
}));

app.use('/HTGL', express.static(path.join(__dirname, 'www/HTGL')));
app.use('/angular', express.static(path.join(__dirname, 'www/angular')));
app.use('/content', express.static(path.join(__dirname, 'www/content')));
app.use('/css', express.static(path.join(__dirname, 'www/css')));
app.use('/fonts', express.static(path.join(__dirname, 'www/fonts')));
app.use('/images', express.static(path.join(__dirname, 'www/images')));
app.use('/js', express.static(path.join(__dirname, 'www/js')));
app.use('/scss', express.static(path.join(__dirname, 'www/scss')));
app.use('/login.html', express.static(path.join(__dirname, 'www/login.html')));

app.use(require('./middlewares/ipfilter'));

app.use('/api/login', require('./routes/login'));
app.use('/api/logout', require('./routes/logout'));
app.use('/api/info', require('./routes/info'));
app.use('/api/profile',require('./routes/profile'));
app.use('/api/change_pass',require('./routes/change_password'));
app.use('/api/category',require('./routes/category'));
app.use('/api/product',require('./routes/product'));
app.use('/api/regist',require('./routes/regist'));
app.use('/api/group',require('./routes/group'));
app.use('/api/bill',require('./routes/bill'));
app.use('/api/user',require('./routes/user'));
app.use('/api/word',require('./routes/word'));
app.use('/api/stat',require('./routes/stat'));
app.use('/api/suscribe',require('./routes/suscribe'));
app.use('/api/send',require('./routes/send'));
app.use('/api/blacklist',require('./routes/blacklist'));
app.use('/api/history',require('./routes/history'));
//app.use('/users', users);

//app.use('/', require('./middlewares/token_check'));
app.use('/', express.static(path.join(__dirname, 'www')));
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//  app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//      message: err.message,
//      error: err
//    });
//  });
//}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
