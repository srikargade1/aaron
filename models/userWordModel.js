const mongoose = require('mongoose'); // Import mongoose

// Define the UserWord schema
const userWordSchema = new mongoose.Schema({
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    }, // Reference to the user who interacted with the word
    wordId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Word', 
        required: true 
    }, // Reference to the word being tracked
    encounteredCount: { 
        type: Number, 
        default: 1 
    }, // Tracks how many times the user has encountered this word
    checkedCount: { 
        type: Number, 
        default: 0 
    }, // Tracks how many times the user has checked the meaning of this word
    isMarkedForReview: { 
        type: Boolean, 
        default: false 
    }, // Indicates if the user has marked this word for review
    lastEncounteredAt: { 
        type: Date, 
        default: Date.now 
    }, // Timestamp of the last time the user interacted with this word
});

// Create the UserWord model from the schema
const UserWord = mongoose.model('UserWord', userWordSchema);

// Export the UserWord model for use in other parts of the app
module.exports = UserWord;
