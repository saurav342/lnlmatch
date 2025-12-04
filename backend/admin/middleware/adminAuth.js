// backend/admin/middleware/adminAuth.js
const jwt = require('jsonwebtoken');
const User = require('../models/User');

/**
 * Middleware to verify admin authentication
 * Checks if user is authenticated and has admin role
 */
const verifyAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Get user from DB
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is admin or superadmin
        if (user.userType !== 'admin' && user.userType !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin privileges required.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

/**
 * Middleware to log admin activities
 */
const logAdminActivity = (action, targetType) => {
    return async (req, res, next) => {
        // Store original send function
        const originalSend = res.send;

        // Override send function to log after response
        res.send = function (data) {
            // Log activity if response was successful
            if (res.statusCode < 400) {
                const AdminActivity = require('../models/AdminActivity');

                AdminActivity.create({
                    adminId: req.user?.id || null,
                    action,
                    targetType,
                    targetId: req.params?.id || null,
                    metadata: {
                        method: req.method,
                        path: req.path,
                        body: req.body,
                        query: req.query
                    },
                    ipAddress: req.ip || req.connection.remoteAddress,
                    userAgent: req.headers['user-agent'],
                    status: 'success'
                }).catch(err => {
                    console.error('Failed to log admin activity:', err);
                });
            }

            // Call original send
            originalSend.call(this, data);
        };

        next();
    };
};

/**
 * Middleware to verify superadmin authentication
 * Only allows superadmin users to access certain features
 */
const verifySuperAdmin = async (req, res, next) => {
    try {
        // Get token from Authorization header
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.'
            });
        }

        const token = authHeader.split(' ')[1];

        // Verify token
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');

        // Get user from DB
        const user = await User.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        // Check if user is superadmin
        if (user.userType !== 'superadmin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Superadmin privileges required.'
            });
        }

        req.user = user;
        next();
    } catch (error) {
        console.error('Auth error:', error.message);
        return res.status(401).json({
            success: false,
            message: 'Invalid or expired token'
        });
    }
};

module.exports = {
    verifyAdmin,
    verifySuperAdmin,
    logAdminActivity
};
