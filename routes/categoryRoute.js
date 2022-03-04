const express = require('express');
const CategoryController = require('../controllers/categoryController');
const authController = require('../controllers/authController');
const { protectRoutes } = authController;
const router = express.Router();
const { createCategory, deleteCategory } = CategoryController;

router.route('/').get().post(protectRoutes, createCategory);
 router.route('/:id').get().patch().delete(protectRoutes, deleteCategory);

module.exports = router;
