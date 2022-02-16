const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },

  products: [
    {
      productId: {
        type: String,
      },

      quantity: {
        type: Number,
        default: 1,
      },
    },
  ],
  
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
