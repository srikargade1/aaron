const mongoose = require('mongoose'); 

// Define the User schema
const userSchema = new mongoose.Schema({
    firstName: { type: String, required: true }, 
    lastName: { type: String, required: true }, 
    email: { type: String, required: true, unique: true }, 
    password: { type: String, required: true }, 
    proficiencyLevel: { 
        type: String, 
        enum: ['Beginner', 'Intermediate', 'Advanced'], 
        required: true 
    }, 
    learningLanguage: { type: String, required: true }, 
    readArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Articles user has read
    uploadedArticles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Article' }], // Articles user has uploaded
    refreshToken: { type: String }, 
    createdAt: { type: Date, default: Date.now }, 
    updatedAt: { type: Date, default: Date.now } 
});

// Indexes for optimization
userSchema.index({ email: 1 }, { unique: true });
userSchema.index({ readArticles: 1 });
userSchema.index({ uploadedArticles: 1 });

// Middleware to update `updatedAt` on document updates
userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

// Create and export the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
