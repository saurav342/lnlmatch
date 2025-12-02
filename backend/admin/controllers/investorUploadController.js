const xlsx = require('xlsx');
const Investor = require('../models/Investor');

// Helper to validate email format
const isValidEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

exports.uploadInvestors = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ success: false, message: 'No file uploaded' });
        }

        const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const data = xlsx.utils.sheet_to_json(sheet);

        if (!data || data.length === 0) {
            return res.status(400).json({ success: false, message: 'Excel sheet is empty' });
        }

        let successCount = 0;
        let errorCount = 0;
        const errors = [];

        for (const [index, row] of data.entries()) {
            const rowNumber = index + 2; // +1 for 0-index, +1 for header row

            try {
                // Basic validation
                if (!row.email || !isValidEmail(row.email)) {
                    throw new Error(`Invalid or missing email: ${row.email || 'N/A'}`);
                }
                if (!row.name) {
                    throw new Error('Missing name');
                }

                // Prepare investor object
                const investorData = {
                    name: row.name,
                    email: row.email,
                    company: row.company || row.organization || '',
                    role: row.role || row.designation || 'Investor',
                    location: row.location || '',
                    ticketSize: {
                        min: row.minTicketSize ? Number(row.minTicketSize) : 0,
                        max: row.maxTicketSize ? Number(row.maxTicketSize) : 0
                    },
                    industries: row.industries ? row.industries.split(',').map(i => i.trim()) : [],
                    investmentStage: row.stage ? row.stage.split(',').map(s => s.trim()) : [],
                    isVerified: true, // Auto-verify uploaded investors? Let's assume yes for admin upload
                    isActive: true,
                    updatedAt: new Date()
                };

                // Upsert: Update if exists, Insert if new
                await Investor.findOneAndUpdate(
                    { email: row.email },
                    { $set: investorData, $setOnInsert: { createdAt: new Date() } },
                    { upsert: true, new: true, runValidators: true }
                );

                successCount++;
            } catch (err) {
                errorCount++;
                errors.push({ row: rowNumber, message: err.message, data: row });
            }
        }

        res.status(200).json({
            success: true,
            message: `Processed ${data.length} rows`,
            summary: {
                total: data.length,
                success: successCount,
                failed: errorCount,
                errors: errors.slice(0, 50) // Limit error details
            }
        });

    } catch (error) {
        console.error('Upload error:', error);
        res.status(500).json({ success: false, message: 'Failed to process file', error: error.message });
    }
};
