const mongoose = require('mongoose');
const slugify = require('slugify');
const validator = require('validator');

const productSchema = mongoose.Schema(
  {
    slug: String,
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      maxlength: [50, 'Product name cannot be more than 50 character'],
      minlength: [3, 'Product name cannot be less than 3 characters'],
    },

    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },

    images: [String],

    description: {
      type: String,
      required: [true, 'A product must have a description'],
      trim: true,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
  },

  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
