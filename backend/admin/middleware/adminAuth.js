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

        // For now, we'll use a simple token check
        // In production, you should use proper JWT verification
        if (!token || !token.startsWith('mock-jwt-token-')) {
            return res.status(401).json({
                success: false,
                message: 'Invalid token'
            });
        }

        // In a real implementation, decode JWT and get user ID
        // const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // const user = await User.findById(decoded.userId);

        // For now, we'll check if user exists in the in-memory store
        // This is a temporary solution - in production use proper DB lookup

        // Allow access for development
        // TODO: Implement proper admin role checking
        req.user = {
            id: 'admin-user',
            userType: 'admin',
            email: 'admin@capify.com'
        };

        next();
    } catch (error) {
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

module.exports = {
    verifyAdmin,
    logAdminActivity
};
