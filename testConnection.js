const mongoose = require('mongoose');

mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
    process.exit();
}).catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
