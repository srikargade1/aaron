const mongoose = require('mongoose'); // Import mongoose

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, // User's first name
    lastName: { type: String, required: true }, // User's last name
    email: { type: String, required: true, unique: true }, // Unique email address
    password: { type: String, required: true }, // Hashed password
    proficiencyLevel: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced'], // Dropdown options
        required: true 
    }, 
    learningLanguage: { type: String, required: true }, // Language being learned
    goals: { 
        wordsPerDay: { type: Number, default: 10 }, // Daily word goal
        articlesPerDay: { type: Number, default: 1 }, // Daily article goal
    },
    readArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Articles user has read
    uploadedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Articles user has uploaded
    streak: { type: Number, default: 0 }, // Daily streak
    refreshToken: { type: String }, // Refresh token for authentication
}, { timestamps: true }); // Automatically adds createdAt & updatedAt fields

// Remove duplicate index declaration on email (Mongoose already enforces it)
userSchema.index({ readArticles: 1 });
userSchema.index({ uploadedArticles: 1 });

// Middleware to update `updatedAt` before updates
userSchema.pre('findOneAndUpdate', function (next) {
    this.set({ updatedAt: Date.now() });
    next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;

