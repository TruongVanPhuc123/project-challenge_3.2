// const { sendResponse } = require('./helpers/utils');

var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors');
require('dotenv').config()

var indexRouter = require('./routes/index');
const { default: mongoose } = require('mongoose');
const { sendResponse } = require('./helpers/utils');

var app = express();
app.use(cors())

const mongodb_url = process.env.MONGODB_URL

mongoose
    .connect(mongodb_url)
    .then(() => console.log(`Connected to DB: ${mongodb_url}`))
    .catch((e) => console.log(e.message))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.statusCode = 404;
    next(error);
})

app.use((err, req, res, next) => {
    console.log("Error", err)
    return sendResponse(
        res,
        err.statusCode ? err.statusCode : 500,
        null,
        { message: err.message },
        err.isOperational ? err.errorType : "Internal Server Error"
    )
})

module.exports = app;
