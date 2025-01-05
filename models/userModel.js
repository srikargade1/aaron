const mongoose = require('mongoose'); // Import mongoose to define the schema and model

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // User's first name, required
    lastName: { type: String, required: true }, // User's last name, required
    email: { type: String, required: true, unique: true }, // User's email, required and must be unique
    password: { type: String, required: true }, // User's hashed password, required
    proficiencyLevel: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced'], // Dropdown-style predefined options
        required: true 
    }, 
    // Language proficiency level, must be one of the predefined options
    learningLanguage: { type: String, required: true }, // Language the user is learning (e.g., French)
    goals: { 
        wordsPerDay: { type: Number, default: 10 }, // Daily goal for learning words, default is 10
        articlesPerDay: { type: Number, default: 1 }, // Daily goal for reading articles, default is 1
    },
    streak: { type: Number, default: 0 }, // User's daily streak count, default is 0
    createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp for when the user was created
    refreshToken: { type: String }, // Field to store the refresh token

});

// Create the User model from the schema
const User = mongoose.model('User', userSchema);

module.exports = User;
