const Product = require('../models/productModel');
const catchAsync = require('../../utils/catchError');

exports.allProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find().select('-__v');

  res.status(200).json({
    result: products.length,
    status: 'Success',
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  console.log(req.body);
  const newProduct = await Product.create(req.body);
  res.status(200).json({
    status: 'Created',
    data: {
      product: newProduct,
    },
  });
});
