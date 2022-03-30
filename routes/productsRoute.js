const express = require('express');
const upload = require('../utils/multer');

const router = express.Router();
const auth = require('../controllers/authController');
const productsController = require('../controllers/productsController');

const {
  allProducts,
  createProduct,
  getProduct,
  updateProduct,
  deleteProduct,
  getMyProducts,
  featuredProducts,
  hotProducts,
} = productsController;

router.get('/featured-products', auth.protectRoutes, featuredProducts);
router.get('/hot-products', hotProducts);

router.route('/').get(allProducts).post(
  auth.protectRoutes,
  auth.adminAccess('admin', 'dealer'),

  upload,
  createProduct
);

router.get(
  '/myProducts',
  auth.protectRoutes,
  auth.adminAccess('dealer', 'admin'),
  getMyProducts
);
router
  .route('/:id')
  .get(getProduct)
  .patch(auth.protectRoutes, auth.adminAccess('dealer'), updateProduct)
  .delete(auth.protectRoutes, auth.adminAccess('dealer'), deleteProduct);

module.exports = router;
