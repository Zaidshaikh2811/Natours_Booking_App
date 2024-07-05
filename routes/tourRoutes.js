/* eslint-disable prettier/prettier */
const express = require("express");
const tourController = require("../contollers/tourController");
const authController=require("../contollers/authController")

const router = express.Router();
const reviewRouter = require('./reviewRoute');

// router.param('body', tourController.checkBody);
// router.param("id", tourController.checkID);
router.use('/:tourId/reviews',reviewRouter);
router.route('/top-5-cheap').get(tourController.aliasTopTour,tourController.getAllTours);

router.route('/tours-within/:distance/center/:latlng/units/:unit').get(tourController.getTourWithin)

router
  .route("/")
  .get(tourController.getAllTours)
  .post(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.createTour);

router.route("/tour-stats").get(tourController.getTourStats)  
router.route("/monthly-plan/:year").get(authController.protect,authController.restrictTo('admin','lead-guide','guide'),tourController.getMonthlyPlan)  
router.route("/distances/:latlng/units/:unit").get(tourController.getDistances)  

router
  .route("/:id")
  .get(tourController.getTour)
  .patch(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.uploadTourImages,tourController.resizeTourImage,tourController.updateTour)
  .delete(authController.protect,authController.restrictTo('admin','lead-guide'),tourController.deleteTour);

// router.route("/:tourId/reviews").post(authController.protect,authController.restrictTo('user'),
// reviewController.createReview)  

module.exports = router;
