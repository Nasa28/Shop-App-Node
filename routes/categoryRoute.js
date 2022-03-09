const express = require('express');
const CategoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();
const { createCategory, deleteCategory, listCategories, updateCategory } =
  CategoryController;

router
  .route('/')
  .get(protectRoutes, listCategories)
  .post(protectRoutes, createCategory);
router
  .route('/:slug')
  .get()
  .patch(protectRoutes, updateCategory)
  .delete(protectRoutes, deleteCategory);

module.exports = router;
