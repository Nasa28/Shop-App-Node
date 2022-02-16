const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
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
    default: Date.now(),
    select: false,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
