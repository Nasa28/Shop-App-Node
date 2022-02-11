const fs = require('fs');
const Product = require('../models/productModel');
const catchAsync = require('../utils/catchError');
const AppError = require('../utils/AppError');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloud');

exports.uploadProductImages = upload.array('images', 3);

exports.allProducts = catchAsync(async (req, res, next) => {
  const products = await Product.find();

  res.status(200).json({
    count: products.length,
    status: 'Success',
    data: {
      products,
    },
  });
});

exports.createProduct = catchAsync(async (req, res, next) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  }
  if (req.files) req.body.images = urls;

  const newProduct = await Product.create(req.body);
  newProduct.__v = undefined;
  res.status(200).json({
    status: 'Created',
    data: {
      product: newProduct,
    },
  });
});

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
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
