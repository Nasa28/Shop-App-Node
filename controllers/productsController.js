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
  if (!req.files) {
    return next(new AppError('You must upload a minimum of one image'));
  }

  const urls = [];
  const files = req.files;
  for (const file of files) {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  }
  req.body.images = urls;
  if (!req.body.dealer) req.body.dealer = req.user.id;

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
  const productToUpdate = await Product.findById(req.params.id);
  const createdBy = productToUpdate.dealer.id;
  if (createdBy !== req.user.id) {
    return next(
      new AppError('You are not authorized to perform this action', 403),
    );
  }

  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
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

exports.deleteProduct = catchAsync(async (req, res, next) => {
  const productToDelete = await Product.findById(req.params.id);
  const createdBy = productToDelete.dealer.id;
  if (createdBy !== req.user.id) {
    return next(
      new AppError('You are not authorized to perform this action', 403),
    );
  }
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

exports.getMyProducts = catchAsync(async (req, res, next) => {
  const myProducts = await Product.find({ dealer: req.user.id });

  res.status(200).json({
    count: myProducts.length,
    status: 'Success',
    data: {
      myProducts,
    },
  });
});
