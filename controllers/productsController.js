const fs = require('fs');
const Product = require('../models/productModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const upload = require('../utils/multer');
const cloudinary = require('../utils/cloud');

exports.uploadProductImages = upload.array('images', 3);

exports.allProducts = asyncWrapper(async (req, res, next) => {
  const products = await Product.find().sort('-createdAt');

  res.status(200).json({
    count: products.length,
    status: 'Success',
    data: {
      products,
    },
  });
});

exports.createProduct = asyncWrapper(async (req, res, next) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  if (!req.files) {
    throw new ErrorMsg('You must upload a minimum of one image');
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

exports.getProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    throw new ErrorMsg(`No product found with id ${req.params.id}`, 404);
  }
  res.status(200).json({
    status: 'Success',
    data: {
      product,
    },
  });
});

exports.updateProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findOneAndUpdate(
    { $and: [{ _id: req.params.id }, { dealer: req.user.id }] },
    req.body,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!product) {
    return next(
      new ErrorMsg(`You are not authorized to perform this action`, 404),
    );
  }
  res.status(200).json({
    status: 'Success',
    data: {
      product,
    },
  });
});

exports.deleteProduct = asyncWrapper(async (req, res, next) => {
  const product = await Product.findOneAndDelete({
    $and: [{ _id: req.params.id }, { dealer: req.user.id }],
  });
  if (!product) {
    return next(
      new ErrorMsg(`You are not authorized to perform this action`, 404),
    );
  }
  res.status(201).json({
    status: 'Product deleted',
  });
});

exports.getMyProducts = asyncWrapper(async (req, res, next) => {
  const myProducts = await Product.find({ dealer: req.user.id });

  res.status(200).json({
    count: myProducts.length,
    status: 'Success',
    data: {
      myProducts,
    },
  });
});
