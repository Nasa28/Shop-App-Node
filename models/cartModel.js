const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 1,
  },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Cart must belong to a Product'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'Cart must belong to a Product'],
  },

   createdAt: {
    type: Date,
    default: Date.now,
  },
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: '-__v',
  });
  next();
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
