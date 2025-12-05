// backend/controllers/mainController.js
const User = require('../admin/models/User');
const Investor = require('../admin/models/Investor');
const EmailLog = require('../admin/models/EmailLog');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const { OAuth2Client } = require('google-auth-library');
const { google } = require('googleapis');
const { AuthorizationCode } = require('simple-oauth2');

// Helper to get user from request (assuming auth middleware populates req.user or we decode token)
// Since the routes use custom auth logic in some places, we'll need to be careful.
// For the auth callback routes, we might need to pass state or use session. 
// For simplicity in this "Junior Dev" context, we'll assume the frontend handles the state or we use a simple approach.

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

const getCampaigns = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Fetch logs for this user
        const logs = await EmailLog.find({ userId: decoded.id })
            .populate('investorId', 'name company')
            .sort({ sentAt: -1 });

        const campaigns = logs.map(log => ({
            id: log._id,
            investor: log.investorId ? log.investorId.name : (log.recipient || 'Unknown'),
            contact: log.recipient,
            subject: log.subject,
            status: log.status,
            sentAt: new Date(log.sentAt).toLocaleDateString(),
            openedAt: log.openedAt ? new Date(log.openedAt).toLocaleDateString() : null
        }));

        res.json(campaigns);
    } catch (error) {
        console.error('Error fetching campaigns:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch campaigns' });
    }
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

// --- GMAIL ---

const initiateGmailAuth = (req, res) => {
    const oAuth2Client = new OAuth2Client(
        process.env.GMAIL_CLIENT_ID,
        process.env.GMAIL_CLIENT_SECRET,
        process.env.GMAIL_REDIRECT_URI
    );

    // Get user ID from token to ensure we update the correct user on callback
    let state;
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ success: false, message: 'Unauthorized: No token provided' });
    }

    try {
        const token = authHeader.split(' ')[1];
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        state = decoded.id;
    } catch (e) {
        console.error('Error decoding token for Gmail auth state:', e);
        return res.status(401).json({ success: false, message: 'Unauthorized: Invalid token' });
    }

    const authorizeUrl = oAuth2Client.generateAuthUrl({
        access_type: 'offline', // Required to get refresh token
        scope: [
            'https://www.googleapis.com/auth/gmail.send',
            'https://www.googleapis.com/auth/userinfo.email'
        ],
        state: state,
        prompt: 'consent' // Force consent to ensure we get a refresh token
    });

    res.json({ url: authorizeUrl });
};

const handleGmailCallback = async (req, res) => {
    const { code, state } = req.query;
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';

    try {
        const oAuth2Client = new OAuth2Client(
            process.env.GMAIL_CLIENT_ID,
            process.env.GMAIL_CLIENT_SECRET,
            process.env.GMAIL_REDIRECT_URI
        );

        const { tokens } = await oAuth2Client.getToken(code);
        oAuth2Client.setCredentials(tokens);

        // Get user email from Google
        const ticket = await oAuth2Client.verifyIdToken({
            idToken: tokens.id_token,
            audience: process.env.GMAIL_CLIENT_ID,
        });
        const payload = ticket.getPayload();
        const gmailEmail = payload.email;

        // Find the user to update using the state (user ID)
        if (!state) {
            console.error('No state returned from Google');
            return res.redirect(`${frontendUrl}/email-settings?status=error&message=no_state`);
        }

        const user = await User.findById(state);

        if (!user) {
            console.error(`User not found for ID: ${state}`);
            return res.redirect(`${frontendUrl}/email-settings?status=error&message=user_not_found`);
        }

        user.emailSettings = {
            provider: 'gmail',
            email: gmailEmail,
            tokens: tokens,
            connectedAt: new Date()
        };
        await user.save();

        // Redirect back to frontend
        res.redirect(`${frontendUrl}/email-settings?status=success&provider=gmail`);
    } catch (error) {
        console.error('Error retrieving access token', error);
        res.redirect(`${frontendUrl}/email-settings?status=error&message=${encodeURIComponent(error.message)}`);
    }
};

// --- OUTLOOK ---

const initiateOutlookAuth = (req, res) => {
    const client = new AuthorizationCode({
        client: {
            id: process.env.OUTLOOK_CLIENT_ID,
            secret: process.env.OUTLOOK_CLIENT_SECRET,
        },
        auth: {
            tokenHost: 'https://login.microsoftonline.com',
            authorizePath: '/common/oauth2/v2.0/authorize',
            tokenPath: '/common/oauth2/v2.0/token',
        },
    });

    const state = req.query.userId || 'dev-user';

    const authorizationUri = client.authorizeURL({
        redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
        scope: 'offline_access User.Read Mail.Send',
        state: state,
    });

    res.json({ url: authorizationUri });
};

