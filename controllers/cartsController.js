const Cart = require('../models/cartModel');

const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');

exports.allCart = asyncWrapper(async (req, res, next) => {
  const carts = await Cart.find().select('-__v').populate('product', 'name');

  res.status(200).json({
    count: carts.length,
    status: 'Success',
    data: {
      carts,
    },
  });
});

exports.getCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findById(req.params.id)
    .populate('product user')
    .select('-__v');

  if (!cart) {
    return next(new ErrorMsg('This cart does not exist', 404));
  }

  cart.__v = undefined;
  res.status(200).json({
    status: 'Success',
    data: {
      cart,
    },
  });
});

exports.addToCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.product.id;
  if (!req.body.user) req.body.user = req.user.id;

  // Prevent Users from add the same product twice
  // const check = await Cart.findOne({ product: req.body.product });
  // if (check) return next(new ErrorMsg('Product already added to cart', 400));
  const newcart = await Cart.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      cart: newcart,
    },
  });
});

exports.updateCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!cart) {
    return next(new ErrorMsg('This cart does not exist', 404));
  }

  res.status(200).json({
    status: 'cart Updated',
    data: {
      cart,
    },
  });
});

exports.deleteCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findByIdAndDelete(req.params.id);

  if (!cart) {
    return next(new ErrorMsg('This cart does not exist', 404));
  }

  res.status(204).json({
    status: 'cart Updated',
  });
});
