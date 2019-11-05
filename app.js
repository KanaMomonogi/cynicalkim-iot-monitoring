var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser')
var logger = require('morgan');

var indexRouter = require('./routes/index');
var apiRouter = require('./routes/api');

var app = express();
app.io = require('socket.io')();
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));
app.use('/js', express.static(path.join(__dirname, 'public/javascripts')));

app.use('/', indexRouter);
app.use('/api', apiRouter);
app.io.on('connection', (socket) => {
  console.log('socket connected');
  console.log('made socket connection', socket.id);
  socket.on("ESP", function (data) {
    //app.io.sockets.emit('Hi ESP, ESP called', data);
    console.log(data)
    console.log("Socket Working !");
  });
  socket.on("connect", function (data) {
    console.log(data)
    //app.io.sockets.emit('Hi ESP connect called', data);
    console.log("Socket Working !");
  });
  socket.on("send", function (data) {
    //app.io.sockets.emit('first', data);
    console.log(data)
    app.io.sockets.emit('getData', data);
  });
})
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
