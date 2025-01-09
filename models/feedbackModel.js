const mongoose = require('mongoose'); // Import mongoose

// Define the Feedback schema
const feedbackSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to the User model
        required: false, // Optional: Feedback can be submitted anonymously
    },
    feedbackText: {
        type: String,
        required: true, // Feedback text is required
        trim: true, // Removes extra spaces
    },
    rating: {
        type: Number,
        min: 1,
        max: 5, // Feedback rating between 1 and 5
        required: false, // Optional: Rating can be omitted
    },
    createdAt: {
        type: Date,
        default: Date.now, // Auto-generated timestamp
    },
});

// Create the Feedback model from the schema
const Feedback = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedback; // Export the Feedback model
