// backend/admin/routes/adminRoutes.js
const express = require('express');
const router = express.Router();

const { verifyAdmin, verifySuperAdmin, logAdminActivity } = require('../middleware/adminAuth');
const { uploadSingleExcel, handleUploadError } = require('../middleware/uploadMiddleware');

const adminController = require('../controllers/adminController');
const investorController = require('../controllers/investorController');
const userManagementController = require('../controllers/userManagementController');
const investorUploadController = require('../controllers/investorUploadController');

// Apply admin authentication to all routes
router.use(verifyAdmin);

// ============================================
// Dashboard Routes
// ============================================
router.get('/dashboard/stats', adminController.getDashboardStats);

// Activity Log - Superadmin Only
router.get('/dashboard/activity-log', verifySuperAdmin, adminController.getActivityLog);

router.get('/system/health', adminController.getSystemHealth);

// ============================================
// User Management Routes
// ============================================
router.get(
    '/users',
    logAdminActivity('view_users', 'user'),
    userManagementController.getAllUsers
);

router.get(
    '/users/:id',
    logAdminActivity('view_user_details', 'user'),
    userManagementController.getUserDetails
);

router.patch(
    '/users/:id/status',
    logAdminActivity('update_user_status', 'user'),
    userManagementController.updateUserStatus
);

router.get(
    '/users/export',
    logAdminActivity('export_users', 'data'),
    userManagementController.exportUsers
);

// ============================================
// Subscription Management Routes
// ============================================
router.get(
    '/subscriptions',
    logAdminActivity('view_subscriptions', 'subscription'),
    userManagementController.getAllSubscriptions
);

router.patch(
    '/subscriptions/:id',
    logAdminActivity('update_subscription', 'subscription'),
    userManagementController.updateSubscription
);

router.get(
    '/subscriptions/export',
    logAdminActivity('export_subscriptions', 'data'),
    userManagementController.exportSubscriptions
);

router.get(
    '/revenue/analytics',
    logAdminActivity('view_revenue_analytics', 'data'),
    userManagementController.getRevenueAnalytics
);

// ============================================
// Investor Management Routes
// ============================================
router.get(
    '/investors',
    logAdminActivity('view_investors', 'investor'),
    investorController.getInvestors
);

router.post(
    '/investors',
    logAdminActivity('create_investor', 'investor'),
    investorController.createInvestor
);

router.patch(
    '/investors/:id',
    logAdminActivity('update_investor', 'investor'),
    investorController.updateInvestor
);

router.delete(
    '/investors/:id',
    logAdminActivity('delete_investor', 'investor'),
    investorController.deleteInvestor
);

router.post(
    '/investors/bulk-delete',
    logAdminActivity('bulk_delete_investors', 'investor'),
    investorController.bulkDeleteInvestors
);

router.get(
    '/investors/export',
    logAdminActivity('export_investors', 'data'),
    investorController.exportInvestors
);

router.get(
    '/investors/template',
    investorController.downloadTemplate
);

// New route for investor upload (Custom for specific Excel format)
router.post(
    '/investors/upload',
    uploadSingleExcel,
    handleUploadError,
    logAdminActivity('upload_investors_file', 'investor'),
    investorUploadController.uploadInvestors
);

// Excel Upload Route (with special handling)
router.post(
    '/investors/upload-excel',
    uploadSingleExcel,
    handleUploadError,
    logAdminActivity('upload_investors_excel', 'investor'),
    investorController.uploadInvestorsExcel
);

// ============================================
// Potential Investor Processing Routes
// ============================================
router.get(
    '/potential-investors',
    logAdminActivity('view_potential_investors', 'potential_investor'),
    adminController.getPotentialInvestors
);

router.get(
    '/potential-investors/:id',
    logAdminActivity('view_potential_investor_details', 'potential_investor'),
    adminController.getPotentialInvestorDetails
);

router.put(
    '/potential-investors/:id',
    logAdminActivity('update_potential_investor', 'potential_investor'),
    adminController.updatePotentialInvestor
);

router.post(
    '/potential-investors/:id/approve',
    adminController.approvePotentialInvestor
);

router.post(
    '/potential-investors/:id/reject',
    adminController.rejectPotentialInvestor
);

// ============================================
// Potential Investor Processing V2 Routes
// ============================================
router.get(
    '/potential-investors-v2',
    logAdminActivity('view_potential_investors_v2', 'potential_investor_v2'),
    adminController.getPotentialInvestorsV2
);

router.get(
    '/potential-investors-v2/:id',
    logAdminActivity('view_potential_investor_details_v2', 'potential_investor_v2'),
    adminController.getPotentialInvestorDetailsV2
);

router.put(
    '/potential-investors-v2/:id',
    logAdminActivity('update_potential_investor_v2', 'potential_investor_v2'),
    adminController.updatePotentialInvestorV2
);

router.post(
    '/potential-investors-v2/:id/approve',
    adminController.approvePotentialInvestorV2
);

router.post(
    '/potential-investors-v2/:id/reject',
    adminController.rejectPotentialInvestorV2
);
module.exports = router;
