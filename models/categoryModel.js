const mongoose = require('mongoose');
const slugify = require('slugify');

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

categorySchema.pre('save', function (next) {
  this.slug = slugify(
    this.name + '-' + (Math.random() + 1).toString(36).substring(2),
    { lower: true },
  );
  this.name = this.name.toUpperCase();
  next();
});
const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
