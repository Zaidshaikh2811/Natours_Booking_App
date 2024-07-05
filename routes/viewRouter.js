/* eslint-disable prettier/prettier */
const express=require('express')

const router=express.Router()
const viewController=require('../contollers/viewController')
const authController=require('../contollers/authController')
const bookingController=require('../contollers/bookingController')



router.get('/',bookingController.createBookingCheckout,authController.isLoggedIn,viewController.getOverview)

router.get('/tour/:slug',authController.isLoggedIn,viewController.getTour)

router.get('/login',authController.isLoggedIn,viewController.getLoginForm)

router.get('/me',authController.protect,viewController.getAccount)

router.post('/submit-user-data',authController.protect,viewController.updateUserData)


module.exports=router;