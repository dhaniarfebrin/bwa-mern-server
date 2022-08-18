// this is the entry file, middleware, routes

var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

const session = require('express-session') // express session
const flash = require('connect-flash') // connect flash
const methodOverride = require('method-override') // method override pengganti PUT dan DELETE

// declare the router pages
const dashboardRouter = require('./app/dashboard/router');
const categoryRouter = require('./app/category/router');
const nominalRouter = require('./app/nominal/router');
const voucherRouter = require('./app/voucher/router');
const bankRouter = require('./app/bank/router');
const paymentRouter = require('./app/payment/router');

var app = express(); // initiate express

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// session initiate
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  cookie: { }
}))
app.use(flash()); // connect flash initiate

// override with POST having ?_method=DELETE or ?_method=PUT
app.use(methodOverride('_method')) // using method override

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// deklarasi jika ada route seperti /adminlte akan diarahkan ke directory name /node_modules/admin-lte/
app.use('/adminlte', express.static(path.join(__dirname, '/node_modules/admin-lte'))) 

// deklarasi setiap router page
app.use('/', dashboardRouter);
app.use('/category', categoryRouter);
app.use('/nominal', nominalRouter);
app.use('/voucher', voucherRouter);
app.use('/bank', bankRouter);
app.use('/payment', paymentRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use( (err, req, res, next) => {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
