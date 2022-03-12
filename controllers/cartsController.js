const Cart = require('../models/cartModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Product = require('../models/productModel');
exports.getCartItems = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOne({ orderedBy: req.user.id }).select(
    '-__v',
  );

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
  const { products, quantity, orderedBy } = req.body;

  let cart = await Cart.findOne({ orderedBy: req.user.id });
  let product = await Product.findOne({ id: products });
  if (!product) {
    return next(new ErrorMsg('product not found', 404));
  }
  const price = product.price;
  if (cart) {
    let productIndex = cart.items.findIndex(
      (ele) => ele.products[0].id === products,
    );
    if (productIndex > -1) {
      let product = cart.items[productIndex];
      product.quantity += quantity || 1;
      cart.items[productIndex] = product;
    } else {
      cart.items.push({ products, quantity });
    }
    // Check if product exists or not

    cart.cartTotal += price * (quantity || 1);
    cart = await cart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  } else {
    //Check if no cart exists, create one
    let newCart = await new Cart({
      products,
      orderedBy,
      quantity,
    });

    newCart.cartTotal += price * (quantity || 1);
    newCart.items.push({ products, quantity });
    newCart = await newCart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  }
});
