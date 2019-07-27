var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser=require('body-parser')
const mongoose=require('mongoose');
var cors =require('cors')
require('./schema/LatLongData'); //schema included before routes
var indexRouter = require('./routes/index');
var locateRouter = require('./routes/locate');
var dataAnalysisRouter = require('./routes/machine-learning');
express.static('/')

require('dotenv').config({ path: 'config/variables.env' });

mongoose.Promise = global.Promise;
const options = {
  useNewUrlParser: true,
}
mongoose.connect(process.env.MONGO_URL, options)
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


//routes
app.use('/', indexRouter)
app.use('/locate', locateRouter)
app.use('/python',dataAnalysisRouter)
app.use(express.static('public'))

// // error handler
// app.use(function(err, req, res, next) {
//   // set locals, only providing error in development
//   res.locals.message = err.message;
//   res.locals.error = req.app.get('env') === 'development' ? err : {};

//   // render the error page
//   res.status(err.status || 500);
//   res.render('error');
// });

// launch backend into a port
const API_PORT=process.env.API_PORT
const server=app.listen(API_PORT, () => console.log(`LISTENING ON PORT ${API_PORT}`));
const database = mongoose.connection;

module.exports = app;
