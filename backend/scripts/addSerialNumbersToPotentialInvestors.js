const mongoose = require('mongoose');
require('dotenv').config();

// Import the PotentialInvestor model
const PotentialInvestor = require('../admin/models/PotentialInvestor');

const addSerialNumbers = async () => {
    try {
        console.log('Connecting to MongoDB...');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected successfully!');

        // Find all potential investors without serial numbers, ordered by creation date
        const investorsWithoutSerial = await PotentialInvestor.find({
            $or: [
                { serialNumber: { $exists: false } },
                { serialNumber: null }
            ]
        }).sort({ createdAt: 1 });

        console.log(`Found ${investorsWithoutSerial.length} investors without serial numbers`);

        if (investorsWithoutSerial.length === 0) {
            console.log('No investors to update!');
            await mongoose.disconnect();
            return;
        }

        // Find the highest existing serial number
        const latestInvestor = await PotentialInvestor.findOne({
            serialNumber: { $exists: true, $ne: null }
        }).sort({ serialNumber: -1 });

        let nextNumber = 1;
        if (latestInvestor && latestInvestor.serialNumber) {
            const currentNumber = parseInt(latestInvestor.serialNumber.substring(2));
            nextNumber = currentNumber + 1;
            console.log(`Latest serial number: ${latestInvestor.serialNumber}, starting from AA${String(nextNumber).padStart(4, '0')}`);
        } else {
            console.log('No existing serial numbers found, starting from AA0001');
        }

        // Update each investor
        for (const investor of investorsWithoutSerial) {
            const serialNumber = `AA${String(nextNumber).padStart(4, '0')}`;
            await PotentialInvestor.findByIdAndUpdate(investor._id, { serialNumber });
            console.log(`Updated ${investor.companyName || 'Unknown'} with serial number: ${serialNumber}`);
            nextNumber++;
        }

        console.log('All investors updated successfully!');
        await mongoose.disconnect();
        console.log('Disconnected from MongoDB');
    } catch (error) {
        console.error('Error:', error);
        await mongoose.disconnect();
        process.exit(1);
    }
};

addSerialNumbers();
