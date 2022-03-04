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
      status: 'Product Added to cart',
      // data: {
      //   cart: newcart,
      // },
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

exports.deleteItemFromCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const cart = await Cart.findOneAndDelete({
    $and: [{ product: req.body.product }, { user: req.user._id }],
  });

  if (!cart) {
    return next(new ErrorMsg('This Item does not exist', 404));
  }

  res.status(204).json({
    status: 'Product removed from cart',
  });
});
