const express = require('express');

const router = express.Router();

const productsController = require('../controllers/productsController');
const { allProducts, createProduct, getProduct, updateProduct, deleteProduct } =
  productsController;

router.route('/').get(allProducts).post(createProduct);

router.route('/:id').get(getProduct).patch(updateProduct).delete(deleteProduct);

module.exports = router;
