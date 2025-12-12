/**
 * Migration Script: PotentialInvestorV2 BSON -> Investor Collection
 * 
 * This script reads the potentialinvestorv2.bson file and migrates all
 * documents with status:"verified" to the Investor collection.
 * 
 * Usage: node scripts/migratePotentialInvestorV2ToInvestor.js
 */

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Investor = require('../admin/models/Investor');
const connectDB = require('../config/db');

// Load .env from backend root directory
dotenv.config({ path: path.join(__dirname, '../.env') });

/**
 * Parse BSON file and extract documents
 * BSON files from mongodump contain concatenated BSON documents
 */
const parseBSONFile = (filePath) => {
    const BSON = require('bson');
    const buffer = fs.readFileSync(filePath);
    const documents = [];
    let offset = 0;

    while (offset < buffer.length) {
        // Read the document size (first 4 bytes of each BSON document)
        const docSize = buffer.readInt32LE(offset);

        if (docSize <= 0 || offset + docSize > buffer.length) {
            console.warn(`Invalid document size at offset ${offset}. Stopping parse.`);
            break;
        }

        // Extract the document bytes
        const docBuffer = buffer.slice(offset, offset + docSize);

        try {
            const doc = BSON.deserialize(docBuffer);
            documents.push(doc);
        } catch (err) {
            console.error(`Error deserializing document at offset ${offset}:`, err.message);
        }

        offset += docSize;
    }

    return documents;
};

/**
 * Parse ticket size string to min/max object
 * Examples: "$50K - $500K", "50000-500000", "$1M+"
 */
const parseTicketSize = (ticketSizeStr) => {
    if (!ticketSizeStr || typeof ticketSizeStr !== 'string') {
        return { min: 0, max: 0 };
    }

    const multipliers = { 'K': 1000, 'M': 1000000, 'B': 1000000000 };
    const numbers = [];

    // Extract all number patterns with optional K/M/B suffix
    const matches = ticketSizeStr.match(/\$?(\d+(?:\.\d+)?)\s*(K|M|B)?/gi) || [];

    for (const match of matches) {
        const parsed = match.match(/\$?(\d+(?:\.\d+)?)\s*(K|M|B)?/i);
        if (parsed) {
            let value = parseFloat(parsed[1]);
            const suffix = parsed[2]?.toUpperCase();
            if (suffix && multipliers[suffix]) {
                value *= multipliers[suffix];
            }
            numbers.push(value);
        }
    }

    if (numbers.length >= 2) {
        return { min: Math.min(...numbers), max: Math.max(...numbers) };
    } else if (numbers.length === 1) {
        return { min: numbers[0], max: numbers[0] };
    }

    return { min: 0, max: 0 };
};

/**
 * Parse regional focus string to array
 */
