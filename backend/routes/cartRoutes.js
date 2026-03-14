const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getCart,
    addToCart,
    updateCartItem,
    removeFromCart,
    clearCart
} = require('../controllers/cartController');
const { protect } = require('../middleware/auth');
const validate = require('../middleware/validation');

// Validation rules
const addToCartValidation = [
    body('productId').notEmpty().withMessage('Product ID is required'),
    body('quantity').optional().isInt({ min: 1 }).withMessage('Quantity must be at least 1')
];

const updateCartValidation = [
    body('quantity').isInt({ min: 0 }).withMessage('Quantity must be 0 or greater')
];

// Protected routes
router.route('/')
    .get(protect, getCart)
    .delete(protect, clearCart);

router.post('/items', protect, addToCartValidation, validate, addToCart);
router.route('/items/:itemId')
    .put(protect, updateCartValidation, validate, updateCartItem)
    .delete(protect, removeFromCart);

module.exports = router;