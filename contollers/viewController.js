/* eslint-disable prettier/prettier */
const Tour = require('../models/tourModel')
const User = require('../models/userModel')
const AppError = require('../utils/appError')
const catchAsync = require("../utils/catchAsync")
const Booking = require('../models/bookingModel')
exports.getOverview = catchAsync(async (req, res) => {

  const tours = await Tour.find()


  res.status(200).render('overview', {
    title: "All Tour",
    tours
  })
})

exports.getTour = catchAsync(async (req, res, next) => {
  const tour = await Tour.findOne({ slug: req.params.slug }).populate({
    path: "reviews",
    fields: "review rating user"
  })

  if (!tour) {
    return next(new AppError(`Tour not found`));
  }
  res.status(200).render('tour', {
    title: `${tour.name} Tour`,
    tour
  })
})
exports.getLoginForm = catchAsync(async (req, res) => {

  res.status(200).render('login', {
    title: `Login in to your Account`,
  })
})

exports.getAccount = (req, res) => {

  res.status(200).render('account', {
    title: "Your account"
  })

}


exports.updateUserData = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const updatedUser = await User.findByIdAndUpdate(req.user.id, {
    name: req.body.name,
    email: req.body.email
  }, {
    new: true,
    runValidators: true
  });

  res.status(200).render('account', {
    title: "Your Acount",
    user: updatedUser
  })
})


exports.getMyTours = catchAsync(async (req, res, next) => {
  // 1) Find all bookings
  // 2) Find tours with the returned IDs
  const bookings = await Booking.find({ user: req.user.id })

  const tourIDs = bookings.map(el => el.tour)
  const tours = await Tour.find({ _id: { $in: tourIDs } })

  res.status(200).render('overview', {
    title: "My Tours",
    tours
  })
})