const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PotentialInvestor = require('../admin/models/PotentialInvestor');
const connectDB = require('../config/db');

dotenv.config();

const ingestCSV = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const results = [];
        const csvPath = path.join(__dirname, '../../investor.csv');

        fs.createReadStream(csvPath)
            .pipe(csv())
            .on('data', (data) => {
                // Map CSV columns to model fields
                const investor = {
                    companyName: data['Company Name'],
                    website: data['Website'],
                    companyLinkedinUrl: data['Company Linkedin Url'],
                    twitterUrl: data['Twitter Url'],
                    industry: data['Industry'],
                    stageOfInvestment: data['Stage of investment'],
                    firstName: data['First Name'],
                    lastName: data['Last Name'],
                    email: data['Email'],
                    personLinkedinUrl: data['Person Linkedin Url'],
                    authentic: data['Authentic'],
                    notes: data['Notes']
                };
                results.push(investor);
            })
            .on('end', async () => {
                console.log(`Parsed ${results.length} records from CSV.`);

                // Optional: Clear existing pending records to avoid duplicates on re-run
                // await PotentialInvestor.deleteMany({ status: 'pending' });

                let insertedCount = 0;
                for (const investor of results) {
                    // Simple duplicate check by email, if email exists
                    if (investor.email) {
                        const exists = await PotentialInvestor.findOne({ email: investor.email });
                        if (!exists) {
                            await PotentialInvestor.create(investor);
                            insertedCount++;
                        }
                    } else {
                        // If no email, just insert? Or maybe check company name?
                        // For now, let's insert if no email, assuming it might be a valid lead without email
                        await PotentialInvestor.create(investor);
                        insertedCount++;
                    }
                }

                console.log(`Successfully inserted ${insertedCount} new potential investors.`);
                process.exit();
            });

    } catch (error) {
        console.error('Error ingesting CSV:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    ingestCSV();
}

module.exports = ingestCSV;
