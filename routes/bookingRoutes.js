/* eslint-disable prettier/prettier */
const express = require("express");

const router = express.Router();
const bookingController = require("../contollers/bookingController")
const authController = require('../contollers/authController')
router.use(authController.protect);

router.get('/checkout-session/:tourId', bookingController.getCheckoutSession)
router.use(authController.restrictTo("admin", "lead-guide"));

router.route('/').get(bookingController.getAllBooking).post(bookingController.createBooking)

router.route('/:id').get(bookingController.getBooking).patch(bookingController.updateBooking).delete(bookingController.deleteBooking)

module.exports = router;