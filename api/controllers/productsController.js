const Product = require('../models/productModel');
const catchAsync = require('../../utils/catchError');
const AppError = require('../../utils/AppError');

exports.allProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().select('-__v');

  res.status(200).json({
    count: products.length,
    status: 'Success',
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    status: 'Created',
    data: {
      product: newProduct,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id).select('-__v');
  if (!product) {
    return next(new AppError(`No product found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'Success',
    data: {
      product,
    },
  });
});

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!product) {
    return next(new AppError(`No product found with id ${req.params.id}`, 404));
  }

  res.status(200).json({
    status: 'Updated',
    data: {
      product,
    },
  });
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndDelete(req.params.id);

  if (!product) {
    return next(
      new AppError(`Product with id ${req.params.id} does not exist`, 404),
    );
  }
  res.status(201).json({
    status: 'Product deleted',
  });
});
