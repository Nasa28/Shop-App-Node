const express = require('express');
const orderController = require('../controllers/ordersController');
const router = express.Router();

const { allOrder, getOrder, createOrder, updateOrder, deleteOrder } =
  orderController;

router.route('/').get(allOrder).post(createOrder);
router.route('/:id').get(getOrder).patch(updateOrder).delete(deleteOrder);

module.exports = router;
