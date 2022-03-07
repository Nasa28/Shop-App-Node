const express = require('express');
const ordersController = require('../controllers/ordersController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();

const { placeOder, getOrders, cancelOrder } = ordersController;

router
  .route('/')
  .get(protectRoutes, getOrders)
  .post(protectRoutes, placeOder)
  .delete(protectRoutes, cancelOrder);

module.exports = router;
