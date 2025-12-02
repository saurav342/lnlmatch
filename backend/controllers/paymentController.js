const Razorpay = require('razorpay');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const Subscription = require('../admin/models/Subscription');

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

const getUserIdFromToken = (req) => {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) throw new Error('No token provided');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret');
    return decoded.id;
};

exports.createOrder = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req); // Verify auth
        const { amount, currency = 'INR' } = req.body;
        const options = {
            amount: amount * 100, // amount in smallest currency unit
            currency,
            receipt: `receipt_${Date.now()}`
        };

        const order = await razorpay.orders.create(options);
        res.json(order);
    } catch (error) {
        console.error('Error creating order:', error);
        res.status(500).json({ message: 'Something went wrong', error: error.message });
    }
};

exports.verifyPayment = async (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature, plan, amount } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac('sha256', process.env.RAZORPAY_KEY_SECRET)
            .update(body.toString())
            .digest('hex');

        if (expectedSignature === razorpay_signature) {
            // Calculate end date (assuming monthly for now)
            const startDate = new Date();
            const endDate = new Date(startDate);
            endDate.setMonth(endDate.getMonth() + 1);

            const subscriptionData = {
                userId,
                plan,
                status: 'active',
                paymentMethod: 'card',
                transactionId: razorpay_payment_id,
                amount: amount || 0,
                currency: 'INR',
                startDate,
                endDate,
                billingHistory: [{
                    date: new Date(),
                    amount: amount || 0,
                    status: 'success',
                    transactionId: razorpay_payment_id,
                    description: `Subscription to ${plan} plan`
                }]
            };

            // Upsert subscription
            await Subscription.findOneAndUpdate(
                { userId },
                subscriptionData,
                { upsert: true, new: true }
            );

            res.json({ message: 'Payment verified successfully', success: true });
        } else {
            res.status(400).json({ message: 'Invalid signature', success: false });
        }
    } catch (error) {
        console.error('Error verifying payment:', error);
        res.status(500).json({ message: 'Internal Server Error', error: error.message });
    }
};
