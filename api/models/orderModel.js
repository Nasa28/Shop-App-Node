const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  quantity: {
    type: Number,
    default: 1,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },

  product: {
    type: mongoose.Schema.ObjectId,
    ref: 'Product',
    required: [true, 'Order must belong to a Product'],
  },
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
