// backend/admin/controllers/adminController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Investor = require('../models/Investor');
const AdminActivity = require('../models/AdminActivity');

/**
 * Get dashboard statistics
 */
const getDashboardStats = async (req, res) => {
    try {
        // Get counts
        const [
            totalUsers,
            activeUsers,
            totalSubscriptions,
            activeSubscriptions,
            totalInvestors,
            verifiedInvestors
        ] = await Promise.all([
            User.countDocuments(),
            User.countDocuments({ accountStatus: 'active' }),
            Subscription.countDocuments(),
            Subscription.countDocuments({ status: 'active' }),
            Investor.countDocuments(),
            Investor.countDocuments({ isVerified: true })
        ]);

        // Calculate MRR
        const activeSubs = await Subscription.find({ status: 'active' });
        const mrr = activeSubs.reduce((sum, sub) => sum + (sub.amount || 0), 0);
        const arr = mrr * 12;

        // Get subscription breakdown
        const subscriptionBreakdown = await Subscription.aggregate([
            { $match: { status: 'active' } },
            {
                $group: {
                    _id: '$plan',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent signups (last 30 days)
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const recentSignups = await User.countDocuments({
            signupDate: { $gte: thirtyDaysAgo }
        });

        // Get signup trend (last 7 days)
        const signupTrend = await User.aggregate([
            {
                $match: {
                    signupDate: { $gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$signupDate' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get recent activity
        const recentActivity = await AdminActivity.find()
            .sort({ timestamp: -1 })
            .limit(10)
            .populate('adminId', 'name email');

        // Get user type breakdown
        const userTypeBreakdown = await User.aggregate([
            {
                $group: {
                    _id: '$userType',
                    count: { $sum: 1 }
                }
            }
        ]);

        // Get recent signups list (for the table)
        const recentSignupsList = await User.find()
            .sort({ signupDate: -1 })
            .limit(5)
            .select('name email userType accountStatus signupDate');

        res.json({
            success: true,
            data: {
                overview: {
                    totalUsers,
                    activeUsers,
                    totalSubscriptions,
                    activeSubscriptions,
                    totalInvestors,
                    verifiedInvestors,
                    mrr,
                    arr,
                    recentSignupsCount: recentSignups // Renamed to avoid conflict
                },
                subscriptionBreakdown,
                userTypeBreakdown,
                signupTrend,
                recentSignupsList,
                recentActivity
            }
        });

    } catch (error) {
        console.error('Get dashboard stats error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch dashboard statistics',
            error: error.message
        });
    }
};

/**
 * Get activity log with pagination
 */
const getActivityLog = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            action = '',
            targetType = '',
            adminId = ''
        } = req.query;

        // Build filter
        const filter = {};
        if (action) filter.action = action;
        if (targetType) filter.targetType = targetType;
        if (adminId) filter.adminId = adminId;

        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [activities, total] = await Promise.all([
            AdminActivity.find(filter)
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('adminId', 'name email'),
            AdminActivity.countDocuments(filter)
        ]);

        res.json({
            success: true,
            data: activities,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });

    } catch (error) {
        console.error('Get activity log error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch activity log',
            error: error.message
        });
    }
};

/**
 * Get system health metrics
 */
const getSystemHealth = async (req, res) => {
    try {
        // Database connection status
        const mongoose = require('mongoose');
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

        // Get database stats
        const collections = await mongoose.connection.db.collections();
        const collectionStats = await Promise.all(
            collections.map(async (col) => {
                const stats = await col.stats();
                return {
                    name: col.collectionName,
                    count: stats.count,
                    size: stats.size,
                    avgObjSize: stats.avgObjSize
                };
            })
        );

        res.json({
            success: true,
            data: {
                database: {
                    status: dbStatus,
                    collections: collectionStats
                },
                server: {
                    uptime: process.uptime(),
                    memory: process.memoryUsage(),
                    nodeVersion: process.version
                }
            }
        });

    } catch (error) {
        console.error('Get system health error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch system health',
            error: error.message
        });
    }
};

module.exports = {
    getDashboardStats,
    getActivityLog,
    getSystemHealth
};
