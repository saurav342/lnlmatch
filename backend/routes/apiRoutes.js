// backend/routes/apiRoutes.js
const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getInvestors,
    getGrants,
    getCampaigns,
    getUserProfile,
    initiateGmailAuth,
    handleGmailCallback,
    getEmailStatus,
} = require('../controllers/mainController');

router.get('/dashboard/stats', getDashboardStats);
router.get('/investors', getInvestors);
router.get('/grants', getGrants);
router.get('/crm/campaigns', getCampaigns);
router.get('/user/profile', getUserProfile);

// Email Connection Routes
router.get('/auth/google', initiateGmailAuth);
router.get('/auth/google/callback', handleGmailCallback);

router.get('/auth/outlook', require('../controllers/mainController').initiateOutlookAuth);
router.get('/auth/outlook/callback', require('../controllers/mainController').handleOutlookCallback);

// Authentication Routes
router.post('/auth/login', require('../controllers/mainController').login);
router.post('/auth/signup', require('../controllers/mainController').signup);

router.post('/email/connect/outlook', (req, res) => {
    // This might be a legacy route or a direct post if not using OAuth flow?
    // Based on the UI, it's likely an OAuth flow, so we use the GET routes above.
    // We'll keep this for now but it might be unused if we switch to OAuth.
    res.json({ success: true, message: 'Please use /auth/outlook for OAuth connection' });
});
router.post('/email/connect/smtp', require('../controllers/mainController').saveSmtpSettings);
router.get('/email/status', getEmailStatus);
router.post('/email/send', require('../controllers/mainController').sendEmail);

module.exports = router;
