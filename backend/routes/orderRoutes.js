const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    createOrder,
    getOrderById,
    updateOrderToPaid,
    updateOrderToDelivered,
    getMyOrders,
    getOrders,
    cancelOrder
} = require('../controllers/orderController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validation');

// Validation rules
const orderValidation = [
    body('orderItems').isArray({ min: 1 }).withMessage('Order items are required'),
    body('shippingAddress').notEmpty().withMessage('Shipping address is required'),
    body('paymentMethod').notEmpty().withMessage('Payment method is required'),
    body('itemsPrice').isNumeric().withMessage('Items price must be a number'),
    body('totalPrice').isNumeric().withMessage('Total price must be a number')
];

// Protected routes
router.route('/')
    .post(protect, orderValidation, validate, createOrder)
    .get(protect, admin, getOrders);

router.get('/myorders', protect, getMyOrders);
router.get('/:id', protect, getOrderById);
router.put('/:id/pay', protect, updateOrderToPaid);
router.put('/:id/cancel', protect, cancelOrder);

// Admin routes
router.put('/:id/deliver', protect, admin, updateOrderToDelivered);

module.exports = router;