const parseRegionalFocus = (regionalFocusStr) => {
    if (!regionalFocusStr || typeof regionalFocusStr !== 'string') {
        return [];
    }
    return regionalFocusStr
        .split(/[,;\/]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
};

/**
 * Parse industries/industry string to array
 */
const parseIndustries = (industryStr) => {
    if (!industryStr || typeof industryStr !== 'string') {
        return [];
    }
    return industryStr
        .split(/[,;\/]/)
        .map(s => s.trim())
        .filter(s => s.length > 0);
};

/**
 * Parse investment stage string to valid enum values
 */
const parseInvestmentStage = (stageStr) => {
    if (!stageStr || typeof stageStr !== 'string') {
        return [];
    }

    const validStages = ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth', 'late-stage'];
    const stageMapping = {
        'preseed': 'pre-seed',
        'pre-seed': 'pre-seed',
        'pre seed': 'pre-seed',
        'seed': 'seed',
        'series a': 'series-a',
        'series-a': 'series-a',
        'seriesa': 'series-a',
        'series b': 'series-b',
        'series-b': 'series-b',
        'seriesb': 'series-b',
        'series c': 'series-c',
        'series-c': 'series-c',
        'seriesc': 'series-c',
        'growth': 'growth',
        'late stage': 'late-stage',
        'late-stage': 'late-stage',
        'latestage': 'late-stage',
        'early stage': 'seed',
        'early': 'seed'
    };

    const stages = stageStr.toLowerCase().split(/[,;\/&]/).map(s => s.trim());
    const result = [];

    for (const stage of stages) {
        if (stageMapping[stage]) {
            result.push(stageMapping[stage]);
        }
    }

    return [...new Set(result)]; // Remove duplicates
};

/**
 * Transform PotentialInvestorV2 document to Investor format
 */
const transformToInvestor = (potentialInvestor) => {
    // Build full name from firstName + lastName or from teamMembers
    let name = '';
    if (potentialInvestor.firstName || potentialInvestor.lastName) {
        name = `${potentialInvestor.firstName || ''} ${potentialInvestor.lastName || ''}`.trim();
    }

    // If no name, try to get from first team member
    if (!name && potentialInvestor.teamMembers && potentialInvestor.teamMembers.length > 0) {
        name = potentialInvestor.teamMembers[0].name || '';
    }

    // Fallback to company name if still no name
    if (!name) {
        name = potentialInvestor.companyName || 'Unknown';
    }

    // Get primary email
    let email = potentialInvestor.email;
    if (!email && potentialInvestor.teamMembers && potentialInvestor.teamMembers.length > 0) {
        email = potentialInvestor.teamMembers[0].email;
    }
    email = email || '';

    // Transform team members
    const teamMembers = (potentialInvestor.teamMembers || []).map(member => ({
        name: member.name || '',
        role: member.designation || '',
        linkedinUrl: member.linkedinUrl || '',
        email: member.email || ''
    }));

    // If no team members but we have person data, create one
    if (teamMembers.length === 0 && (potentialInvestor.firstName || potentialInvestor.personLinkedinUrl)) {
        teamMembers.push({
            name: `${potentialInvestor.firstName || ''} ${potentialInvestor.lastName || ''}`.trim(),
            role: '',
            linkedinUrl: potentialInvestor.personLinkedinUrl || '',
            email: potentialInvestor.email || ''
        });
    }

    return {
        name: name,
        serialNumber: potentialInvestor.serialNumber || null,
        email: email,
        company: potentialInvestor.companyName || '',
        location: '', // Not available in PotentialInvestorV2
        country: '', // Not available in PotentialInvestorV2
        description: potentialInvestor.description || '',
        investmentThesis: potentialInvestor.investmentThesis || '',
        regionalFocus: parseRegionalFocus(potentialInvestor.regionalFocus),
        ticketSize: parseTicketSize(potentialInvestor.ticketSize),
        teamMembers: teamMembers,
        industries: parseIndustries(potentialInvestor.industry),
        investmentStage: parseInvestmentStage(potentialInvestor.stageOfInvestment),
        linkedinUrl: potentialInvestor.personLinkedinUrl || potentialInvestor.companyLinkedinUrl || '',
        websiteUrl: potentialInvestor.website || '',
        notes: potentialInvestor.notes || '',
        tags: potentialInvestor.tags || [],
        type: potentialInvestor.type === 'Angel' ? 'Angel' : 'Institutional',
        isActive: true,
        isVerified: true, // Since we're migrating verified records
        source: 'migration',
        avatar: ''
    };
};

/**
 * Main migration function
 */
const migrate = async () => {
    console.log('='.repeat(60));
    console.log('PotentialInvestorV2 to Investor Migration Script');
    console.log('='.repeat(60));

    try {
        // Connect to database
        await connectDB();
        console.log('✓ Connected to MongoDB\n');

        // Read and parse BSON file
        const bsonPath = path.join(__dirname, 'potentialinvestorv2.bson');

        if (!fs.existsSync(bsonPath)) {
            throw new Error(`BSON file not found: ${bsonPath}`);
        }

        console.log(`Reading BSON file: ${bsonPath}`);
        const allDocuments = parseBSONFile(bsonPath);
        console.log(`✓ Parsed ${allDocuments.length} total documents from BSON file\n`);

        // Filter for verified documents only
        const verifiedDocuments = allDocuments.filter(doc => doc.status === 'verified');
        console.log(`Found ${verifiedDocuments.length} documents with status:"verified"\n`);

        if (verifiedDocuments.length === 0) {
            console.log('No verified documents to migrate. Exiting.');
            process.exit(0);
        }

        let migrated = 0;
        let skipped = 0;
        let errors = 0;

        console.log('Starting migration...\n');

        for (const potentialInvestor of verifiedDocuments) {
            try {
                const investorData = transformToInvestor(potentialInvestor);

                // Check for duplicates by email or serialNumber
                const query = { $or: [] };

                if (investorData.email) {
                    query.$or.push({ email: investorData.email.toLowerCase() });
                }
                if (investorData.serialNumber) {
                    query.$or.push({ serialNumber: investorData.serialNumber });
                }

                let exists = false;
                if (query.$or.length > 0) {
                    exists = await Investor.findOne(query);
                }

                if (exists) {
                    console.log(`⊘ Skipped (duplicate): ${investorData.name} (${investorData.email || investorData.serialNumber})`);
                    skipped++;
                    continue;
                }

                // Create new investor
                await Investor.create(investorData);
                console.log(`✓ Migrated: ${investorData.name} (${investorData.email || investorData.company})`);
                migrated++;

            } catch (err) {
                console.error(`✗ Error migrating ${potentialInvestor.companyName || potentialInvestor._id}:`, err.message);
                errors++;
            }
        }

        console.log('\n' + '='.repeat(60));
        console.log('Migration Summary');
        console.log('='.repeat(60));
        console.log(`Total verified documents: ${verifiedDocuments.length}`);
        console.log(`Successfully migrated:    ${migrated}`);
        console.log(`Skipped (duplicates):     ${skipped}`);
        console.log(`Errors:                   ${errors}`);
        console.log('='.repeat(60));

        process.exit(0);

    } catch (error) {
        console.error('\n✗ Migration failed:', error);
        process.exit(1);
    }
};

// Run if called directly
if (require.main === module) {
    migrate();
}

module.exports = { migrate, transformToInvestor, parseBSONFile };
