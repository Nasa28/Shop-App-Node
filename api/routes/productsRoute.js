const express = require('express');
const router = express.Router();

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
  .post(uploadProductImages, createProduct);

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
