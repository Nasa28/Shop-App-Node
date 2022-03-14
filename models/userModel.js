const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: [true, 'User must have a name'],
  },
  lastName: {
    type: String,
    required: [true, 'User must have a name'],
  },

  email: {
    type: String,
    required: [true, 'User must have an email address'],
    unique: true,
    lowercase: true,
    match: [
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
      'Please provide a valid email',
    ],
    validate: [validator.isEmail, 'Please, enter a valid email'],
  },
  role: {
    enum: ['user', 'dealer', 'admin'],
    type: String,
    default: 'user',
  },
  password: {
    type: String,
    required: [true, 'Please, enter your  password'],
    minlength: 8,
    select: false,
  },

  passwordConfirm: {
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

// HASH OR ENCRYPT PASSWORD MIDDLEWARE

userSchema.pre('save', async function (next) {
  //run function if password was modified
  if (!this.isModified('password')) return next();
  // Hash password
  this.password = await bcrypt.hash(this.password, 12);

  //delete the passwordComfirm field in the data base
  this.passwordConfirm = undefined;
});

// MIDDLEWARE FOR PASSWORD CHANGED AT
userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;

  next();
});

// Compare user inputed password and correct password
userSchema.methods.comparePassword = async function (
  candidatePassword,
  userPassword,
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

// CHECK IF USER CHANGED PASSWORD

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10,
    );

    // True Means Changed Password

    return JWTTimestamp < changedTimestamp;
  }

  // False means NOT changed
  return false;
};

userSchema.methods.CreatePasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');
  console.log({ resetToken }, this.passwordResetToken);
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;
  return resetToken;
};

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

cookieOptions = {
  expires: new Date(
    Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000,
  ),
  httpOnly: true,
};

userSchema.methods.createToken = function (user, res, statusCode) {
  const token = signToken(this._id);
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  this.password = undefined;
  this.__v = undefined;
  res.status(statusCode).json({
    token,
    status: 'Success',
    user,
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;
