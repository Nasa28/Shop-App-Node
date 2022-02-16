const catchAsync = require('../utils/catchError');
const Review = require('../models/reviewModel');

exports.getAllReviews = catchAsync(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { product: req.params.id };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'Sucess',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = catchAsync(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  // Prevent Users from add the same product twice

  const newreview = await Review.create(req.body);

  res.status(201).json({
    status: 'Created',
    data: {
      review: newreview,
    },
  });
});
