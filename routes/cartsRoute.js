const express = require('express');
const cartsController = require('../controllers/cartsController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();

const { getCartItems, addToCart, deleteItemFromCart } = cartsController;

router
  .route('/')
  .get(protectRoutes, getCartItems)
  .post(protectRoutes, addToCart)
  .delete(protectRoutes, deleteItemFromCart);

module.exports = router;
