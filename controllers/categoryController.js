const Category = require('../models/categoryModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const slugify = require('slugify');

exports.listCategories = asyncWrapper(async (req, res, next) => {
  const categories = await Category.find().sort({ createdAt: -1 });

  res.status(200).json({
    count: categories.length,
    status: 'Success',
    data: {
      categories,
    },
  });
});
exports.createCategory = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const newCategory = await Category.create({
    name,
  });
  res.status(200).json({
    status: 'success',
    data: {
      category: newCategory,
    },
  });
});

exports.updateCategory = asyncWrapper(async (req, res, next) => {
  const { name } = req.body;
  const slug = slugify(
    name + '-' + (Math.random() + 1).toString(36).substring(2),
  );
  const category = await Category.findOneAndUpdate(
    { slug: req.params.slug },
    {
      name,
      slug,
    },
    {
      new: true,
      runValidators: true,
    },
  );

  if (!category) {
    return next(
      new ErrorMsg('The category you are looking for does not exist'),
    );
  }
  res.status(200).json({
    status: 'success',
    data: {
      category,
    },
  });
});
exports.deleteCategory = asyncWrapper(async (req, res, next) => {
  await Category.findOneAndDelete({ slug: req.params.slug });
  res.status(201).json({
    status: 'Deleted',
  });
});
