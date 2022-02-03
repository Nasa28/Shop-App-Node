const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'This is a GET route',
  });
});

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'This is a POST route',
  });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'You passed a special Id',
      id: id,
    });
  } else {
    res.status(200).json({
      message: 'pass in an id',
      id: id,
    });
  }
  res.status(200).json({
    message: 'Get a single product',
  });
});

router.patch('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Updated product succesfully',
  });
});

router.delete('/:productId', (req, res, next) => {
  res.status(200).json({
    message: 'Deleted product succesfully',
  });
});

module.exports = router;
