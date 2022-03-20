const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  cart: {
    type: Object,
    required: [true, 'An order must have a cart'],
  },

  shippingAddress: {
    type: String,
    required: [true, 'Your address is needed to complete the order'],
  },

  paymentId: {
    type: String,
    required: true,
  },
  orderedBy: {
    type: String,
    required: true,
  },

  email: {
    type: String,
    required: true,
  },

  state: {
    type: String,
    // required: [true, 'Your State is needed to complete the order'],
  },

  city: {
    type: String,
    // required: [true, 'Your City is needed to complete the order'],
  },

  country: {
    type: String,
    // required: [true, 'Your Country is needed to complete the order'],
  },
  phoneNumber: {
    type: String,
    required: [true, 'Your Phone number is needed to complete the order'],
  },

  status: {
    type: String,
    required: true,
    default: 'Pending',
  },

  totalAmount: {
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
