
const mongoose = require('mongoose');
const User = require('../admin/models/User');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

const checkUserRole = async () => {
    try {
        console.log('URI:', process.env.MONGO_URI);
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const email = 'saurav.dnd@gmail.com';
        const user = await User.findOne({ email });

        if (user) {
            console.log(`User found: ${user.email}`);
            console.log(`Role: ${user.userType}`);
            console.log(`ID: ${user._id}`);

            // If not superadmin, update it
            if (user.userType !== 'superadmin') {
                console.log('Updating user to superadmin...');
                user.userType = 'superadmin';
                await user.save();
                console.log('User updated to superadmin');
            }
        } else {
            console.log(`User not found: ${email}`);
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
        console.log('Disconnected');
    }
};

checkUserRole();
