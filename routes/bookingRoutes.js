/* eslint-disable prettier/prettier */
const express = require("express");

const router = express.Router();
const bookingController=require("../contollers/bookingController")
const authController=require('../contollers/authController')


router.get('/checkout-session/:tourId',authController.protect,bookingController.getCheckoutSession)


module.exports = router;