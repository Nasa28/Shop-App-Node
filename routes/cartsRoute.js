const express = require('express');
const cartsController = require('../controllers/cartsController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();

const { getCartItems, getCart, addToCart, updateCart, deleteCart } =
  cartsController;

router
  .route('/')
  .get(protectRoutes, getCartItems)
  .post(protectRoutes, addToCart);
router.route('/:id').get(getCart).patch(updateCart).delete(deleteCart);

module.exports = router;
