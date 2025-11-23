// backend/controllers/mainController.js
const { stats, investors, grants, campaigns, userProfile } = require('../data/mockData');

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// In-memory storage for demo purposes
let emailConnection = {
    connected: false,
    provider: null,
    email: null,
    tokens: null
};

// In-memory user storage
const users = [];

const getDashboardStats = (req, res) => {
    res.json(stats);
};

const getInvestors = (req, res) => {
    res.json(investors);
};

const getGrants = (req, res) => {
    res.json(grants);
};

const getCampaigns = (req, res) => {
    res.json(campaigns);
};

const getUserProfile = (req, res) => {
    res.json(userProfile);
};

const initiateGmailAuth = (req, res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
    );

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline',
        scope: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
    });

    res.json({ url: authorizeUrl });
};

const handleGmailCallback = async (req, res) => {
    const { code } = req.query;

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Get user email
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GMAIL_CLIENT_ID,
        });
        const payload = ticket.getPayload();

        emailConnection = {
            connected: true,
            provider: 'Gmail',
            email: payload.email,
            tokens
        };

        // Redirect back to frontend
        res.redirect('http://localhost:3000/email-settings?status=success');
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.redirect('http://localhost:3000/email-settings?status=error');
    }
};

const getEmailStatus = (req, res) => {
    res.json({
        connected: emailConnection.connected,
        provider: emailConnection.provider,
        email: emailConnection.email
    });
};

const sendEmail = async (req, res) => {
    const { to, subject, body } = req.body;

    if (!emailConnection.connected || !emailConnection.tokens) {
        return res.status(401).json({ success: false, message: 'Email not connected' });
    }

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );
        oAuth2Client.setCredentials(emailConnection.tokens);

        const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

        // Create raw email
        const messageParts = [
            `To: ${to}`,
            'Content-Type: text/plain; charset=utf-8',
            'MIME-Version: 1.0',
            `Subject: ${subject}`,
            '',
            body
        ];
        const message = messageParts.join('\n');

        // Encode the message
        const encodedMessage = Buffer.from(message)
            .toString('base64')
            .replace(/\+/g, '-')
            .replace(/\//g, '_')
            .replace(/=+$/, '');

        await gmail.users.messages.send({
            userId: 'me',
            requestBody: {
                raw: encodedMessage,
            },
        });

        res.json({ success: true, message: 'Email sent successfully' });
    } catch (error) {
        console.error('Error sending email:', error);
        res.status(500).json({ success: false, message: 'Failed to send email' });
    }
};

const login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        res.json({ success: true, user: { name: user.name, email: user.email }, token: 'mock-jwt-token' });
    } else {
        res.status(401).json({ success: false, message: 'Invalid credentials' });
    }
};

const signup = (req, res) => {
    const { name, email, password } = req.body;

    if (users.find(u => u.email === email)) {
        return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const newUser = { name, email, password };
    users.push(newUser);

    res.json({ success: true, user: { name, email }, token: 'mock-jwt-token' });
};

module.exports = {
    getDashboardStats,
    getInvestors,
    getGrants,
    getCampaigns,
    getUserProfile,
    initiateGmailAuth,
    handleGmailCallback,
    getEmailStatus,
    sendEmail,
    login,
    signup
};
