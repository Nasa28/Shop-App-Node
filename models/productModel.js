const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
  slug: {
    type: String,
    unique: true,
    text: true,
    index: true,
    lowercase: true,
  },
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
    // required: [true, 'Please, select a category'],
  },

  // subCategory: {
  //   type: String,
  //   required: [true, 'SubCategory should not be blank'],
  // },
  category: {
    type: mongoose.Schema.ObjectId,
    ref: 'Category',
  },

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
  sold: {
    type: Number,
    default: 0,
  },
  images: [String],

  size: {
    type: String,
  },
  shipping: {
    type: String,
    enum: ['Yes', 'No'],
  },
  color: {
    type: String,
    enum: [
      'Red',
      'Black',
      'Brown',
      'Silver',
      'Blue',
      'White',
      'pink',
      'orange',
    ],
  },
  dealer: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
  },

  // rating: [
  //   {
  //     star: Number,
  //     postedBy: {
  //       type: mongoose.Schema.ObjectId,
  //       ref: 'User',
  //     },
  //   },
  // ],

  createdAt: {
    type: Date,
    default: Date.now(),
    select: false,
  },
});

// productSchema.set('toJSON', {
//   virtuals: true,
// });

productSchema.pre('save', function (next) {
  this.slug = slugify(
    `${this.title}-${(Math.random() + 1).toString(36).substring(2)}`,
    { lower: true }
  );

  next();
});

productSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'dealer',
    select: '-_id -email -__v -role',
  });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
