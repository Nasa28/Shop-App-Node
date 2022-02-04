const Product = require('../models/productModel');
const catchAsync = require('../../utils/catchError');

exports.allProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    result: products.length,
    status: 'Success',
    data: {
      products,
    },
  });
});
