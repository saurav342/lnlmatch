const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../admin/models/User');

dotenv.config();

const adminUsers = [
    {
        email: 'launchandlift@gmail.com',
        password: 'lnl@123',
        name: 'Launch and Lift Admin'
    },
    {
        email: 'launchandlift07@gmail.com',
        password: 'lnl@123',
        name: 'Launch and Lift 07 Admin'
    },
    {
        email: 'happyjobs.ai@gmail.com',
        password: 'lnl@123',
        name: 'Happy Jobs Admin'
    }
];

const addAdminUsers = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        for (const adminData of adminUsers) {
            // Check if user exists
            let user = await User.findOne({ email: adminData.email });

            if (user) {
                console.log(`User ${adminData.email} already exists, updating to admin...`);
                user.userType = 'admin';
                user.password = adminData.password; // In production, this should be hashed
                user.accountStatus = 'active';
                user.subscriptionPlan = 'enterprise';
                user.subscriptionStatus = 'active';
                await user.save();
                console.log(`✓ User ${adminData.email} updated successfully`);
            } else {
                console.log(`Creating new admin user ${adminData.email}...`);
                user = await User.create({
                    name: adminData.name,
                    email: adminData.email,
                    password: adminData.password, // In production, this should be hashed
                    userType: 'admin',
                    subscriptionPlan: 'enterprise',
                    subscriptionStatus: 'active',
                    accountStatus: 'active',
                    signupDate: new Date()
                });
                console.log(`✓ Admin user ${adminData.email} created successfully`);
            }
        }

        console.log('\n===========================================');
        console.log('All admin users created/updated successfully!');
        console.log('===========================================');
        console.log('\nCredentials:');
        adminUsers.forEach(admin => {
            console.log(`${admin.email} | ${admin.password}`);
        });

        process.exit(0);
    } catch (error) {
        console.error('Error adding admin users:', error);
        process.exit(1);
    }
};

addAdminUsers();
