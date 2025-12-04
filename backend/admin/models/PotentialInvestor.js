const mongoose = require('mongoose');

const potentialInvestorSchema = new mongoose.Schema({
    serialNumber: {
        type: String,
        unique: true,
        sparse: true // Allow null values during creation
    },
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

// Pre-save middleware to auto-generate serial number
potentialInvestorSchema.pre('save', async function (next) {
    if (!this.serialNumber && this.isNew) {
        try {
            // Find the latest investor with a serial number
            const latestInvestor = await this.constructor
                .findOne({ serialNumber: { $exists: true, $ne: null } })
                .sort({ serialNumber: -1 })
                .select('serialNumber')
                .lean();

            let nextNumber = 1;

            if (latestInvestor && latestInvestor.serialNumber) {
                // Extract the numeric part from AA0001
                const currentNumber = parseInt(latestInvestor.serialNumber.substring(2));
                nextNumber = currentNumber + 1;
            }

            // Format with leading zeros (AA0001, AA0002, etc.)
            this.serialNumber = `AA${String(nextNumber).padStart(4, '0')}`;
        } catch (error) {
            return next(error);
        }
    }
    next();
});

module.exports = mongoose.model('PotentialInvestor', potentialInvestorSchema);
