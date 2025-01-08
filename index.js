const express = require('express');
const mongoose = require('mongoose'); // Import mongoose for database connection
const dotenv = require('dotenv'); // For environment variables
const errorHandler = require('./middleware/errorHandler'); // Import error handler middleware

dotenv.config(); // Load environment variables from .env file

const app = express();

// Middleware
app.use(express.json()); // Middleware to parse JSON requests

// Database Connection
const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://127.0.0.1:27017/aaronDB', {
            useNewUrlParser: true, // Optional in recent MongoDB versions
            useUnifiedTopology: true, // Optional in recent MongoDB versions
        });
        console.log('MongoDB connected...');
    } catch (error) {
        console.error('Database connection error:', error.message);
        process.exit(1);
    }
};

// Connect to the database
connectDB();

// Import routes
const translationRoutes = require('./routes/translation');
const feedbackRoutes = require('./routes/feedback');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const wordRoutes = require('./routes/wordRoutes'); // Import word routes
const userWordRoutes = require('./routes/userWordRoutes'); // Import user word routes
const authRoutes = require('./routes/authRoutes'); // Import authentication routes
const articleRoutes = require('./routes/articleRoutes'); // Import article routes

// Use routes
app.use('/api/translation', translationRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/users', userRoutes); // Mount the user routes at /api/users
app.use('/api/words', wordRoutes); // Mount the word routes at /api/words
app.use('/api/userwords', userWordRoutes); // Mount the user word routes at /api/userWordRoutes
app.use('/api/auth', authRoutes); // Mount the authorization routes at /api/auth
app.use('/api/articles', articleRoutes); // Mount the article routes at /api/articles

// Root route
app.get('/', (req, res) => {
    res.send('Welcome to Aaron!');
});

// Error handling middleware
app.use(errorHandler);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
