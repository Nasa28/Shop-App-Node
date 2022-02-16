const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 1,
  },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order must belong to a Product'],
  },

  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: [true, 'User must belong to a Product'],
  },

  amount: {
    type: Number,
    required: [true, 'Order amount cannot be nil'],
  },
  address: {
    type: Object,
    required: true,
  },
  status: {
    type: String,
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

orderSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'product',
    select: '-__v',
  });
  next();
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
