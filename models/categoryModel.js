const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: false,
  },

  icon: {
    type: String,
  },

  color: {
    type: String,
  },
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
