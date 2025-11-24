// backend/admin/controllers/userManagementController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const { exportUsersToExcel, exportSubscriptionsToExcel } = require('../utils/dataExport');

/**
 * Get all users with filtering and pagination
 */
const getAllUsers = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            search = '',
            subscriptionPlan = '',
            subscriptionStatus = '',
            accountStatus = '',
            userType = '',
            startDate = '',
            endDate = ''
        } = req.query;

        // Build filter query
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        if (subscriptionPlan) {
            filter.subscriptionPlan = subscriptionPlan;
        }

        if (subscriptionStatus) {
            filter.subscriptionStatus = subscriptionStatus;
        }

        if (accountStatus) {
            filter.accountStatus = accountStatus;
        }

        if (userType) {
            filter.userType = userType;
        }

        if (startDate || endDate) {
            filter.signupDate = {};
            if (startDate) filter.signupDate.$gte = new Date(startDate);
            if (endDate) filter.signupDate.$lte = new Date(endDate);
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [users, total] = await Promise.all([
            User.find(filter)
                .select('-password')
                .sort({ signupDate: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            User.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: users,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch users',
            error: error.message
        });
    }
};

/**
 * Get detailed user information
 */
const getUserDetails = async (req, res) => {
    try {
        const { id } = req.params;

        const user = await User.findById(id).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get user's subscription
        const subscription = await Subscription.findOne({ userId: id });

        // Get user activity (if implemented)
        // const activity = await UserActivity.find({ userId: id }).limit(10);

        res.json({
            success: true,
            data: {
                user,
                subscription,
                // activity
            }
        });

    } catch (error) {
        console.error('Get user details error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch user details',
            error: error.message
        });
    }
};

/**
 * Update user status (activate/suspend)
 */
const updateUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { accountStatus } = req.body;

        if (!['active', 'suspended', 'deleted'].includes(accountStatus)) {
            return res.status(400).json({
                success: false,
                message: 'Invalid account status'
            });
        }

        const user = await User.findByIdAndUpdate(
            id,
            { accountStatus },
            { new: true }
        ).select('-password');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        res.json({
            success: true,
            message: `User ${accountStatus} successfully`,
            data: user
        });

    } catch (error) {
        console.error('Update user status error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update user status',
            error: error.message
        });
    }
};

/**
 * Get all subscriptions with filtering and pagination
 */
const getAllSubscriptions = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            plan = '',
            status = '',
            search = ''
        } = req.query;

        // Build filter query
        const filter = {};

        if (plan) {
            filter.plan = plan;
        }

        if (status) {
            filter.status = status;
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [subscriptions, total] = await Promise.all([
            Subscription.find(filter)
                .populate('userId', 'name email')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            Subscription.countDocuments(filter)
        ]);

        // Apply search filter on populated user data if needed
        let filteredSubs = subscriptions;
        if (search) {
            filteredSubs = subscriptions.filter(sub => {
                const userName = sub.userId?.name?.toLowerCase() || '';
                const userEmail = sub.userId?.email?.toLowerCase() || '';
                const searchLower = search.toLowerCase();
                return userName.includes(searchLower) || userEmail.includes(searchLower);
            });
        }

        res.json({
            success: true,
            data: filteredSubs,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch subscriptions',
            error: error.message
        });
    }
};

/**
 * Update subscription
 */
const updateSubscription = async (req, res) => {
    try {
        const { id } = req.params;

        const subscription = await Subscription.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        ).populate('userId', 'name email');

        if (!subscription) {
            return res.status(404).json({
                success: false,
                message: 'Subscription not found'
            });
        }

        // Also update user's subscription fields
        if (subscription.userId) {
            await User.findByIdAndUpdate(subscription.userId._id, {
                subscriptionPlan: subscription.plan,
                subscriptionStatus: subscription.status
            });
        }

        res.json({
            success: true,
            message: 'Subscription updated successfully',
            data: subscription
        });

    } catch (error) {
        console.error('Update subscription error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update subscription',
            error: error.message
        });
    }
};

/**
 * Get revenue analytics
 */
const getRevenueAnalytics = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        // Build date filter
        const dateFilter = {};
        if (startDate) dateFilter.$gte = new Date(startDate);
        if (endDate) dateFilter.$lte = new Date(endDate);

        const filter = Object.keys(dateFilter).length > 0 ? { createdAt: dateFilter } : {};

        // Get active subscriptions
        const activeSubscriptions = await Subscription.find({
            ...filter,
            status: 'active'
        });

        // Calculate MRR (Monthly Recurring Revenue)
        const mrr = activeSubscriptions.reduce((sum, sub) => {
            return sum + (sub.amount || 0);
        }, 0);

        // Calculate ARR (Annual Recurring Revenue)
        const arr = mrr * 12;

        // Get subscription breakdown by plan
        const planBreakdown = await Subscription.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$plan',
                    count: { $sum: 1 },
                    revenue: { $sum: '$amount' }
                }
            }
        ]);

        // Calculate churn rate (cancelled subscriptions in last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const [totalSubs, cancelledSubs] = await Promise.all([
            Subscription.countDocuments({ createdAt: { $lte: thirtyDaysAgo } }),
            Subscription.countDocuments({
                status: 'cancelled',
                updatedAt: { $gte: thirtyDaysAgo }
            })
        ]);

        const churnRate = totalSubs > 0 ? ((cancelledSubs / totalSubs) * 100).toFixed(2) : 0;

        // Get recent transactions
        const recentTransactions = await Subscription.find({
            'billingHistory.0': { $exists: true }
        })
            .populate('userId', 'name email')
            .sort({ 'billingHistory.date': -1 })
            .limit(10)
            .select('userId plan billingHistory');

        res.json({
            success: true,
            data: {
                mrr,
                arr,
                churnRate: parseFloat(churnRate),
                activeSubscriptions: activeSubscriptions.length,
                planBreakdown,
                recentTransactions: recentTransactions.map(sub => {
                    const latestTransaction = sub.billingHistory[sub.billingHistory.length - 1];
                    return {
                        user: sub.userId,
                        plan: sub.plan,
                        amount: latestTransaction?.amount,
                        date: latestTransaction?.date,
                        status: latestTransaction?.status
                    };
                })
            }
        });

    } catch (error) {
        console.error('Get revenue analytics error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch revenue analytics',
            error: error.message
        });
    }
};

/**
 * Export users to Excel
 */
const exportUsers = async (req, res) => {
    try {
        const users = await User.find({}).select('-password');

        const excelBuffer = await exportUsersToExcel(users);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=users_export.xlsx');
        res.send(excelBuffer);

    } catch (error) {
        console.error('Export users error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export users',
            error: error.message
        });
    }
};

/**
 * Export subscriptions to Excel
 */
const exportSubscriptions = async (req, res) => {
    try {
        const subscriptions = await Subscription.find({}).populate('userId', 'name email');

        const excelBuffer = await exportSubscriptionsToExcel(subscriptions);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=subscriptions_export.xlsx');
        res.send(excelBuffer);

    } catch (error) {
        console.error('Export subscriptions error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export subscriptions',
            error: error.message
        });
    }
};

module.exports = {
    getAllUsers,
    getUserDetails,
    updateUserStatus,
    getAllSubscriptions,
    updateSubscription,
    getRevenueAnalytics,
    exportUsers,
    exportSubscriptions
};
