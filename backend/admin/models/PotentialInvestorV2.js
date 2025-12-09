const mongoose = require('mongoose');

const potentialInvestorV2Schema = new mongoose.Schema({
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
    adminNotes: { type: String, trim: true },
    // New fields for separation of data
    description: { type: String, trim: true },
    investmentThesis: { type: String, trim: true },
    regionalFocus: { type: String, trim: true }, // Comma separated string
    ticketSize: { type: String, trim: true },
    teamMembers: [{
        name: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true },
        designation: { type: String, trim: true },
        linkedinUrl: { type: String, trim: true }
    }], // Array of objects
    tags: [{ type: String, trim: true }],
    type: { type: String, trim: true, default: 'Institutional' },
    status: {
        type: String,
        enum: ['pending', 'verified', 'approved', 'rejected'],
        default: 'pending'
    },
    createdAt: { type: Date, default: Date.now }
});

// Pre-save middleware to auto-generate serial number
potentialInvestorV2Schema.pre('save', async function () {
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
                // Extract the numeric part from AB0001
                const currentNumber = parseInt(latestInvestor.serialNumber.substring(2));
                nextNumber = currentNumber + 1;
            }

            // Format with leading zeros (AB0001, AB0002, etc.)
            this.serialNumber = `AB${String(nextNumber).padStart(4, '0')}`;
        } catch (error) {
            throw error;
        }
    }
});

module.exports = mongoose.model('PotentialInvestorV2', potentialInvestorV2Schema);
