require('dotenv').config();
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const mongoose = require('mongoose');

// --- 1. CONFIGURATION ---
const MONGO_URI = process.env.MONGO_URI || 'mongodb+srv://sauravks2010_db_user:hdlQyFTp9mEiAZEw@cluster0.tuyozvw.mongodb.net/';
const CSV_FILE_PATH = path.join(__dirname, './potential.csv');

// --- 2. MONGOOSE SCHEMA DEFINITION ---
const investorSchema = new mongoose.Schema({
    name: { type: String, required: true, trim: true }, // Will store Company Name
    serialNumber: { type: String, unique: true, sparse: true, index: true },
    email: { type: String, required: true, lowercase: true, trim: true, index: true }, // Primary contact email
    company: { type: String, trim: true },
    location: { type: String, trim: true },
    country: { type: String, trim: true },
    description: { type: String, trim: true },
    investmentThesis: { type: String, trim: true },
    regionalFocus: [{ type: String, trim: true }],
    ticketSize: {
        min: { type: Number, default: 0 },
        max: { type: Number, default: 0 }
    },
    teamMembers: [{
        name: { type: String, trim: true },
        role: { type: String, trim: true },
        linkedinUrl: { type: String, trim: true },
        email: { type: String, trim: true, lowercase: true }
    }],
    industries: [{ type: String, trim: true }],
    investmentStage: [{
        type: String,
        enum: ['pre-seed', 'seed', 'series-a', 'series-b', 'series-c', 'growth', 'late-stage'],
        trim: true
    }],
    linkedinUrl: { type: String, trim: true }, // Company LinkedIn
    websiteUrl: { type: String, trim: true },
    notes: { type: String },
    tags: [{ type: String, trim: true }],
    type: {
        type: String,
        enum: ['Angel', 'Institutional'],
        index: true
    },
    isActive: { type: Boolean, default: true, index: true },
    isVerified: { type: Boolean, default: false },
    source: {
        type: String,
        enum: ['manual', 'excel-import', 'api', 'migration'],
        default: 'manual',
        index: true
    },
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    avatar: { type: String },
    isWishlisted: { type: Boolean, default: false }
}, { timestamps: true });

const Investor = mongoose.model('Investor', investorSchema);

// --- 3. HELPER FUNCTIONS ---

const mapStage = (csvStageString) => {
    if (!csvStageString) return [];
    const mappedStages = new Set();
    const stages = csvStageString.split(',').map(s => s.trim().toLowerCase());

    stages.forEach(stage => {
        if (stage.includes('idea') || stage.includes('patent') || stage.includes('1.')) mappedStages.add('pre-seed');
        if (stage.includes('prototype') || stage.includes('2.')) mappedStages.add('seed');
        if (stage.includes('early revenue') || stage.includes('3.')) mappedStages.add('series-a');
        if (stage.includes('scaling') || stage.includes('4.')) mappedStages.add('series-b');
        if (stage.includes('growth') || stage.includes('5.')) mappedStages.add('growth');
        if (stage.includes('pre-ipo') || stage.includes('6.')) mappedStages.add('late-stage');
    });
    return Array.from(mappedStages);
};

const mapIndustries = (industryString) => {
    if (!industryString) return [];
    return industryString.split(',').map(i => i.trim()).filter(i => i.length > 0);
};

const determineType = (companyName) => {
    if (!companyName) return 'Angel';
    const institutionalKeywords = ['Capital', 'Ventures', 'Fund', 'Partners', 'Equity', 'Invest', 'Group', 'Associates', 'L.P.', 'Inc', 'Ltd'];
    return institutionalKeywords.some(keyword => companyName.includes(keyword)) ? 'Institutional' : 'Angel';
};

// --- 4. MIGRATION LOGIC ---

const processCSV = async () => {
    const companyMap = new Map();

    return new Promise((resolve, reject) => {
        fs.createReadStream(CSV_FILE_PATH)
            .pipe(csv())
            .on('data', (row) => {
                const companyName = row['Company Name']?.trim();

                // Skip if no company name (cannot group) or no email
                if (!companyName) {
                    // Optional: Handle individual Angels without company names differently if needed
                    return;
                }

                // If company doesn't exist in map, create the base object
                if (!companyMap.has(companyName)) {
                    companyMap.set(companyName, {
                        name: companyName,
                        company: companyName, // Keeping redundancy as requested in schema
                        serialNumber: row['Serial Number']?.trim(),
                        email: row['Email']?.trim().toLowerCase(), // Primary email (using the first one found)
                        websiteUrl: row['Website']?.trim(),
                        linkedinUrl: row['Company LinkedIn']?.trim(),
                        industries: mapIndustries(row['Industry']),
                        investmentStage: mapStage(row['Stage of Investment']),
                        notes: `${row['Notes'] || ''} \n(Original Status: ${row['Status']})`,
                        isVerified: row['Status']?.toLowerCase() === 'verified',
                        type: determineType(companyName),
                        source: 'excel-import',
                        tags: row['Status'] ? [row['Status']] : [],
                        teamMembers: [] // Initialize empty array
                    });
                }

                // Create team member object from current row
                const teamMember = {
                    name: `${row['First Name'] || ''} ${row['Last Name'] || ''}`.trim(),
                    role: 'Investor', // Default role since CSV doesn't specify title
                    email: row['Email']?.trim().toLowerCase(),
                    linkedinUrl: row['Person LinkedIn']?.trim()
                };

                // Add to the existing company's teamMembers array
                const companyObj = companyMap.get(companyName);

                // Avoid adding duplicates to teamMembers (check by email)
                const exists = companyObj.teamMembers.some(m => m.email === teamMember.email);
                if (!exists && teamMember.email) {
                    companyObj.teamMembers.push(teamMember);
                }
            })
            .on('end', () => {
                resolve(Array.from(companyMap.values()));
            })
            .on('error', (error) => reject(error));
    });
};

const migrate = async () => {
    try {
        await mongoose.connect(MONGO_URI);
        console.log('✅ Connected to MongoDB');

        console.log('📂 Reading and Grouping CSV data...');
        const investors = await processCSV();
        console.log(`📊 Found ${investors.length} unique companies.`);

        const bulkOperations = investors.map(investor => ({
            updateOne: {
                filter: { name: investor.name }, // Match by Company Name
                update: { $set: investor },
                upsert: true
            }
        }));

        if (bulkOperations.length > 0) {
            console.log(`🚀 Executing BulkWrite...`);
            const result = await Investor.bulkWrite(bulkOperations);
            console.log('✅ Migration Complete!');
            console.log(`   - Matched: ${result.matchedCount}`);
            console.log(`   - Modified: ${result.modifiedCount}`);
            console.log(`   - Upserted: ${result.upsertedCount}`);
        } else {
            console.log('⚠️ No records to insert.');
        }

    } catch (error) {
        console.error('❌ Migration Failed:', error);
    } finally {
        await mongoose.connection.close();
        console.log('👋 Connection Closed');
    }
};

migrate();