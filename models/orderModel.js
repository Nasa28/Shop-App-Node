const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cart: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Cart',
    },
  ],

  shippingAddress1: {
    type: String,
  },

  shippingAddress2: {
    type: String,
  },

  state: {
    type: String,
  },

  city: {
    type: String,
  },

  zip: {
    type: String,
  },

  country: {
    type: String,
  },
  phone: {
    type: String,
  },

  status: {
    type: String,
    required: true,
    default: 'Pending',
  },

  totalPrice: {
    type: Number,
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  dateOrdered: {
    type: Date,
    date: Date.now(),
  },
});

orderSchema.virtual('id', function () {
  return this._id.toHexString();
});
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
