const Cart = require('../models/cartModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Product = require('../models/productModel');

exports.getCartItems = asyncWrapper(async (req, res, next) => {
  const carts = await Cart.find({ user: req.user.id });

  res.status(200).json({
    count: carts.length,
    status: 'Success',
    data: {
      carts,
    },
  });
});

exports.addToCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.product.id;
  if (!req.body.user) req.body.user = req.user.id;
  const cartItemids = await Cart.find({ product: req.body.product });
  if (cartItemids.length === 0) {
    const newcart = await Cart.create(req.body);

    res.status(200).json({
      status: 'Success',
      data: {
        cart: newcart,
      },
    });
  } else {
    const newQuantity = (cartItemids[0].quantity += req.body.quantity);

    const cart = await Cart.findOneAndUpdate(
      { product: req.body.product },
      { quantity: newQuantity },
      {
        new: true,
        runValidators: true,
      },
    );

    res.status(200).json({
      status: 'Success',
      data: {
        newQuantity: cart.quantity,
      },
    });
  }
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
