const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [3, 'Name is too short'],
      maxlength: [24, 'Name is too long'],
    },
    slug: {
      type: String,
      lowercase: true,
      unique: true,
      index: true,
    },
  },
  { timestamps: true },
);

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
