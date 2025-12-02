const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../admin/models/User');
const Subscription = require('../admin/models/Subscription');
const Investor = require('../admin/models/Investor');
const AdminActivity = require('../admin/models/AdminActivity');

dotenv.config();

const users = [
    {
        name: "Sarah Chen",
        email: "sarah@example.com",
        password: "password123",
        userType: "founder",
        subscriptionPlan: "pro",
        subscriptionStatus: "active",
        accountStatus: "active",
        signupDate: new Date("2024-11-15"),
        lastLogin: new Date()
    },
    {
        name: "Michael Roberts",
        email: "michael@venture.com",
        password: "password123",
        userType: "investor",
        subscriptionPlan: "enterprise",
        subscriptionStatus: "active",
        accountStatus: "active",
        signupDate: new Date("2024-10-22"),
        lastLogin: new Date()
    },
    {
        name: "Alex Kumar",
        email: "alex@startup.io",
        password: "password123",
        userType: "founder",
        subscriptionPlan: "free",
        subscriptionStatus: "active",
        accountStatus: "active",
        signupDate: new Date("2024-11-28"),
        lastLogin: new Date()
    },
    {
        name: "Admin User",
        email: "admin@capify.com",
        password: "password123",
        userType: "admin",
        subscriptionPlan: "enterprise",
        subscriptionStatus: "active",
        accountStatus: "active",
        signupDate: new Date("2024-01-01"),
        lastLogin: new Date()
    }
];

const investors = [
    {
        name: "Michael Roberts",
        email: "michael@venture.com",
        company: "Sequoia Capital",
        location: "Menlo Park, CA",
        ticketSize: "$1M - $5M",
        industries: ["Fintech", "Enterprise"],
        isVerified: true,
        isActive: true,
        source: "manual"
    },
    {
        name: "Jennifer Lee",
        email: "jennifer@fund.com",
        company: "Andreessen Horowitz",
        location: "San Francisco, CA",
        ticketSize: "$2M - $10M",
        industries: ["AI/ML", "Healthcare"],
        isVerified: true,
        isActive: true,
        source: "manual"
    }
];

const seedData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log('Connected to MongoDB');

        // Clear existing data
        await User.deleteMany({});
        await Subscription.deleteMany({});
        await Investor.deleteMany({});
        await AdminActivity.deleteMany({});
        console.log('Cleared existing data');

        // Insert Users
        const createdUsers = await User.insertMany(users);
        console.log(`Created ${createdUsers.length} users`);

        // Insert Subscriptions
        const subscriptions = createdUsers.map(user => ({
            userId: user._id,
            plan: user.subscriptionPlan,
            status: user.subscriptionStatus,
            amount: user.subscriptionPlan === 'pro' ? 49 : user.subscriptionPlan === 'enterprise' ? 199 : 0,
            currency: 'USD',
            startDate: user.signupDate,
            billingHistory: [
                {
                    date: user.signupDate,
                    amount: user.subscriptionPlan === 'pro' ? 49 : user.subscriptionPlan === 'enterprise' ? 199 : 0,
                    status: 'success',
                    invoiceId: `inv_${Math.random().toString(36).substr(2, 9)}`
                }
            ]
        }));
        await Subscription.insertMany(subscriptions);
        console.log(`Created ${subscriptions.length} subscriptions`);

        // Insert Investors
        await Investor.insertMany(investors);
        console.log(`Created ${investors.length} investors`);

        // Insert Activity
        const activities = [
            {
                adminId: createdUsers.find(u => u.userType === 'admin')._id,
                action: 'user_created',
                targetType: 'user',
                targetId: createdUsers[0]._id,
                status: 'success',
                ipAddress: '127.0.0.1'
            },
            {
                adminId: createdUsers.find(u => u.userType === 'admin')._id,
                action: 'investor_verified',
                targetType: 'investor',
                status: 'success',
                ipAddress: '127.0.0.1'
            }
        ];
        await AdminActivity.insertMany(activities);
        console.log(`Created ${activities.length} activities`);

        console.log('Seeding completed successfully');
        process.exit();
    } catch (error) {
        console.error('Error seeding data:', error);
        process.exit(1);
    }
};

seedData();
