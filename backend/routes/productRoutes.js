const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    createProductReview,
    getTopProducts,
    getCategories
} = require('../controllers/productController');
const { protect, admin } = require('../middleware/auth');
const validate = require('../middleware/validation');
const upload = require('../middleware/upload');

// Validation rules
const productValidation = [
    body('name').notEmpty().withMessage('Product name is required'),
    body('description').notEmpty().withMessage('Description is required'),
    body('price').isNumeric().withMessage('Price must be a number'),
    body('category').notEmpty().withMessage('Category is required'),
    body('brand').notEmpty().withMessage('Brand is required'),
    body('stock').isNumeric().withMessage('Stock must be a number')
];

const reviewValidation = [
    body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
    body('comment').notEmpty().withMessage('Comment is required')
];

// Public routes
router.get('/', getProducts);
router.get('/top', getTopProducts);
router.get('/categories', getCategories);
router.get('/:id', getProductById);

// Protected routes (user)
router.post('/:id/reviews', protect, reviewValidation, validate, createProductReview);

// Admin routes
router.post('/', protect, admin, upload.array('images', 5), productValidation, validate, createProduct);
router.put('/:id', protect, admin, upload.array('images', 5), productValidation, validate, updateProduct);
router.delete('/:id', protect, admin, deleteProduct);

module.exports = router;