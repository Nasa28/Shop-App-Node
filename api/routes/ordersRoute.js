const express = require('express');
const orderController = require('../controllers/ordersController');
const router = express.Router();

const { allOrder } = orderController;

router.get('/', allOrder);

router.post('/', (req, res, next) => {
  res.status(201).json({
    message: 'Post an order',
  });
});

router.get('/:orderId', (req, res, next) => {
  res.status(200).json({
    message: 'Order fetched',
    id: req.params.orderId,
  });
});
router.delete('/:orderId', (req, res, next) => {
  res.status(204).json({
    message: 'Order deleted',
  });
});

module.exports = router;
