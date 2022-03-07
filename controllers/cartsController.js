const Cart = require('../models/cartModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');

exports.getCartItems = asyncWrapper(async (req, res, next) => {
  const carts = await Cart.find({ user: req.user.id }).select('-__v');

  res.status(200).json({
    count: carts.length,
    status: 'Success',

    carts,
  });
});

// exports.addToCart = asyncWrapper(async (req, res, next) => {
//   if (!req.body.product) req.body.product = req.product.id;
//   if (!req.body.user) req.body.user = req.user.id;

//   let cart = await Cart.findOne({ user: req.user.id });
//   const cartItemids = await Cart.find({ product: req.body.product });

//   if (cartItemids.length !== 0) {
//     const newQuantity = (cartItemids[0].quantity += req.body.quantity || 1);

//     const cart = await Cart.findOneAndUpdate(
//       { product: req.body.product },
//       { quantity: newQuantity },
//       {
//         new: true,
//         runValidators: true,
//       },
//     );

//     res.status(200).json({
//       status: 'Success',
//       data: {
//         newQuantity: cart.quantity,
//       },
//     });
//   }
//   if (cartItemids.length === 0 && cart === null) {
//     // const newcart = await Cart.create(req.body);

//     const newCart = await Cart.create({
//       product: req.body.product,
//       quantity: req.body.quantity,
//       user: req.body.user,
//     });

//     res.status(200).json({
//       status: 'Product Added to cart',
//       data: {
//         cart: newCart,
//       },
//     });
//   } else if (cartItemids.length === 0) {
//     cart.product.push(req.body.product);
//     await cart.save();

//     res.status(200).json({
//       status: 'New Product Added to cart',
//     });
//   }
// });

exports.deleteItemFromCart = asyncWrapper(async (req, res, next) => {
  if (!req.body.user) req.body.user = req.user.id;

  const cart = await Cart.findOneAndRemove({
    $and: [{ _id: req.body.id }, { user: req.user._id }],
  });
  if (!cart) {
    return next(new ErrorMsg('You do not have this product in your cart', 404));
  }

  res.status(204).json({
    status: 'Product removed from cart',
  });
});

exports.addToCart = asyncWrapper(async (req, res, next) => {});
