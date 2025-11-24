// backend/admin/models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        index: true
    },
    password: {
        type: String,
        required: true
    },
    userType: {
        type: String,
        enum: ['founder', 'investor', 'admin'],
        default: 'founder'
    },
    subscriptionPlan: {
        type: String,
        enum: ['free', 'pro', 'enterprise'],
        default: 'free'
    },
    subscriptionStatus: {
        type: String,
        enum: ['active', 'cancelled', 'expired', 'trial'],
        default: 'trial'
    },
    signupDate: {
        type: Date,
        default: Date.now,
        index: true
    },
    lastLogin: {
        type: Date
    },
    profileCompletion: {
        type: Number,
        default: 0,
        min: 0,
        max: 100
    },
    accountStatus: {
        type: String,
        enum: ['active', 'suspended', 'deleted'],
        default: 'active'
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    }
}, {
    timestamps: true
});

// Index for common queries
userSchema.index({ subscriptionPlan: 1, subscriptionStatus: 1 });
userSchema.index({ userType: 1, accountStatus: 1 });
userSchema.index({ signupDate: -1 });

module.exports = mongoose.model('User', userSchema);
