// Script to fix existing investor records by setting type based on tags
require('dotenv').config({ path: __dirname + '/../../.env' });
const mongoose = require('mongoose');
const Investor = require('../models/Investor');

async function fixInvestorTypes() {
    try {
        // Connect to MongoDB
        console.log('Connecting to MongoDB:', process.env.MONGO_URI ? 'Using MONGO_URI from .env' : 'ERROR: No MONGO_URI found!');
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB successfully');


        // First, let's see what we have
        const allInvestors = await Investor.find({}).select('name tags type');
        console.log(`Found ${allInvestors.length} total investors`);
        console.log('Sample investors:', allInvestors.slice(0, 3).map(i => ({ name: i.name, tags: i.tags, type: i.type })));

        // Update ALL investors with Angel tag (regardless of current type value)
        const angelResult = await Investor.updateMany(
            { tags: { $in: ['Angel'] } },
            { $set: { type: 'Angel' } }
        );
        console.log(`Updated ${angelResult.modifiedCount} Angel investors`);

        // Update ALL investors with Institutional tag (regardless of current type value)
        const institutionalResult = await Investor.updateMany(
            { tags: { $in: ['Institutional'] } },
            { $set: { type: 'Institutional' } }
        );
        console.log(`Updated ${institutionalResult.modifiedCount} Institutional investors`);

        // Verify the update
        const updatedInvestors = await Investor.find({}).select('name tags type');
        console.log('Sample updated investors:', updatedInvestors.slice(0, 3).map(i => ({ name: i.name, tags: i.tags, type: i.type })));

        console.log('Migration complete!');
        process.exit(0);
    } catch (error) {
        console.error('Migration error:', error);
        process.exit(1);
    }
}

fixInvestorTypes();
