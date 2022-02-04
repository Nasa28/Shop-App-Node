const Order = require('../models/orderModel');

const catchAsync = require('../../utils/catchError');
const AppError = require('../../utils/AppError');

exports.allOrder = catchAsync(async (req, res, next) => {
  const orders = await Order.find();

  res.status(200).json({
    count: orders.length,
    status: 'Success',
    data: {
      orders,
    },
  });
});

exports.getOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findById(req.params.id);

  if (!order) {
    return next(new AppError('This order does not exist', 404));
  }
  res.status(200).json({
    status: 'Success',
    data: {
      order,
    },
  });
});

exports.createOrder = catchAsync(async (req, res, next) => {
  const newOrder = await Order.create(req.body);

  res.status(200).json({
    status: 'Success',
    data: {
      order: newOrder,
    },
  });
});

exports.updateOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  if (!order) {
    return next(new AppError('This order does not exist', 404));
  }

  res.status(200).json({
    status: 'Order Updated',
    data: {
      order,
    },
  });
});

exports.deleteOrder = catchAsync(async (req, res, next) => {
  const order = await Order.findByIdAndDelete(req.params.id);

  if (!order) {
    return next(new AppError('This order does not exist', 404));
  }

  res.status(204).json({
    status: 'Order Updated',
  });
});
