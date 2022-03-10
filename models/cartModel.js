const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema(
  {
    items: [
      {
        product: [
          {
            type: mongoose.Schema.ObjectId,
            ref: 'Product',
            required: [true, 'Cart must be owned by a user'],
          },
        ],

        title: String,
        quantity: {
          type: Number,
          required: true,
          min: [1, 'Quantity can not be less then 1.'],
          default: 1,
        },
        price: Number,
      },
    ],
    cartTotal: {
      type: Number,
      required: true,
      default: 0,
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
  },
);

cartSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'items.product',
    select: '-__v -passwordChangedAt -dealer',
  });
  next();
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
