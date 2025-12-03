const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function testUpload() {
    try {
        const form = new FormData();
        const filePath = path.join(__dirname, 'spreadsheet.xlsx');
        form.append('file', fs.createReadStream(filePath));

        // We need an admin token. Since I don't have one easily, 
        // I might need to bypass auth or login first.
        // For now, let's try to hit the endpoint. If it fails with 401, 
        // I'll know the route is reachable at least.
        // Or I can temporarily comment out the auth middleware in adminRoutes.js for this test.
        // But that's risky.

        // Let's assume I can't easily get a token without logging in.
        // I'll try to login as admin first if I have creds.
        // The user provided admin creds earlier: saurav.dnd@gmail.com | lnl123

        const loginRes = await axios.post('http://localhost:5001/api/auth/login', {
            email: 'saurav.dnd@gmail.com',
            password: 'lnl123'
        });

        const token = loginRes.data.token;
        console.log('Got token:', token ? 'Yes' : 'No');

        const response = await axios.post('http://localhost:5001/api/admin/investors/upload', form, {
            headers: {
                ...form.getHeaders(),
                'Authorization': `Bearer ${token}`
            }
        });

        console.log('Upload Status:', response.status);
        console.log('Upload Data:', JSON.stringify(response.data, null, 2));

    } catch (error) {
        console.error('Error:', error.response ? error.response.data : error.message);
    }
}

testUpload();
