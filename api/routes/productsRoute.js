const express = require('express');

const router = express.Router();

const productsController = require('../controllers/productsController');
const { allProducts, createProduct, getProduct } = productsController;

router.route('/').get(allProducts).post(createProduct);

router.get('/:productId', getProduct);

// router.patch('/:productId', (req, res, next) => {
//   res.status(200).json({
//     message: 'Updated product succesfully',
//   });
// });

// router.delete('/:productId', (req, res, next) => {
//   res.status(200).json({
//     message: 'Deleted product succesfully',
//   });
// });

module.exports = router;
