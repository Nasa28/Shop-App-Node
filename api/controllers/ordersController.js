const Order = require('../models/orderModel');

const catchAsync = require('../../utils/catchError');
const AppError = require('../../utils/AppError');

exports.allOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    status: 'Success',
    data: {
      orders,
    },
  });
});
