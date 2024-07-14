/* eslint-disable node/no-unsupported-features/es-syntax */
/* eslint-disable prettier/prettier */
/* eslint-disable no-unused-expressions */
const AppError = require("../utils/appError")


const handleCastErrorDB = err => {
  const message = `Invalid ${err.path} : ${err.value}.`
  return new AppError(message, 400)
}


const handleDublicateFieldDB = (err, res) => {

  const value = err.keyValue.name;
  const message = `Duplicate Field Value ${value} use ANother value.`
  return new AppError(message, 400)
}

const handleValidationError = (err, res) => {

  const errors = Object.values(err.errors).map(el => el.message);
  const message = `INvalid Input Data. ${errors.join('. ')}`
  return new AppError(message, 400)
}


const sendErrorDev = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack
    })
  }

  return res.status(err.statusCode).render('error', {
    title: "Something Went Wrong!",
    msg: err.message
  })

}

const handleJWTError = err => new AppError('Invalid Token PLease log in again', 401)

const handleJWTExpiredError = err => new AppError("Your Token has Expired")


const sendErrorProd = (err, req, res) => {
  if (req.originalUrl.startsWith('/api')) {
    if (err.isOperational) {

      res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      })
    }
    else {
      res.status(500).json({
        status: 'error',
        message: "Something went wrong"
      })
    }
  }
  else {

    if (err.isOperational) {

      res.status(err.statusCode).render('error', {
        title: "Something Went Wrong!",
        msg: err.message
      })

    }
    else {
      res.status(err.statusCode).render('error', {
        title: "Something Went Wrong!",
        msg: 'Please Try Again Later.'
      })
    }
  }




}


module.exports = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error'
  if (process.env.NODE_ENV === 'development') {
    sendErrorDev(err, req, res);
  }
  else if (process.env.NODE_ENV === 'production') {
    let error = { ...err };
    error.message = err.message;

    if (error.name === "CastError") error = handleCastErrorDB(error)


    if (error.code === 11000) error = handleDublicateFieldDB(error)

    if (error.code === 'ValidationError') error = handleValidationError(error)

    if (error.name === 'JsonWebTokenError') error = handleJWTError(error)
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError(error)


    sendErrorProd(error, req, res);
  }
}