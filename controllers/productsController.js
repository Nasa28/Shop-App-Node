const fs = require('fs');
const Product = require('../models/productModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const cloudinary = require('../utils/cloud');
const AppHelpers = require('../utils/appHelpers');

exports.allProducts = asyncWrapper(async (req, res, next) => {
  const helpers = new AppHelpers(Product.find({}), req.query)
    .filter()
    .sort()
    .limitField()
    .paginate();

  const products = await helpers.query;
  res.status(200).json({
    count: products.length,
    status: 'Success',
    products,
  });
});

exports.createProduct = asyncWrapper(async (req, res, next) => {
  const uploader = async (path) => await cloudinary.uploads(path, 'Images');
  const files = await req.files;
  if (!files) {
    throw new ErrorMsg('You must upload a minimum of one image');
  }

  const urls = [];
  const imageList = files.map(async (file) => {
    const { path } = file;
    const newPath = await uploader(path);
    urls.push(newPath.url);
    fs.unlinkSync(path);
  });

  await Promise.all(imageList);

  req.body.images = urls;
  if (!req.body.dealer) req.body.dealer = req.user.id;

  const newProduct = await Product.create(req.body);
  newProduct.__v = undefined;

  res.status(200).json({
    status: 'Product created',
    // data: {
    //   product: newProduct,
    // },
  });
});

exports.getProduct = asyncWrapper(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug });
  if (!product) {
    throw new ErrorMsg(`No product found with slug ${req.params.slug}`, 404);
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
    }
  );

  if (!product) {
    return next(
      new ErrorMsg(`You are not authorized to perform this action`, 404)
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
      new ErrorMsg(`You are not authorized to perform this action`, 404)
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

exports.featuredProducts = asyncWrapper(async (req, res, next) => {
  const featured = await Product.find({ isFeatured: true });
  if (!featured) {
    res.status(404).json({
      status: 'There are no featured products',
    });
  }

  res.status(200).json({
    count: featured.length,
    status: 'success',
    data: {
      featured,
    },
  });
});

exports.hotProducts = asyncWrapper(async (req, res, next) => {
  const hotestProducts = await Product.find().where('sold').gt(10);
  if (!hotestProducts) {
    res.status(404).json({
      status: 'There are no Hot products',
    });
  }

  res.status(200).json({
    count: hotestProducts.length,
    status: 'success',
    data: {
      hotestProducts,
    },
  });
});
