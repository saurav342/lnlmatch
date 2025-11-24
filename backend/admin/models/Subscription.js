// backend/admin/models/Subscription.js
const mongoose = require('mongoose');

const subscriptionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    plan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trial'],
        default: 'trial',
        index: true
    },
    startDate: {
        type: Date,
        default: Date.now
    },
    endDate: {
        type: Date
    },
    renewalDate: {
        type: Date
    },
    amount: {
        type: Number,
        default: 0
    },
    currency: {
        type: String,
        default: 'USD'
    },
    paymentMethod: {
        type: String,
        enum: ['card', 'bank_transfer', 'paypal', 'other'],
        default: 'card'
    },
    transactionId: {
        type: String
    },
    billingHistory: [{
        date: {
            type: Date,
            default: Date.now
        },
        amount: {
            type: Number,
            required: true
        },
        status: {
            type: String,
            enum: ['success', 'failed', 'pending', 'refunded'],
            default: 'pending'
        },
        transactionId: {
            type: String
        },
        description: {
            type: String
        }
    }]
}, {
    timestamps: true
});

// Index for revenue queries
subscriptionSchema.index({ status: 1, plan: 1 });
subscriptionSchema.index({ renewalDate: 1 });
subscriptionSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Subscription', subscriptionSchema);
