const mongoose = require('mongoose');
const validator = require('validator');
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have a name'],
  },
  lastName: {
    type: String,
    required: [true, 'User must have a name'],
  },

  userName: {
    type: String,
    required: [true, 'User must have a name'],
    minlength: [4, 'Username must not be less than 4 character'],
    maxlength: [12, 'Username must not be more than 12 characters'],
    // unique: true,
  },

  email: {
    type: String,
    required: [true, 'User must have an email address'],
    // unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Please, enter a valid email'],
  },
  role: {
    enum: ['user', 'seller', 'admin'],
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please, enter your  password'],
    minlength: 8,
    select: false,
  },

  passwordComfirm: {
    type: String,
    required: [true, 'Please, enter your  password'],
    validate: {
      //This works only on CREATE and SAVE!!
      validator: function (ele) {
        return ele === this.password;
      },
      message: 'Password and password comfirmation must match',
    },
  },
  passwordChangedAt: Date,
  passwordResetToken: String,
  passwordResetExpires: Date,
  active: {
    type: Boolean,
    default: true,
    select: false,
  },
});

const User = mongoose.model('User', userSchema);
