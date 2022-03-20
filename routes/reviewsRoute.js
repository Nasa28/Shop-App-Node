const express = require('express');
const reviewsController = require('../controllers/reviewsController');
const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

router
  .route('/')
  .get(authController.protectRoutes, reviewsController.getAllReviews)
  .post(
    authController.protectRoutes,
    authController.adminAccess('user'),
    reviewsController.createReview
  );

module.exports = router;
