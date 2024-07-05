/* eslint-disable prettier/prettier */
const express = require("express");
const morgan = require("morgan");
const tourRouter = require("./routes/tourRoutes");
const userRouter = require("./routes/userRoute");
const reviewRoute = require("./routes/reviewRoute");
const viewRouter = require("./routes/viewRouter");
const bookingRoutes = require("./routes/bookingRoutes");
const AppError=require("./utils/appError")
const  globalErrorHandler=require('./contollers/errorController')
const rateLimit=require('express-rate-limit')
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');
const path=require("path")
const cookieParser=require('cookie-parser');


const app = express();

app.set('view engine','pug')
app.set('views',path.join(__dirname,'views'))
app.use(express.static(path.join(__dirname,'public')));

app.use(helmet())
app.use(express.urlencoded({extended:true,limit:'10kb'}))
app.use(mongoSanitize())
app.use(xss())
app.use(hpp({
  whiteList:[
    'duration','ratingAverage',
'ratingQuantity','maxGroupSize','difficulty','price'
  ]
}))

app.use((req, res, next) => {
    if (req.url.endsWith('.js')) {
        res.type('application/javascript');
    }
    next();
});

const limiter=rateLimit({
  max:100,
  windowMs:60*60*1000,
  message:"Too Many Request from this IP,Please Try Again in an Hour"
})


app.use('/api',limiter);
if (process.env.BODE_ENV === "development") {
  app.use(morgan("dev"));
}
app.use(express.json({
  limit:'10kb'
}));
app.use(cookieParser())


// app.use(express.static(`${__dirname}/public`));
app.use(express.static(path.join(__dirname,'public')));

app.use((req,res,next)=>{
  
  next();
})


app.use("/", viewRouter);
app.use("/api/v1/tours",tourRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/review", reviewRoute);
app.use("/api/v1/booking", bookingRoutes);
app.all("*",(req,res,next)=>{

next(new AppError(`Cant Find ${req.originalUrl} on the Server`,404))
});

app.use(globalErrorHandler)

module.exports = app;
