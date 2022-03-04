const Category = require('../models/categoryModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');

exports.createCategory = asyncWrapper(async (req, res, next) => {
  const newCategory = await Category.create({
    name: req.body.name,
    icon: req.body.icon,
    color: req.body.color,
  });
  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

exports.deleteCategory = asyncWrapper(async (req, res, next) => {
  const category = await Category.findByIdAndDelete(req.params.id);

  res.status(201).json({
    status: 'Deleted',
  });
});