const handleOutlookCallback = async (req, res) => {
    const { code, state } = req.query;

    try {
        const client = new AuthorizationCode({
            client: {
                id: process.env.OUTLOOK_CLIENT_ID,
                secret: process.env.OUTLOOK_CLIENT_SECRET,
            },
            auth: {
                tokenHost: 'https://login.microsoftonline.com',
                authorizePath: '/common/oauth2/v2.0/authorize',
                tokenPath: '/common/oauth2/v2.0/token',
            },
        });

        const tokenParams = {
            code,
            redirect_uri: process.env.OUTLOOK_REDIRECT_URI,
            scope: 'offline_access User.Read Mail.Send',
        };

        const accessToken = await client.getToken(tokenParams);
        const tokens = accessToken.token;

        // Get user email from Graph API
        const userResponse = await fetch('https://graph.microsoft.com/v1.0/me', {
            headers: { Authorization: `Bearer ${tokens.access_token}` }
        });
        const userData = await userResponse.json();
        const outlookEmail = userData.mail || userData.userPrincipalName;

        let user;
        if (state && state !== 'dev-user') {
            user = await User.findById(state);
        } else {
            user = await User.findOne({ userType: { $in: ['admin', 'superadmin'] } });
        }

        if (user) {
            user.emailSettings = {
                provider: 'outlook',
                email: outlookEmail,
                tokens: tokens,
                connectedAt: new Date()
            };
            await user.save();
        }

        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/email-settings?status=success&provider=outlook`);
    } catch (error) {
        console.error('Error retrieving Outlook token', error);
        const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
        res.redirect(`${frontendUrl}/email-settings?status=error`);
    }
};

// --- SMTP ---

const saveSmtpSettings = async (req, res) => {
    const { host, port, username, password, fromEmail } = req.body;

    // Get user from token (middleware should handle this, but we'll check manually here for safety)
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user) return res.status(404).json({ success: false, message: 'User not found' });

        // Verify SMTP connection
        const transporter = nodemailer.createTransport({
            host,
            port,
            secure: port === 465, // true for 465, false for other ports
            auth: {
                user: username,
                pass: password,
            },
        });

        await transporter.verify();

        user.emailSettings = {
            provider: 'smtp',
            email: fromEmail || username,
            config: { host, port, username, password }, // In prod, encrypt password!
            connectedAt: new Date()
        };
        await user.save();

        res.json({ success: true, message: 'SMTP connected successfully' });
    } catch (error) {
        console.error('SMTP Error:', error);
        res.status(400).json({ success: false, message: 'Failed to verify SMTP settings: ' + error.message });
    }
};

// --- SHARED ---

const getEmailStatus = async (req, res) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user || !user.emailSettings || !user.emailSettings.provider) {
            return res.json({ connected: false });
        }

        res.json({
            connected: true,
            provider: user.emailSettings.provider,
            email: user.emailSettings.email
        });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

const trackEmailOpen = async (req, res) => {
    const { id } = req.params;

    try {
        const emailLog = await EmailLog.findById(id);
        if (emailLog && emailLog.status !== 'Opened') {
            emailLog.status = 'Opened';
            emailLog.openedAt = new Date();
            await emailLog.save();
        }

        // Return a 1x1 transparent GIF
        const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': img.length,
        });
        res.end(img);
    } catch (error) {
        console.error('Error tracking email open:', error);
        // Still return the image to avoid broken image icon in email
        const img = Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64');
        res.writeHead(200, {
            'Content-Type': 'image/gif',
            'Content-Length': img.length,
        });
        res.end(img);
    }
};

const sendEmail = async (req, res) => {
    const { to, subject, body } = req.body;
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
        const user = await User.findById(decoded.id);

        if (!user || !user.emailSettings || !user.emailSettings.provider) {
            return res.status(400).json({ success: false, message: 'Email not connected' });
        }

        const { provider, tokens, config, email } = user.emailSettings;

        if (!email) {
            return res.status(400).json({ success: false, message: 'Email address not found in settings. Please reconnect your account.' });
        }

        // Create initial log entry to get ID
        let emailLog;
        try {
            const investor = await Investor.findOne({ email: to });
            emailLog = await EmailLog.create({
                userId: user._id,
                investorId: investor ? investor._id : null,
                recipient: to,
                subject,
                body, // Store original body
                status: 'Sent',
                provider: provider,
                sentAt: new Date()
            });
        } catch (logError) {
            console.error('Error creating initial email log:', logError);
            // If we can't log, we probably shouldn't fail the send, but tracking won't work
        }

        // Prepare HTML body with tracking pixel
        const trackingUrl = `${process.env.API_BASE_URL || 'http://localhost:5001/api'}/email/track/${emailLog ? emailLog._id : 'unknown'}`;
        const trackingPixel = `<img src="${trackingUrl}" width="1" height="1" style="display:none;" alt="" />`;
        // Convert newlines to <br> for HTML email if body is plain text
        const htmlBody = body.replace(/\n/g, '<br>') + trackingPixel;

        if (provider === 'gmail') {
            try {
                const oAuth2Client = new OAuth2Client(
                    process.env.GMAIL_CLIENT_ID,
                    process.env.GMAIL_CLIENT_SECRET,
                    process.env.GMAIL_REDIRECT_URI
                );

                // Set the credentials from the DB
                // Ensure we have the refresh token for auto-refreshing
                oAuth2Client.setCredentials(tokens);

                const gmail = google.gmail({ version: 'v1', auth: oAuth2Client });

                // Create raw email
                // Note: simple text/plain construction as per user's working snippet
                const messageParts = [
                    `To: ${to}`,
                    'Content-Type: text/html; charset=utf-8',
                    'MIME-Version: 1.0',
                    `Subject: ${subject}`,
                    '',
                    htmlBody
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

                console.log(`[SendEmail] Email sent successfully via Gmail API to ${to}`);

                res.json({ success: true, message: 'Email sent successfully' });
            } catch (gmailError) {
                console.error('Gmail API Error:', gmailError);
                // Handle token expiry specifically if possible, but generic error for now
                if (gmailError.code === 401 || (gmailError.response && gmailError.response.status === 401)) {
                    return res.status(401).json({ success: false, message: 'Email authentication failed. Please reconnect your email account.' });
                }
                throw gmailError;
            }

        } else if (provider === 'outlook') {
            // Outlook logic using Graph API (kept from previous robust version)
            const client = new AuthorizationCode({
                client: { id: process.env.OUTLOOK_CLIENT_ID, secret: process.env.OUTLOOK_CLIENT_SECRET },
                auth: { tokenHost: 'https://login.microsoftonline.com', tokenPath: '/common/oauth2/v2.0/token' }
            });

            let accessToken = tokens.access_token;
            const tokenObj = client.createToken(tokens);

            if (tokenObj.expired()) {
                try {
                    const refreshedParams = await tokenObj.refresh();
                    accessToken = refreshedParams.token.access_token;
                    // Update user tokens
                    user.emailSettings.tokens = refreshedParams.token;
                    await user.save();
                } catch (refreshError) {
                    console.error('Error refreshing Outlook token', refreshError);
                    return res.status(401).json({ success: false, message: 'Email connection expired. Please reconnect.' });
                }
            }

            const sendMail = {
                message: {
                    subject: subject,
                    body: {
                        contentType: "HTML",
                        content: htmlBody
                    },
                    toRecipients: [
                        { emailAddress: { address: to } }
                    ]
                },
                saveToSentItems: "true"
            };

            await fetch('https://graph.microsoft.com/v1.0/me/sendMail', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(sendMail)
            });

            return res.json({ success: true, message: 'Email sent successfully via Outlook' });

        } else if (provider === 'smtp') {
            const transporter = nodemailer.createTransport({
                host: config.host,
                port: config.port,
                secure: config.port === 465,
                auth: {
                    user: config.username,
                    pass: config.password,
                },
            });

            await transporter.sendMail({
                from: email,
                to,
                subject,
                html: htmlBody,
            });
            console.log(`[SendEmail] Email sent successfully to ${to}`);

            res.json({ success: true, message: 'Email sent successfully' });
        }

    } catch (error) {
        console.error('Error sending email:', error);
        // Check for specific SMTP auth errors
        if (error.responseCode === 535) {
            return res.status(401).json({ success: false, message: 'Email authentication failed. Please reconnect your email account.' });
        }
        res.status(500).json({ success: false, message: 'Failed to send email: ' + error.message });
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
    initiateOutlookAuth,
    handleOutlookCallback,
    saveSmtpSettings,
    getEmailStatus,
    sendEmail,
    trackEmailOpen,
    login,
    signup
};
