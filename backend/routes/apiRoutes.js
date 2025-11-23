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

// Authentication Routes
router.post('/auth/login', require('../controllers/mainController').login);
router.post('/auth/signup', require('../controllers/mainController').signup);

router.post('/email/connect/outlook', (req, res) => {
    res.json({ success: true, message: 'Outlook connection initiated' });
});
router.post('/email/connect/smtp', (req, res) => {
    res.json({ success: true, message: 'SMTP configuration saved' });
});
router.get('/email/status', getEmailStatus);
router.post('/email/send', require('../controllers/mainController').sendEmail);

module.exports = router;
