var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const multer = require('multer')
const objUpload = multer({dest:'./tmp'}) // tạo thư mục tmp tại thư mục gốc
const AuthRouter = require('./routes/auth')
const ProductRouter = require('./routes/product')
const bodyParser = require('body-parser')

var indexRouter = require('./routes/index');
const mongoose = require('mongoose')


const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://anhntph37315:tanh12345@mern.71gp63m.mongodb.net/asmRestAPI')
    console.log('Kết nối monggodb thành công');
  } catch (error) {
    console.log(error);
  }
  
}
connectDB()


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(bodyParser.json())
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/auth',objUpload.single('image'),AuthRouter)
app.use('/product',objUpload.single('image'),ProductRouter)


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
