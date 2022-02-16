const express = require('express');
const router = express.Router();
const auth = require('../controllers/authController');
const productsController = require('../controllers/productsController');
const {
  uploadProductImages,
  allProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
} = productsController;

router
  .route('/')
  .get(allProducts)
  .post(
    auth.protectRoutes,
    auth.restrictTo('dealer'),
    uploadProductImages,
    createProduct,
  );

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
