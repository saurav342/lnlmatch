const XLSX = require('xlsx');
const path = require('path');

const filePath = path.join(__dirname, '../../Investor - To be uploaded on Capify.xlsx');
console.log('Reading file:', filePath);

try {
    const workbook = XLSX.readFile(filePath);
    console.log('Sheet Names:', workbook.SheetNames);
    const sheetName = 'Institutional Investors';
    console.log('Sheet Name:', sheetName);
    const sheet = workbook.Sheets[sheetName];
    const data = XLSX.utils.sheet_to_json(sheet, { header: 1 });
    if (data.length > 0) {
        console.log('Headers:', data[0]);
    } else {
        console.log('Sheet is empty');
    }
} catch (error) {
    console.error('Error reading file:', error);
}
