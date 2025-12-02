const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../admin/models/User');

dotenv.config();

const createAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'saurav.dnd@gmail.com';
        const password = 'lnl123';
        const name = 'Saurav Admin';

        // Check if user exists
        let user = await User.findOne({ email });

        if (user) {
            console.log('User already exists, updating to admin...');
            user.userType = 'admin';
            user.password = password; // In a real app, hash this!
            user.accountStatus = 'active';
            await user.save();
            console.log('User updated successfully');
        } else {
            console.log('Creating new admin user...');
            user = await User.create({
                name,
                email,
                password, // In a real app, hash this!
                userType: 'admin',
                subscriptionPlan: 'enterprise',
                subscriptionStatus: 'active',
                accountStatus: 'active',
                signupDate: new Date()
            });
            console.log('Admin user created successfully');
        }

        console.log(`Admin credentials: ${email} | ${password}`);
        process.exit();
    } catch (error) {
        console.error('Error creating admin:', error);
        process.exit(1);
    }
};

createAdmin();
