// backend/controllers/mainController.js
const User = require('../admin/models/User');
const Investor = require('../admin/models/Investor');
const jwt = require('jsonwebtoken');

const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');

// In-memory storage for demo purposes
let emailConnection = {
    connected: false,
    provider: null,
    email: null,
    tokens: null
};

const getDashboardStats = (req, res) => {
    // Return empty stats instead of mock data
    res.json({
        potentialMatches: 0,
        grantsAvailable: 0,
        activeInvestors: 0,
        profileViews: 0,
        emailsSent: 0,
    });
};

const getInvestors = async (req, res) => {
    try {
        const investors = await Investor.find({});

        // Transform data to match frontend expectations
        const transformedInvestors = investors.map(inv => {
            const investor = inv.toObject();
            return {
                id: investor._id.toString(),
                name: investor.name,
                email: investor.email,
                company: investor.company || 'N/A',
                location: investor.location || 'N/A',
                ticketSize: investor.ticketSize && (investor.ticketSize.min || investor.ticketSize.max)
                    ? `$${investor.ticketSize.min || 0}K - $${investor.ticketSize.max || 0}K`
                    : 'N/A',
                industries: investor.industries || [],
                investmentStage: investor.investmentStage || [],
                linkedinUrl: investor.linkedinUrl,
                websiteUrl: investor.websiteUrl,
                website: investor.websiteUrl, // Map websiteUrl to website for frontend
                notes: investor.notes,
                description: investor.notes || 'No description available.', // Map notes to description
                tags: investor.tags || [],
                type: investor.type,
                isActive: investor.isActive,
                isVerified: investor.isVerified,
                isWishlisted: investor.isWishlisted || false,
                avatar: investor.avatar,
                source: investor.source,
                createdAt: investor.createdAt,
                updatedAt: investor.updatedAt
            };
        });

        res.json(transformedInvestors);
    } catch (error) {
        console.error('Error fetching investors:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch investors' });
    }
};

const getGrants = (req, res) => {
    // Return empty grants array instead of mock data
    res.json([]);
};

const getCampaigns = (req, res) => {
    // Return empty campaigns array instead of mock data
    res.json([]);
};

const getUserProfile = async (req, res) => {
    // Extract token from Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // "Bearer TOKEN"

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Unauthorized'
        });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            name: user.name,
            email: user.email,
            profileCompletion: user.profileCompletion || 65,
            currentPlan: user.subscriptionPlan === 'free' ? 'Free' : user.subscriptionPlan === 'pro' ? 'Pro' : 'Enterprise',
            aiCreditsRemaining: 15, // Mock for now
        });
    } catch (error) {
        return res.status(401).json({
            success: false,
            message: 'Invalid token'
        });
    }
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

const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });

        if (user && user.password === password) {
            // Update last login
            user.lastLogin = new Date();
            await user.save();

            const token = jwt.sign(
                { id: user._id, email: user.email, userType: user.userType },
                process.env.JWT_SECRET || 'secret',
                { expiresIn: '30d' }
            );

            res.json({
                success: true,
                user: {
                    name: user.name,
                    email: user.email,
                    userType: user.userType
                },
                token
            });
        } else {
            res.status(401).json({ success: false, message: 'Invalid credentials' });
        }
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const signup = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ success: false, message: 'User already exists' });
        }

        const newUser = await User.create({
            name,
            email,
            password, // Storing plaintext for now as per requirement
            userType: 'founder', // Default type
            signupDate: new Date()
        });

        const token = jwt.sign(
            { id: newUser._id, email: newUser.email, userType: newUser.userType },
            process.env.JWT_SECRET || 'secret',
            { expiresIn: '30d' }
        );

        res.json({
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email,
                userType: newUser.userType
            },
            token
        });
    } catch (error) {
        console.error('Signup error:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
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
