const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        products: [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Cart must have a product'],
          },
        ],

        quantity: {
          type: Number,
          default: 1,
          required: true,
          min: [1, 'Quantity can not be less then 1.'],
        },

        price: Number,
      },
    ],

    cartTotal: {
      type: Number,
      required: true,
      default: 0,
    },

    itemCount: {
      type: Number,
      required: true,
      default: 1,
    },
    orderedBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
      required: [true, 'Cart must be owned by a user'],
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.products',
    select: '_id title price description images',
  });
  next();
});

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'orderedBy',
    select: 'firstName lastName',
  });
  next();
});
const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
