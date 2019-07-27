var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser')
const session = require('express-session')
const mongoose=require('mongoose');
require('./schema/LatLongData');
var cors =require('cors')
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');

express.static('/')

const MongoStore = require('connect-mongo')(session);
mongoose.Promise = global.Promise;

const options = {
  useNewUrlParser: true,
}

const mongoURL="mongodb://lena:shaky2019@ds215089.mlab.com:15089/shaky-quakes"

mongoose.connect(process.env.DATABASE || mongoURL, options)
.then(
  ()=> {console.log("connected to MongoDB")},
  (err)=>{console.log(err);}
);

// When the mongodb server goes down, mongoose emits a 'disconnected' event
mongoose.connection.on('disconnected', () => { console.log('-> lost connection'); });
// The driver tries to automatically reconnect by default, so when the
// server starts the driver will reconnect and emit a 'reconnect' event.
mongoose.connection.on('reconnect', () => { console.log('-> reconnected'); });

// Mongoose will also emit a 'connected' event along with 'reconnect'. These
// events are interchangeable.
mongoose.connection.on('connected', () => { console.log('-> connected'); });




var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));
//app.use('/uploads',express.static('uploads'))

// launch backend into a port
const API_PORT=5000;
const server=app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
//const server=app.listen(process.env.PORT || API_PORT)

module.exports = app;


const database = mongoose.connection;
app.use(session({
  secret: process.env.SECRET || "SECRETSESH",
  resave: false,
  saveUninitialized: true,
  store: new MongoStore({ mongooseConnection: database })
}));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use(express.static('public'))

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

module.exports = app;
