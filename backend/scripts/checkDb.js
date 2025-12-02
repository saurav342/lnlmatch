const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../admin/models/User');

dotenv.config();

const checkDb = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        const userCount = await User.countDocuments();
        console.log(`Total Users in DB: ${userCount}`);

        if (userCount > 0) {
            const users = await User.find().limit(5);
            console.log('Sample Users:', users);
        }

        process.exit();
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

checkDb();
