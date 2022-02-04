const express = require('express');
const orderController = require('../controllers/ordersController');
const router = express.Router();

const { allOrder, getOrder, createOrder, updateOrder, deleteOrder } =
  orderController;

router.get('/', allOrder);

router.post('/', createOrder);

router.get('/:id', getOrder);
router.patch('/:id', updateOrder);
router.delete('/:id', deleteOrder);

module.exports = router;
