// backend/admin/models/Investor.js
const mongoose = require('mongoose');

const investorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    serialNumber: {
        type: String,
        unique: true,
        sparse: true,
        index: true
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        index: true
    },
    company: {
        type: String,
        trim: true
    },
    location: {
        type: String,
        trim: true
    },
    country: {
        type: String,
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    investmentThesis: {
        type: String,
        trim: true
    },
    regionalFocus: [{
        type: String,
        trim: true
    }],
    ticketSize: {
        min: {
            type: Number,
            default: 0
        },
        max: {
            type: Number,
            default: 0
        }
    },
    teamMembers: [{
        name: {
            type: String,
            trim: true
        },
        role: {
            type: String,
            trim: true
        },
        linkedinUrl: {
            type: String,
            trim: true
        }
    }],
    industries: [{
        type: String,
        trim: true
    }],
    investmentStage: [{
        type: String,
        enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth', 'late-stage'],
        trim: true
    }],
    linkedinUrl: {
        type: String,
        trim: true
    },
    websiteUrl: {
        type: String,
        trim: true
    },
    notes: {
        type: String
    },
    tags: [{
        type: String,
        trim: true
    }],
    type: {
        type: String,
        enum: ['Angel', 'Institutional'],
        index: true
    },
    isActive: {
        type: Boolean,
        default: true,
        index: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    source: {
        type: String,
        enum: ['manual', 'excel-import', 'api', 'migration'],
        default: 'manual',
        index: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    avatar: {
        type: String
    },
    isWishlisted: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true
});

// Indexes for filtering and searching
investorSchema.index({ name: 'text', company: 'text' });
investorSchema.index({ industries: 1 });
investorSchema.index({ location: 1 });
investorSchema.index({ isActive: 1, isVerified: 1 });

module.exports = mongoose.model('Investor', investorSchema);
