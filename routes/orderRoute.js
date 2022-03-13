const express = require('express');
const ordersController = require('../controllers/ordersController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();

const { checkoutSession, getOrders, cancelOrder } = ordersController;

router
  .route('/')
  .get(protectRoutes, getOrders)
  // .post(protectRoutes, checkoutSession)
  .delete(protectRoutes, cancelOrder);

router.get('/create-checkout-session/',protectRoutes, checkoutSession);
module.exports = router;
