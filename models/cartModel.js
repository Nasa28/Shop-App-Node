const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    quantity: {
      type: Number,
      required: true,
      default: 1,
    },

    product: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Product',
      },
    ],

    user: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Cart must belong to a User'],
    },

    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'id',
  });
  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: '-__v -passwordChangedAt -dealer',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
