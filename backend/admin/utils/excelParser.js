// backend/admin/utils/excelParser.js
const XLSX = require('xlsx');

/**
 * Parse Excel file to JSON and validate investor data
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Object} - { success, data, errors }
 */
function parseInvestorsExcel(fileBuffer) {
    try {
        const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];

        // Convert to JSON
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        if (!rawData || rawData.length === 0) {
            return {
                success: false,
                data: [],
                errors: ['Excel file is empty or has no data']
            };
        }

        const validatedData = [];
        const errors = [];

        rawData.forEach((row, index) => {
            const rowNumber = index + 2; // +2 because Excel is 1-indexed and has header row
            const rowErrors = [];

            // Required fields validation
            if (!row.name || row.name.toString().trim() === '') {
                rowErrors.push(`Row ${rowNumber}: Name is required`);
            }

            if (!row.email || row.email.toString().trim() === '') {
                rowErrors.push(`Row ${rowNumber}: Email is required`);
            } else if (!isValidEmail(row.email.toString().trim())) {
                rowErrors.push(`Row ${rowNumber}: Invalid email format`);
            }

            // If there are errors for this row, skip it
            if (rowErrors.length > 0) {
                errors.push(...rowErrors);
                return;
            }

            // Parse industries (comma-separated)
            let industries = [];
            if (row.industries) {
                industries = row.industries.toString().split(',').map(i => i.trim()).filter(i => i);
            }

            // Parse investment stages (comma-separated)
            let investmentStage = [];
            if (row.investmentStage || row.investment_stage) {
                const stageStr = (row.investmentStage || row.investment_stage).toString();
                investmentStage = stageStr.split(',').map(s => s.trim().toLowerCase()).filter(s => s);
            }

            // Parse tags (comma-separated)
            let tags = [];
            if (row.tags) {
                tags = row.tags.toString().split(',').map(t => t.trim()).filter(t => t);
            }

            // Parse ticket size
            let ticketSize = { min: 0, max: 0 };
            if (row.ticketSizeMin || row.ticket_size_min) {
                ticketSize.min = parseFloat(row.ticketSizeMin || row.ticket_size_min) || 0;
            }
            if (row.ticketSizeMax || row.ticket_size_max) {
                ticketSize.max = parseFloat(row.ticketSizeMax || row.ticket_size_max) || 0;
            }

            // Construct validated investor object
            const investor = {
                name: row.name.toString().trim(),
                email: row.email.toString().trim().toLowerCase(),
                company: row.company ? row.company.toString().trim() : '',
                location: row.location ? row.location.toString().trim() : '',
                ticketSize,
                industries,
                investmentStage,
                linkedinUrl: row.linkedinUrl || row.linkedin_url || row.linkedin || '',
                websiteUrl: row.websiteUrl || row.website_url || row.website || '',
                notes: row.notes ? row.notes.toString() : '',
                tags,
                isActive: true,
                isVerified: false,
                source: 'excel-import'
            };

            validatedData.push(investor);
        });

        return {
            success: errors.length === 0,
            data: validatedData,
            errors,
            totalRows: rawData.length,
            validRows: validatedData.length,
            invalidRows: rawData.length - validatedData.length
        };

    } catch (error) {
        return {
            success: false,
            data: [],
            errors: [`Failed to parse Excel file: ${error.message}`]
        };
    }
}

/**
 * Validate email format
 * @param {string} email
 * @returns {boolean}
 */
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

/**
 * Generate Excel template for investor uploads
 * @returns {Buffer} - Excel file buffer
 */
function generateInvestorTemplate() {
    const templateData = [
        {
            name: 'Sarah Chen',
            email: 'sarah.chen@accel.com',
            company: 'Accel Partners',
            location: 'San Francisco, CA',
            ticketSizeMin: 500000,
            ticketSizeMax: 2000000,
            industries: 'AI/ML, SaaS, Fintech',
            investmentStage: 'seed, series-a',
            linkedinUrl: 'https://linkedin.com/in/sarahchen',
            websiteUrl: 'https://accel.com',
            notes: 'Focus on AI startups in healthcare',
            tags: 'AI, Healthcare, Active'
        },
        {
            name: 'Michael Roberts',
            email: 'mroberts@sequoia.com',
            company: 'Sequoia Capital',
            location: 'Menlo Park, CA',
            ticketSizeMin: 1000000,
            ticketSizeMax: 5000000,
            industries: 'Fintech, Enterprise, SaaS',
            investmentStage: 'series-a, series-b',
            linkedinUrl: 'https://linkedin.com/in/michaelroberts',
            websiteUrl: 'https://sequoiacap.com',
            notes: 'Enterprise SaaS specialist',
            tags: 'Enterprise, SaaS, Top Tier'
        }
    ];

    const worksheet = XLSX.utils.json_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Investors');

    // Generate buffer
    const buffer = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
    return buffer;
}

module.exports = {
    parseInvestorsExcel,
    generateInvestorTemplate,
    isValidEmail
};
