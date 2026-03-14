const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    items: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Product',
                required: true
            },
            name: String,
            price: Number,
            quantity: {
                type: Number,
                required: true,
                min: 1,
                default: 1
            },
            image: String,
            stockStatus: {
                type: String,
                enum: ['In Stock', 'Out of Stock'],
                default: 'In Stock'
            }
        }
    ],
    totalPrice: {
        type: Number,
        required: true,
        default: 0.0,
        min: 0
    },
    totalItems: {
        type: Number,
        required: true,
        default: 0,
        min: 0
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Calculate totals before saving
cartSchema.pre('save', async function(next) {
    this.totalItems = this.items.reduce((total, item) => total + item.quantity, 0);
    this.totalPrice = this.items.reduce((total, item) => total + (item.price * item.quantity), 0);
    next();
});

module.exports = mongoose.model('Cart', cartSchema);