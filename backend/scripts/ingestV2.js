const XLSX = require('xlsx');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const PotentialInvestorV2 = require('../admin/models/PotentialInvestorV2');
const connectDB = require('../config/db');

dotenv.config();

const ingestV2 = async () => {
    try {
        await connectDB();
        console.log('MongoDB Connected');

        const filePath = path.join(__dirname, '../../Investor - To be uploaded on Capify.xlsx');
        console.log('Reading file:', filePath);

        const workbook = XLSX.readFile(filePath);
        const sheetsToProcess = ['Grants', 'Angel Investors', 'Institutional Investors'];

        let totalInserted = 0;
        let totalSkipped = 0;

        for (const sheetName of sheetsToProcess) {
            if (!workbook.SheetNames.includes(sheetName)) {
                console.warn(`Sheet "${sheetName}" not found in workbook. Skipping.`);
                continue;
            }

            console.log(`Processing sheet: "${sheetName}"`);
            const sheet = workbook.Sheets[sheetName];
            const data = XLSX.utils.sheet_to_json(sheet);
            console.log(`Found ${data.length} records in "${sheetName}".`);

            let sheetInserted = 0;
            let sheetSkipped = 0;

            for (const row of data) {
                try {
                    let investorData = {
                        status: 'pending',
                        source: `excel-import-v2-${sheetName}`
                    };

                    // Map fields based on sheet name
                    if (sheetName === 'Grants') {
                        const name = row['Grant Name / ID'];
                        if (!name) continue;

                        investorData.companyName = name;
                        investorData.website = row['Website'];
                        investorData.industry = row['Industry Focus'];
                        investorData.email = row['Contact Information'];
                        investorData.notes = `Description: ${row['Description'] || ''}\n\nThesis: ${row['Investment Thesis'] || ''}\n\nScheme Type: ${row['Scheme Type'] || ''}\n\nDeadline: ${row['Deadline'] || ''}`;
                        investorData.firstName = 'Grant'; // Placeholder
                        investorData.lastName = 'Provider'; // Placeholder
                    }
                    else if (sheetName === 'Angel Investors') {
                        const name = row['Name'];
                        if (!name) continue;

                        // Split name into first and last
                        const nameParts = name.split(' ');
                        investorData.firstName = nameParts[0];
                        investorData.lastName = nameParts.slice(1).join(' ') || '';

                        investorData.companyName = row['Company'];
                        investorData.email = row['Email Address'];
                        investorData.personLinkedinUrl = row['LinkedIn Profile'];
                        investorData.industry = row['Industry Focus'];
                        investorData.stageOfInvestment = row['Investment Stage'];
                        investorData.notes = `Country: ${row['Country'] || ''}`;
                    }
                    else if (sheetName === 'Institutional Investors') {
                        const name = row['Institutional Investor Name'];
                        if (!name) continue;

                        investorData.companyName = name;
                        investorData.email = row['Email Id'] || row['Investor Email ID'];
                        investorData.industry = row['Industry Focus'];
                        investorData.stageOfInvestment = row['Investment Stage'];

                        // New fields mapping
                        investorData.description = row['Description'];
                        investorData.investmentThesis = row['Investment Thesis'] || row['Description']; // Fallback if needed
                        investorData.type = row['Investor Type'] || 'Institutional';
                        investorData.regionalFocus = row['Regional Focus'];
                        investorData.website = row['Website'] || row['Application Link']; // Prioritize website col but keep link

                        // Parse Team Member if available
                        if (row['Team Member']) {
                            const memberName = row['Team Member'];
                            const memberRole = row['Role'] || 'Team Member'; // Assume role col might exist or default
                            const memberLinkedin = row['Investor LinkedIn Profile']; // This is usually for the person

                            investorData.teamMembers = [{
                                name: memberName,
                                role: memberRole,
                                linkedinUrl: memberLinkedin
                            }];

                            // Also populate top level name for search/compatibility
                            const nameParts = memberName.split(' ');
                            investorData.firstName = nameParts[0];
                            investorData.lastName = nameParts.slice(1).join(' ') || '';
                            investorData.personLinkedinUrl = memberLinkedin;
                        }

                        investorData.notes = `Application Link: ${row['Application Link'] || ''}`; // Reduced notes
                    }

                    // Check for duplicates based on email or company name
                    const query = { $or: [] };
                    if (investorData.email) query.$or.push({ email: investorData.email });
                    // Only check company name if it exists and is not generic
                    if (investorData.companyName && investorData.companyName.length > 2) {
                        query.$or.push({ companyName: investorData.companyName });
                    }

                    let exists = false;
                    if (query.$or.length > 0) {
                        exists = await PotentialInvestorV2.findOne(query);
                    }

                    if (!exists) {
                        await PotentialInvestorV2.create(investorData);
                        sheetInserted++;
                        totalInserted++;
                        process.stdout.write('.');
                    } else {
                        sheetSkipped++;
                        totalSkipped++;
                    }

                } catch (err) {
                    console.error(`Error processing row in ${sheetName}:`, err.message);
                }
            }
            console.log(`\nFinished ${sheetName}: Inserted ${sheetInserted}, Skipped ${sheetSkipped}`);
        }

        console.log(`\nTotal Ingestion complete.`);
        console.log(`Total Inserted: ${totalInserted}`);
        console.log(`Total Skipped (duplicates): ${totalSkipped}`);

        process.exit(0);

    } catch (error) {
        console.error('Error ingesting V2:', error);
        process.exit(1);
    }
};

if (require.main === module) {
    ingestV2();
}

module.exports = ingestV2;
