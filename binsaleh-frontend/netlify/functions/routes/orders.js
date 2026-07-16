const express = require('express');
const router = express.Router();
const { protect, isAdmin, optionalProtect } = require('../middleware/auth');
const {
  createOrder,
  getOrders,
  getMyOrders,
  getOrderById,
  updateOrderStatus
} = require('../controllers/orderController');

router.post('/', optionalProtect, createOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, isAdmin, getOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/status', protect, isAdmin, updateOrderStatus);

module.exports = router;
