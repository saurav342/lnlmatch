const mongoose = require('mongoose');

const emailLogSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    investorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Investor'
    },
    recipient: {
        type: String,
        required: true
    },
    subject: {
        type: String,
        required: true
    },
    body: {
        type: String
    },
    status: {
        type: String,
        enum: ['Sent', 'Opened', 'Replied', 'Bounced', 'Failed'],
        default: 'Sent'
    },
    provider: {
        type: String,
        enum: ['gmail', 'outlook', 'smtp'],
        required: true
    },
    sentAt: {
        type: Date,
        default: Date.now
    },
    openedAt: {
        type: Date
    },
    metadata: {
        type: Map,
        of: String
    }
}, { timestamps: true });

module.exports = mongoose.model('EmailLog', emailLogSchema);
