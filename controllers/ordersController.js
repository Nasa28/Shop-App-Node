const Order = require('../models/orderModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Cart = require('../models/cartModel');
const stripeAPI = require('../stripe');
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

exports.checkoutSession = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;
  if (!req.body.email) req.body.email = req.user.email;
  const cart = await Cart.findOne({ orderedBy: req.user.id });
  const session = await stripeAPI.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `${req.protocol}://${req.get('host')}/api/v1/products`,
    cancel_url: `${req.protocol}://${req.get('host')}/api/v1/products`,
    customer_email: req.body.email,
    client_reference_id: req.params.id,
    shipping_address_collection: { allowed_countries: ['US', 'GB'] },
    line_items: [
      {
        name: `${req.user.firstName}'s Order`,
        // description: cart.items.products[0].description,
        images: [
          'http://res.cloudinary.com/dtbhikp70/image/upload/v1645684370/Hotels/2022-02-24T06_32_49_hpk2iq.png',
        ],
        amount: cart.cartTotal * 100,
        currency: 'usd',
        quantity: 1,
        price: cart.price,
      },
    ],
  });

  if (session) {
    const newOrder = await Order.create({
      cart,
      email: req.body.email,
      orderedBy: `${req.user.firstName} ${req.user.lastName} `,
      shippingAddress1: req.body.shippingAddress,
      state: req.body.state,
      zip: req.body.zip,
      country: req.body.country,
      phoneNumber: req.body.phone,
      paymentId: session.id,
      totalAmount: session.amount_total,
    });
    res.status(200).json({
      sessionId: session.id,
      order: newOrder,
    });
  }
});
