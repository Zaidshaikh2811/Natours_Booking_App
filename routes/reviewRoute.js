/* eslint-disable prettier/prettier */
const express = require("express");

const router = express.Router({mergeParams:true});
const reviewController=require("../contollers/reviewController")
const authController=require('../contollers/authController')


router.route('/').get(reviewController.getAllReviews).post(authController.protect,authController.restrictTo('user'),reviewController.setTourUserIds,reviewController.createReview);


router.route("/:tourId/reviews").post(authController.protect,authController.restrictTo('user'),
reviewController.createReview);  


router.route('/:id').delete(authController.restrictTo('user','admin'),reviewController.deleteReview).get(reviewController.getReview).patch(authController.restrictTo('user','admin'),reviewController.updateReview);


module.exports = router;