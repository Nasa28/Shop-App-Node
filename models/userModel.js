const crypto = require('crypto')
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcrypt');

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

const User = mongoose.model('User', userSchema);

module.exports = User;
