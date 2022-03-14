const crypto = require('crypto');
const jwt = require('jsonwebtoken');

const { promisify } = require('util');
const User = require('../models/userModel');
const asyncWrapper = require('../utils/asyncWrapper');
const ErrorMsg = require('../utils/ErrorMsg');
const Email = require('../utils/email');

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
  newUser.createToken(
    { name: `${newUser.firstName} ${newUser.lastName}` },
    res,
    201
  );
});

exports.login = asyncWrapper(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    throw new ErrorMsg('Please enter your email and password', 400);
  }

  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.comparePassword(password, user.password))) {
    throw new ErrorMsg('Invalid Email or Password', 401);
  }

  user.createToken(user, res, 201);
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
    throw new ErrorMsg(
      'You are not logged in. Please, log in to proceed!',
      401
    );
  }
  // 2) Verify Token
  const payload = await promisify(jwt.verify)(token, process.env.JWT_SECRET);

  // 3) Check if user still exist
  const currentUser = await User.findById(payload.id);
  if (!currentUser) {
    throw new ErrorMsg('You are not logged in.Please,log in.', 401);
  }
  // 4) Check if user changed password after Token was generated
  if (currentUser.changedPasswordAfter(payload.iat)) {
    throw new ErrorMsg(
      'You recently changed your password! Please log in again.',
      401
    );
  }

  // Grant Access to the protected Route
  req.user = currentUser;
  next();
});
// Middleware for Admin Access
exports.adminAccess =
  (...roles) =>
  (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new ErrorMsg(
        'You do not have permission to perform this action',
        403
      );
    }
    next();
  };

exports.forgotPassword = asyncWrapper(async (req, res) => {
  // 1) Get user based on the posted email.

  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    throw new ErrorMsg('There is no user with this email address', 404);
  }
  // 2)  Generate a random reset token

  const resetToken = user.CreatePasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // 3) Send it to the users email

  try {
    const resetURL = `${req.protocol}://${req.get(
      'host'
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

    throw new ErrorMsg(
      'There was an error sending the email. Please, try again later',
      500
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
    throw new Error('Token is invalid or has expired', 400);
  }

  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;

  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  user.role = undefined;
  user.passwordChangedAt = undefined;
  await user.save();
  // 3) Update the changedPasswordAt property for the current user
  const url = `${req.protocol}://${req.get('host')}/api/v1/products`;

  // 4) Log the user in
  user.createToken(user, res, 200);
  await new Email(user, url).sendPasswordResetSuccess();
});

exports.updatePassword = asyncWrapper(async (req, res, next) => {
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
  user.createToken(user, res, 200);
});
