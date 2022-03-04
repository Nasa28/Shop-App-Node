const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    slug: String,
    title: {
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

    productCategory: {
      type: String,
      enum: ['computing', 'electronic', 'fashion', 'gaming', 'automobile'],
      required: [true, 'Please, select a category'],
    },

    subCategory: {
      type: String,
      required: [true, 'SubCategory should not be blank'],
    },
    // category: {
    //   type: mongoose.Schema.ObjectId,
    //   ref: 'Category',
    // },

    image: {
      type: String,
    },

    stockBalance: {
      type: Number,
      min: 0,
      max: 200,
    },

    isFeatured: {
      type: Boolean,
      default: false,
    },

    images: [String],

    size: {
      type: String,
    },

    color: {
      type: String,
    },
    dealer: {
      type: mongoose.Schema.ObjectId,
      ref: 'User',
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

productSchema.virtual('id', function () {
  return this._id.toHexString();
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.title + Math.random(50), { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dealer',
    select: '-__v -passwordChangedAt -role',
  });
  next();
});
const Product = mongoose.model('Product', productSchema);

module.exports = Product;
