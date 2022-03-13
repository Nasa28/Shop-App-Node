const mongoose = require('mongoose');
const orderSchema = new mongoose.Schema({
  cart: {
    type: Object,
    required: true,
  },

  shippingAddress: {
    type: String,
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
  },

  city: {
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

// orderSchema.pre('save', async function (req, res, next) {
//   this.cart = await Cart.find();
//   next();
// });
const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
