const Cart = require('../models/cartModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Product = require('../models/productModel');
exports.getCartItems = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOne({ orderedBy: req.user.id }).select('-__v');

  if (!cart) {
    res.status(404).json({
      status: 'Your cart is empty',
    });
  }

  res.status(200).json({
    count: cart.items.length,
    status: 'Success',

    cart,
  });
});

exports.deleteItemFromCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const cart = await Cart.findOneAndRemove({
    $and: [{ product: req.body.id }, { orderedBy: req.user.id }],
  });

  if (!cart) {
    return next(new ErrorMsg('You do not have this product in your cart', 404));
  }

  res.status(204).json({
    status: 'Product removed from cart',
  });
});

exports.addToCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.orderedBy) req.body.orderedBy = req.user.id;
  const { product, quantity, orderedBy } = req.body;

  let cart = await Cart.findOne({ orderedBy: req.user.id });
  let item = await Product.findOne({ _id: product });
  if (!item) {
    return next(new ErrorMsg('product not found', 404));
  }
  const price = item.price;
  if (cart) {
    // Check if cart exists for the user
    let productIndex = cart.items.findIndex((ele) => ele.product == product);
    // Check if product exists or not

    if (productIndex > -1) {
      let item = cart.items[productIndex];
      item.quantity += quantity;
      cart.items[productIndex] = item;
    } else {
      cart.items.push({ product });
    }
    cart.cartTotal += quantity * price;
    cart = await cart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  } else {
    //Check if no cart exists, create one
    let newCart = await Cart.create({
      product,
      orderedBy,
      quantity,
    });

    newCart.cartTotal += quantity * price;
    newCart.items.push({ product, quantity });
    newCart = await newCart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  }
});
