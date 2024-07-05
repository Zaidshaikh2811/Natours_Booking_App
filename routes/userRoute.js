/* eslint-disable prettier/prettier */
const express = require('express');

const router = express.Router();
const userController = require('../contollers/userController');
const authController = require('../contollers/authController');
const multer=require('multer')

const upload=multer({dest:'public/img/users'})


router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.get('/logout', authController.logout);
router.post('/forgotPassword', authController.forgotPassword);
router.patch('/resetPassword/:token', authController.resetPassword);

router.use(authController.protect);

router.patch('/updateMyPassword', authController.updatePassword);


router
  .route('/me').get(userController.getMe,userController.getUsers)
  router.patch('/updateMe',userController.uploadUserPhoto, 
  
  userController.resizedUserPhoto,userController.updateMe);
  router.delete('/deleteMe', userController.deleteMe);



router.use(authController.restrictTo('admin'))
router
  .route('/')
  .get(userController.getAllUsers)
  .post(userController.createUser);

  router
  .route('/:id')
  .get(userController.getUsers)
  .patch(userController.updateUser)
  .delete(
    authController.restrictTo('admin','lead-guide'),
    userController.deleteUser);


module.exports = router;
