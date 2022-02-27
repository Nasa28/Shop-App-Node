const asyncWrapper = require('../utils/asyncWrapper');
const Review = require('../models/reviewModel');

exports.getAllReviews = asyncWrapper(async (req, res, next) => {
  let filter = {};
  if (req.params.id) filter = { product: req.params.id };
  const reviews = await Review.find(filter);
  res.status(200).json({
    status: 'Success',
    results: reviews.length,
    data: {
      reviews,
    },
  });
});

exports.createReview = asyncWrapper(async (req, res, next) => {
  if (!req.body.product) req.body.product = req.params.id;
  if (!req.body.user) req.body.user = req.user.id;

  const newreview = await Review.create(req.body);

  res.status(201).json({
    status: 'Success',
    data: {
      review: newreview,
    },
  });
});
