const Order = require('../models/orderModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');

exports.getOrders = asyncWrapper(async (req, res, next) => {
  const orders = await Order.find({ user: req.user.id });

  res.status(200).json({
    count: carts.length,
    status: 'Success',
    data: {
      orders,
    },
  });
});

exports.placeOder = asyncWrapper(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.product.id;

  const newOrder = await Order.create({
    cart: req.body.cart,
    shippingAddress1: req.body.shippingAddress1,
    shippingAddress2: req.body.shippingAddress2,
    state: req.body.state,
    zip: req.body.zip,
    country: req.body.country,
    phoneNumber: req.body.phone,
    user: req.user.id,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      order: newOrder,
    },
  });
});

exports.cancelOrder = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const cart = await Order.findOneAndRemove({
    $and: [{ _id: req.body.id }, { user: req.user._id }],
  });
  if (!cart) {
    return next(new ErrorMsg('You do not have this product in your cart', 404));
  }

  res.status(204).json({
    status: 'Product removed from cart',
  });
});
