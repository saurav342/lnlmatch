const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../admin/models/User');

dotenv.config();

const upgradeToSuperadmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'saurav.dnd@gmail.com';

        // Find the user
        const user = await User.findOne({ email });

        if (!user) {
            console.log(`Error: User ${email} not found`);
            process.exit(1);
        }

        if (user.userType === 'superadmin') {
            console.log(`User ${email} is already a superadmin`);
            process.exit(0);
        }

        // Upgrade to superadmin
        user.userType = 'superadmin';
        await user.save();

        console.log('\n===========================================');
        console.log(`✓ User ${email} upgraded to superadmin successfully!`);
        console.log('===========================================');

        process.exit(0);
    } catch (error) {
        console.error('Error upgrading to superadmin:', error);
        process.exit(1);
    }
};

upgradeToSuperadmin();
