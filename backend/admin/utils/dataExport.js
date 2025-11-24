// backend/admin/utils/dataExport.js
const ExcelJS = require('exceljs');

/**
 * Export users data to Excel
 * @param {Array} users - Array of user objects
 * @returns {Promise<Buffer>} - Excel file buffer
 */
async function exportUsersToExcel(users) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Users');

    // Define columns
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 20 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'User Type', key: 'userType', width: 15 },
        { header: 'Subscription Plan', key: 'subscriptionPlan', width: 20 },
        { header: 'Subscription Status', key: 'subscriptionStatus', width: 20 },
        { header: 'Account Status', key: 'accountStatus', width: 15 },
        { header: 'Profile Completion', key: 'profileCompletion', width: 18 },
        { header: 'Signup Date', key: 'signupDate', width: 20 },
        { header: 'Last Login', key: 'lastLogin', width: 20 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF4472C4' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    users.forEach(user => {
        worksheet.addRow({
            name: user.name,
            email: user.email,
            userType: user.userType,
            subscriptionPlan: user.subscriptionPlan,
            subscriptionStatus: user.subscriptionStatus,
            accountStatus: user.accountStatus,
            profileCompletion: `${user.profileCompletion}%`,
            signupDate: user.signupDate ? new Date(user.signupDate).toLocaleDateString() : '',
            lastLogin: user.lastLogin ? new Date(user.lastLogin).toLocaleDateString() : 'Never'
        });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * Export subscriptions data to Excel
 * @param {Array} subscriptions - Array of subscription objects
 * @returns {Promise<Buffer>} - Excel file buffer
 */
async function exportSubscriptionsToExcel(subscriptions) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Subscriptions');

    // Define columns
    worksheet.columns = [
        { header: 'User Email', key: 'userEmail', width: 30 },
        { header: 'Plan', key: 'plan', width: 15 },
        { header: 'Status', key: 'status', width: 15 },
        { header: 'Amount', key: 'amount', width: 12 },
        { header: 'Currency', key: 'currency', width: 10 },
        { header: 'Start Date', key: 'startDate', width: 20 },
        { header: 'End Date', key: 'endDate', width: 20 },
        { header: 'Renewal Date', key: 'renewalDate', width: 20 },
        { header: 'Payment Method', key: 'paymentMethod', width: 18 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FF70AD47' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    subscriptions.forEach(sub => {
        worksheet.addRow({
            userEmail: sub.userId?.email || 'N/A',
            plan: sub.plan,
            status: sub.status,
            amount: sub.amount || 0,
            currency: sub.currency,
            startDate: sub.startDate ? new Date(sub.startDate).toLocaleDateString() : '',
            endDate: sub.endDate ? new Date(sub.endDate).toLocaleDateString() : '',
            renewalDate: sub.renewalDate ? new Date(sub.renewalDate).toLocaleDateString() : '',
            paymentMethod: sub.paymentMethod
        });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * Export investors data to Excel
 * @param {Array} investors - Array of investor objects
 * @returns {Promise<Buffer>} - Excel file buffer
 */
async function exportInvestorsToExcel(investors) {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Investors');

    // Define columns
    worksheet.columns = [
        { header: 'Name', key: 'name', width: 25 },
        { header: 'Email', key: 'email', width: 30 },
        { header: 'Company', key: 'company', width: 25 },
        { header: 'Location', key: 'location', width: 25 },
        { header: 'Ticket Size Min', key: 'ticketSizeMin', width: 18 },
        { header: 'Ticket Size Max', key: 'ticketSizeMax', width: 18 },
        { header: 'Industries', key: 'industries', width: 30 },
        { header: 'Investment Stage', key: 'investmentStage', width: 25 },
        { header: 'LinkedIn URL', key: 'linkedinUrl', width: 35 },
        { header: 'Website URL', key: 'websiteUrl', width: 35 },
        { header: 'Tags', key: 'tags', width: 25 },
        { header: 'Active', key: 'isActive', width: 10 },
        { header: 'Verified', key: 'isVerified', width: 10 },
        { header: 'Source', key: 'source', width: 15 }
    ];

    // Style header row
    worksheet.getRow(1).font = { bold: true };
    worksheet.getRow(1).fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFED7D31' }
    };
    worksheet.getRow(1).font = { color: { argb: 'FFFFFFFF' }, bold: true };

    // Add data
    investors.forEach(investor => {
        worksheet.addRow({
            name: investor.name,
            email: investor.email,
            company: investor.company || '',
            location: investor.location || '',
            ticketSizeMin: investor.ticketSize?.min || 0,
            ticketSizeMax: investor.ticketSize?.max || 0,
            industries: investor.industries?.join(', ') || '',
            investmentStage: investor.investmentStage?.join(', ') || '',
            linkedinUrl: investor.linkedinUrl || '',
            websiteUrl: investor.websiteUrl || '',
            tags: investor.tags?.join(', ') || '',
            isActive: investor.isActive ? 'Yes' : 'No',
            isVerified: investor.isVerified ? 'Yes' : 'No',
            source: investor.source
        });
    });

    // Generate buffer
    const buffer = await workbook.xlsx.writeBuffer();
    return buffer;
}

/**
 * Convert data to CSV
 * @param {Array} data - Array of objects
 * @param {Array} columns - Array of column definitions { key, header }
 * @returns {string} - CSV string
 */
function convertToCSV(data, columns) {
    if (!data || data.length === 0) {
        return '';
    }

    // Create header row
    const headers = columns.map(col => col.header).join(',');

    // Create data rows
    const rows = data.map(item => {
        return columns.map(col => {
            let value = item[col.key];

            // Handle special cases
            if (value === null || value === undefined) {
                value = '';
            } else if (typeof value === 'object') {
                value = JSON.stringify(value);
            } else {
                value = value.toString();
            }

            // Escape commas and quotes
            if (value.includes(',') || value.includes('"') || value.includes('\n')) {
                value = `"${value.replace(/"/g, '""')}"`;
            }

            return value;
        }).join(',');
    });

    return [headers, ...rows].join('\n');
}

module.exports = {
    exportUsersToExcel,
    exportSubscriptionsToExcel,
    exportInvestorsToExcel,
    convertToCSV
};
