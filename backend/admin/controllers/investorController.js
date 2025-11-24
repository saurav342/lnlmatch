// backend/admin/controllers/investorController.js
const Investor = require('../models/Investor');
const { parseInvestorsExcel, generateInvestorTemplate } = require('../utils/excelParser');
const { exportInvestorsToExcel } = require('../utils/dataExport');

/**
 * Upload and parse Excel file with investors data
 */
const uploadInvestorsExcel = async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({
                success: false,
                message: 'No file uploaded'
            });
        }

        // Parse Excel file
        const parseResult = parseInvestorsExcel(req.file.buffer);

        if (!parseResult.success || parseResult.data.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Failed to parse Excel file',
                errors: parseResult.errors,
                stats: {
                    totalRows: parseResult.totalRows,
                    validRows: parseResult.validRows,
                    invalidRows: parseResult.invalidRows
                }
            });
        }

        // Add createdBy field to all investors
        const investorsToInsert = parseResult.data.map(inv => ({
            ...inv,
            createdBy: req.user?.id
        }));

        // Insert into database
        // Use insertMany with ordered: false to continue on duplicate key errors
        const insertResult = await Investor.insertMany(investorsToInsert, {
            ordered: false
        }).catch(err => {
            // Handle duplicate email errors
            if (err.code === 11000 || err.name === 'BulkWriteError') {
                return {
                    insertedCount: err.result?.nInserted || 0,
                    duplicates: err.writeErrors?.length || 0
                };
            }
            throw err;
        });

        const insertedCount = insertResult.insertedCount || insertResult.length || 0;
        const duplicates = insertResult.duplicates || 0;

        res.json({
            success: true,
            message: 'Investors imported successfully',
            stats: {
                totalRows: parseResult.totalRows,
                validRows: parseResult.validRows,
                invalidRows: parseResult.invalidRows,
                inserted: insertedCount,
                duplicates: duplicates,
                errors: parseResult.errors
            }
        });

    } catch (error) {
        console.error('Excel upload error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to process Excel file',
            error: error.message
        });
    }
};

/**
 * Get all investors with filtering and pagination
 */
const getInvestors = async (req, res) => {
    try {
        const {
            page = 1,
            limit = 50,
            search = '',
            industry = '',
            location = '',
            source = '',
            isActive = '',
            isVerified = ''
        } = req.query;

        // Build filter query
        const filter = {};

        if (search) {
            filter.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { company: { $regex: search, $options: 'i' } }
            ];
        }

        if (industry) {
            filter.industries = { $in: [industry] };
        }

        if (location) {
            filter.location = { $regex: location, $options: 'i' };
        }

        if (source) {
            filter.source = source;
        }

        if (isActive !== '') {
            filter.isActive = isActive === 'true';
        }

        if (isVerified !== '') {
            filter.isVerified = isVerified === 'true';
        }

        // Execute query with pagination
        const skip = (parseInt(page) - 1) * parseInt(limit);

        const [investors, total] = await Promise.all([
            Investor.find(filter)
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(parseInt(limit))
                .populate('createdBy', 'name email'),
            Investor.countDocuments(filter)
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
        console.error('Get investors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch investors',
            error: error.message
        });
    }
};

/**
 * Create a single investor manually
 */
const createInvestor = async (req, res) => {
    try {
        const investorData = {
            ...req.body,
            source: 'manual',
            createdBy: req.user?.id
        };

        const investor = await Investor.create(investorData);

        res.status(201).json({
            success: true,
            message: 'Investor created successfully',
            data: investor
        });

    } catch (error) {
        console.error('Create investor error:', error);

        if (error.code === 11000) {
            return res.status(400).json({
                success: false,
                message: 'Investor with this email already exists'
            });
        }

        res.status(500).json({
            success: false,
            message: 'Failed to create investor',
            error: error.message
        });
    }
};

/**
 * Update investor
 */
const updateInvestor = async (req, res) => {
    try {
        const { id } = req.params;

        const investor = await Investor.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }

        res.json({
            success: true,
            message: 'Investor updated successfully',
            data: investor
        });

    } catch (error) {
        console.error('Update investor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update investor',
            error: error.message
        });
    }
};

/**
 * Delete investor (soft delete by setting isActive to false)
 */
const deleteInvestor = async (req, res) => {
    try {
        const { id } = req.params;

        const investor = await Investor.findByIdAndUpdate(
            id,
            { isActive: false },
            { new: true }
        );

        if (!investor) {
            return res.status(404).json({
                success: false,
                message: 'Investor not found'
            });
        }

        res.json({
            success: true,
            message: 'Investor deleted successfully'
        });

    } catch (error) {
        console.error('Delete investor error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete investor',
            error: error.message
        });
    }
};

/**
 * Bulk delete investors
 */
const bulkDeleteInvestors = async (req, res) => {
    try {
        const { ids } = req.body;

        if (!ids || !Array.isArray(ids) || ids.length === 0) {
            return res.status(400).json({
                success: false,
                message: 'Investor IDs array is required'
            });
        }

        const result = await Investor.updateMany(
            { _id: { $in: ids } },
            { isActive: false }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} investors deleted successfully`,
            count: result.modifiedCount
        });

    } catch (error) {
        console.error('Bulk delete error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to delete investors',
            error: error.message
        });
    }
};

/**
 * Export investors to Excel
 */
const exportInvestors = async (req, res) => {
    try {
        const investors = await Investor.find({ isActive: true });

        const excelBuffer = await exportInvestorsToExcel(investors);

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=investors_export.xlsx');
        res.send(excelBuffer);

    } catch (error) {
        console.error('Export investors error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to export investors',
            error: error.message
        });
    }
};

/**
 * Download Excel template
 */
const downloadTemplate = (req, res) => {
    try {
        const templateBuffer = generateInvestorTemplate();

        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=investors_template.xlsx');
        res.send(templateBuffer);

    } catch (error) {
        console.error('Template download error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to generate template',
            error: error.message
        });
    }
};

module.exports = {
    uploadInvestorsExcel,
    getInvestors,
    createInvestor,
    updateInvestor,
    deleteInvestor,
    bulkDeleteInvestors,
    exportInvestors,
    downloadTemplate
};
