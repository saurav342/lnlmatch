const XLSX = require('xlsx');
const Investor = require('../models/Investor');

const uploadInvestors = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No file uploaded' });
        }

        const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
        const sheetNames = workbook.SheetNames;

        let totalProcessed = 0;
        let totalUpdated = 0;
        let totalCreated = 0;
        let errors = [];

        // Process Angel Investors
        if (sheetNames.includes('Angel Investors')) {
            const sheet = workbook.Sheets['Angel Investors'];
            const data = XLSX.utils.sheet_to_json(sheet);

            for (const row of data) {
                try {
                    const email = row['Email Address'];
                    if (!email) continue; // Skip if no email

                    const investorData = {
                        name: row['Name'],
                        company: row['Company'],
                        location: row['Country'],
                        email: email.toLowerCase(),
                        linkedinUrl: row['LinkedIn Profile'],
                        source: 'excel-import',
                        type: 'Angel',
                        tags: ['Angel']
                    };

                    // Check if featured
                    if (row['Featured'] === 'Yes' || row['Featured'] === true) {
                        investorData.isWishlisted = true;
                    }

                    const result = await Investor.updateOne(
                        { email: investorData.email },
                        { $set: investorData, $setOnInsert: { isActive: true } },
                        { upsert: true }
                    );

                    if (result.upsertedCount > 0) totalCreated++;
                    else if (result.modifiedCount > 0) totalUpdated++;
                    totalProcessed++;

                } catch (err) {
                    errors.push(`Error processing Angel Investor row: ${err.message}`);
                }
            }
        }

        // Process Institutional Investors
        if (sheetNames.includes('Institutional Investors')) {
            const sheet = workbook.Sheets['Institutional Investors'];
            const data = XLSX.utils.sheet_to_json(sheet);

            for (const row of data) {
                try {
                    const email = row['Contact Information'];

                    if (!email) {
                        continue;
                    }

                    const industries = row['Industry Focus'] ? row['Industry Focus'].split(',').map(s => s.trim()) : [];

                    const investorData = {
                        name: row['Investor Name / ID'],
                        notes: `${row['Description'] || ''}\n\nThesis: ${row['Investment Thesis'] || ''}`,
                        location: row['Country'],
                        email: email.toLowerCase(),
                        websiteUrl: row['Website'],
                        industries: industries,
                        source: 'excel-import',
                        type: 'Institutional',
                        tags: ['Institutional']
                    };

                    if (row['Investor Type']) {
                        investorData.tags.push(row['Investor Type']);
                    }

                    const result = await Investor.updateOne(
                        { email: investorData.email },
                        { $set: investorData, $setOnInsert: { isActive: true } },
                        { upsert: true }
                    );

                    if (result.upsertedCount > 0) totalCreated++;
                    else if (result.modifiedCount > 0) totalUpdated++;
                    totalProcessed++;

                } catch (err) {
                    errors.push(`Error processing Institutional Investor row: ${err.message}`);
                }
            }
        }

        res.status(200).json({
            message: 'Upload processed successfully',
            stats: {
                processed: totalProcessed,
                created: totalCreated,
                updated: totalUpdated,
                errors: errors.length
            },
            errors: errors.length > 0 ? errors : undefined
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ message: 'Error processing file upload', error: error.message });
    }
};

module.exports = {
    uploadInvestors
};
