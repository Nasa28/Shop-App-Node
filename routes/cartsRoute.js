const express = require('express');
const cartsController = require('../controllers/cartsController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();

const { addToCart, getCartItems, deleteItemFromCart, clearMyCart } =
  cartsController;

router
  .route('/')
  .get(protectRoutes, getCartItems)
  .post(protectRoutes, addToCart)
  .delete(protectRoutes, clearMyCart);

router.route('/remove-item').delete(protectRoutes, deleteItemFromCart);

module.exports = router;
