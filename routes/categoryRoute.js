const express = require('express');
const CategoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');

const { protectRoutes, adminAccess } = authController;
const router = express.Router();
const { createCategory, deleteCategory, listCategories, updateCategory } =
  CategoryController;

router
  .route('/')
  .get(protectRoutes, adminAccess('dealer'), listCategories)
  .post(protectRoutes, adminAccess('admin'), createCategory);
router
  .route('/:slug')
  .get()
  .patch(protectRoutes, adminAccess('admin'), updateCategory)
  .delete(protectRoutes, adminAccess('admin'), deleteCategory);

module.exports = router;
