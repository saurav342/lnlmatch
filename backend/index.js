const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5001;

const connectDB = require('./config/db');
const apiRoutes = require('./routes/apiRoutes');
const adminRoutes = require('./admin/routes/adminRoutes');
const paymentRoutes = require('./routes/paymentRoutes');

connectDB();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.use('/api', apiRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/payment', paymentRoutes);


app.get('/', (req, res) => {
    res.send('API is running...');
});

if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

module.exports = app;
