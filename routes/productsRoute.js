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
  getMyProducts,
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

router.get(
  '/myProducts',
  auth.protectRoutes,
  auth.restrictTo('dealer'),
  getMyProducts,
);
router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
