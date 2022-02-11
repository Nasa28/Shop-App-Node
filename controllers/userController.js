const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchError');
const User = require('../models/userModel');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((ele) => {
    if (allowedFields.includes(ele)) newObj[ele] = obj[ele];
  });
  return newObj;
};

exports.getUsers = catchAsync(async (req, res) => {
  const users = await User.find().select('-__v');
  res.status(200).json({
    count: users.length,
    status: 'success',
    data: {
      users,
    },
  });
});

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user post password related stuff
  if (req.body.password || req.body.passwordComfirm) {
    return next(
      new AppError(
        'This route is not for password update, please use //updatePassword',
        400,
      ),
    );
  }
  // 2) If not update the user details
  const filteredFields = filterObj(req.body, 'firstName', 'email', 'lastName');

  const UpdatedUser = await User.findByIdAndUpdate(
    req.user.id,
    filteredFields,
    {
      new: true,
      runValidators: true,
    },
  ).select('-__v');

  res.status(200).json({
    status: 'success',
    data: {
      user: UpdatedUser,
    },
  });
});

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This has not been implemented',
  });
};

exports.getUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This has not been implemented',
  });
};

exports.updateUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This has not been implemented',
  });
};

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndDelete(req.params.id);
  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});
