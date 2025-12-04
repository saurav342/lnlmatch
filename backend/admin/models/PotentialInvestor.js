const mongoose = require('mongoose');

const potentialInvestorSchema = new mongoose.Schema({
    companyName: { type: String, trim: true },
    website: { type: String, trim: true },
    companyLinkedinUrl: { type: String, trim: true },
    twitterUrl: { type: String, trim: true },
    industry: { type: String, trim: true },
    stageOfInvestment: { type: String, trim: true },
    firstName: { type: String, trim: true },
    lastName: { type: String, trim: true },
    email: { type: String, trim: true, lowercase: true },
    personLinkedinUrl: { type: String, trim: true },
    authentic: { type: String, trim: true },
    notes: { type: String, trim: true },
    status: {
        type: String,
        enum: ['pending', 'verified', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('PotentialInvestor', potentialInvestorSchema);
