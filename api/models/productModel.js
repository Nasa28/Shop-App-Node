const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = new mongoose.Schema({
  slug: String,
  name: {
    type: String,
    required: [true, 'A Product must have a name'],
    trim: true,
    maxlength: [30, 'Product name must not be more than 30 characters'],
    minlength: [5, 'Product name must be more than 10 characters'],
  },

  price: {
    type: Number,
    required: [true, 'A product must have a price'],
  },

  description: {
    type: String,
    trim: true,
    required: [true, 'Product must have a description'],
  },

  images: [String],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name + Math.random(50), { lower: true });
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
