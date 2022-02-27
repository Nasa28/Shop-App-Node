const crypto = require('crypto');

const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Email = require('../utils/email');

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

const sendTokens = (user, res, statusCode) => {
  const token = signToken(user._id);
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res.cookie('jwt', token, cookieOptions);

  user.password = undefined;
  user.__v = undefined;
  res.status(statusCode).json({
    token,
    status: 'Success',
    user,
  });
};

exports.signUp = asyncWrapper(async (req, res, next) => {
  const newUser = await User.create({
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    email: req.body.email,
    password: req.body.password,
    passwordConfirm: req.body.passwordConfirm,
    // passwordChangedAt: req.body.passwordChangedAt,
  });

  const url = `${req.protocol}://${req.get('host')}/api/v1/products`;

  await new Email(newUser, url).sendWelcome();
  newUser.active = undefined;
  sendTokens(newUser, res, 201);
});

exports.login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new ErrorMsg('Please enter your email and password', 400));
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    return next(new ErrorMsg('Invalid Email or Password', 401));
  }

  sendTokens(user, res, 201);
});

exports.protectRoutes = asyncWrapper(async (req, res, next) => {
  // 1) Get the Token and check presence
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new ErrorMsg('You are not logged in. Please, log in to proceed!', 401),
    );
  }
  // 2) Verify Token
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(new ErrorMsg('You are not logged in.Please,log in.', 401));
  }
  // 4) Check if user changed password after Token was generated
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new ErrorMsg('User recently changed password! Please log in again.', 401),
    );
  }

  // Grant Access to the protected Route
  req.user = currentUser;
  next();
});
// Middleware for Admin Access
exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      next(
        new ErrorMsg('You do not have permission to perform this action', 403),
      );
    }
    next();
  };
};

exports.forgotPassword = asyncWrapper(async (req, res, next) => {
  // 1) Get user based on the posted email.

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    next(new ErrorMsg('There is no user with the email address', 404));
  }
  // 2)  Generate a random reset token

  const resetToken = user.CreatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to the users email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host',
    )}/api/v1/resetPassword/${resetToken}`;

    await new Email(user, resetURL).sendPasswordReset();

    res.status(200).json({
      status: 'Sucess',
      message: 'Token sent to the email',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });
    return next(
      new ErrorMsg(
        'There was an error sending the email. Please, try again later',
        500,
      ),
    );
  }
});

exports.resetPassword = asyncWrapper(async (req, res, next) => {
  // 1) Get user based on token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  // 2) If token has not expired and there is a user, set the new password
  if (!user) {
    return next(new Error('Token is invalid or has expired', 400));
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.role = undefined;
  passwordChangedAt = undefined;
  await user.save();
  // 3) Update the changedPasswordAt property for the current user
  const url = `${req.protocol}://${req.get('host')}/api/v1/products`;

  // 4) Log the user in
  sendTokens(user, res, 200);
  await new Email(user, url).sendPasswordResetSuccess();
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');

  // 2) Check if POSTED current password is correct
  if (!(await user.comparePassword(req.body.passwordCurrent, user.password))) {
    return next(new ErrorMsg('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();
  // User.findByIdAndUpdate will NOT work as intended!

  // 4) Log user in, send JWT
  sendTokens(user, res, 200);
});
