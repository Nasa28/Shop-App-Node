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

exports.clearMyCart = asyncWrapper(async (req, res, next) => {
  const cart = await Cart.findOneAndRemove({
    orderedBy: req.user.id,
  });

  if (!cart) {
    return next(new ErrorMsg('You do not have this product in your cart', 404));
  }

  res.status(204).json({
    status: 'Product removed from cart',
  });
});

exports.deleteItemFromCart = asyncWrapper(async (req, res, next) => {
  let cart = await Cart.findOne({ orderedBy: req.user.id });
  
  const getIndex = cart.items.findIndex(
    (ele) => ele.products[0].id === req.body.id,
  );
  if (getIndex > -1) {
    let product = cart.items[getIndex];
    cart.cartTotal -= product.quantity * product.price;
    cart.items.splice(getIndex, 1);
    await cart.save();
  } else {
    throw new ErrorMsg('You do not have this product in your cart', 404);
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
      cart.items.push({ products, quantity, price });
    }

    cart.cartTotal += price * (quantity || 1);
    cart = await cart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  } else {
    //Check if no cart exists,then create one
    let newCart = await new Cart({
      products,
      orderedBy,
      quantity,
    });

    newCart.cartTotal += price * (quantity || 1);
    newCart.items.push({ products, quantity, price });
    newCart = await newCart.save();
    res.status(201).json({ status: 'Product Added to Cart', quantity });
  }
});
