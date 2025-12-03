// backend/admin/controllers/adminController.js
const User = require('../models/User');
const Subscription = require('../models/Subscription');
const Investor = require('../models/Investor');
const AdminActivity = require('../models/AdminActivity');
const PotentialInvestor = require('../models/PotentialInvestor');

/**
 * Get potential investors with pagination
 */
const getPotentialInvestors = async (req, res) => {
    try {
        const { page = 1, limit = 50, search = '', status = 'pending', batch = 'P1' } = req.query;
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const query = { status, batch };
        if (search) {
            query.$or = [
                { companyName: { $regex: search, $options: 'i' } },
                { firstName: { $regex: search, $options: 'i' } },
                { lastName: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } }
            ];
        }

        const [investors, total] = await Promise.all([
            PotentialInvestor.find(query)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit)),
            PotentialInvestor.countDocuments(query)
        ]);

        res.json({
            success: true,
            data: investors,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                total,
                pages: Math.ceil(total / parseInt(limit))
            }
        });
    } catch (error) {
        console.error('Get potential investors error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch potential investors' });
    }
};

/**
 * Get potential investor details
 */
const getPotentialInvestorDetails = async (req, res) => {
    try {
        const investor = await PotentialInvestor.findById(req.params.id);
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Potential investor not found' });
        }
        res.json({ success: true, data: investor });
    } catch (error) {
        console.error('Get potential investor details error:', error);
        res.status(500).json({ success: false, message: 'Failed to fetch details' });
    }
};

/**
 * Update potential investor
 */
const updatePotentialInvestor = async (req, res) => {
    try {
        const investor = await PotentialInvestor.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Potential investor not found' });
        }
        res.json({ success: true, data: investor });
    } catch (error) {
        console.error('Update potential investor error:', error);
        res.status(500).json({ success: false, message: 'Failed to update potential investor' });
    }
};

/**
 * Approve potential investor
 */
const approvePotentialInvestor = async (req, res) => {
    try {
        const potentialInvestor = await PotentialInvestor.findById(req.params.id);
        if (!potentialInvestor) {
            return res.status(404).json({ success: false, message: 'Potential investor not found' });
        }

        // Map to Investor model
        const newInvestor = new Investor({
            name: `${potentialInvestor.firstName} ${potentialInvestor.lastName}`.trim(),
            email: potentialInvestor.email,
            company: potentialInvestor.companyName,
            websiteUrl: potentialInvestor.website,
            linkedinUrl: potentialInvestor.personLinkedinUrl,
            notes: potentialInvestor.notes,
            type: 'Institutional', // Defaulting to Institutional based on CSV data usually being VCs
            source: 'excel-import',
            isActive: true,
            isVerified: true,
            // Map other fields as best as possible
            industries: potentialInvestor.industry ? [potentialInvestor.industry] : [],
            investmentStage: potentialInvestor.stageOfInvestment ? potentialInvestor.stageOfInvestment.split(',').map(s => s.trim()) : []
        });

        await newInvestor.save();

        // Delete from PotentialInvestor
        await PotentialInvestor.findByIdAndDelete(req.params.id);

        res.json({ success: true, message: 'Investor approved and moved to main list', data: newInvestor });
    } catch (error) {
        console.error('Approve potential investor error:', error);
        res.status(500).json({ success: false, message: 'Failed to approve investor' });
    }
};

/**
 * Reject potential investor
 */
const rejectPotentialInvestor = async (req, res) => {
    try {
        const investor = await PotentialInvestor.findByIdAndUpdate(
            req.params.id,
            { status: 'rejected' },
            { new: true }
        );
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Potential investor not found' });
        }
        res.json({ success: true, message: 'Potential investor moved to rejected list', data: investor });
    } catch (error) {
        console.error('Reject potential investor error:', error);
        res.status(500).json({ success: false, message: 'Failed to reject investor' });
    }
};

/**
 * Delete potential investor permanently
 */
const deletePotentialInvestor = async (req, res) => {
    try {
        const investor = await PotentialInvestor.findByIdAndDelete(req.params.id);
        if (!investor) {
            return res.status(404).json({ success: false, message: 'Potential investor not found' });
        }
        res.json({ success: true, message: 'Potential investor deleted permanently' });
    } catch (error) {
        console.error('Delete potential investor error:', error);
        res.status(500).json({ success: false, message: 'Failed to delete investor' });
    }
};

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
    getSystemHealth,
    getPotentialInvestors,
    getPotentialInvestorDetails,
    updatePotentialInvestor,
    approvePotentialInvestor,
    approvePotentialInvestor,
    rejectPotentialInvestor,
    deletePotentialInvestor
};
