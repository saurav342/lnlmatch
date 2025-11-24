// backend/admin/models/AdminActivity.js
const mongoose = require('mongoose');

const adminActivitySchema = new mongoose.Schema({
    adminId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    action: {
        type: String,
        required: true,
        index: true
    },
    targetType: {
        type: String,
        enum: ['user', 'investor', 'subscription', 'system', 'data'],
        required: true,
        index: true
    },
    targetId: {
        type: mongoose.Schema.Types.ObjectId
    },
    metadata: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        default: {}
    },
    ipAddress: {
        type: String
    },
    userAgent: {
        type: String
    },
    status: {
        type: String,
        enum: ['success', 'failed', 'pending'],
        default: 'success'
    },
    errorMessage: {
        type: String
    }
}, {
    timestamps: { createdAt: 'timestamp', updatedAt: false }
});

// Indexes for activity log queries
adminActivitySchema.index({ timestamp: -1 });
adminActivitySchema.index({ adminId: 1, timestamp: -1 });
adminActivitySchema.index({ action: 1, timestamp: -1 });

module.exports = mongoose.model('AdminActivity', adminActivitySchema);
