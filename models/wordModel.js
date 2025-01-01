const mongoose = require('mongoose'); // Import mongoose

// Define the Word schema
const wordSchema = new mongoose.Schema({
    word: { type: String, required: true, unique: true }, // The word itself (e.g., "Bonjour"), unique
    meanings: [
        {
            definition: { type: String, required: true }, // A single definition of the word
            usageExample: { type: String }, // Example sentence demonstrating usage (optional)
        },
    ],
    grammarNotes: { type: String }, // Additional grammar notes about the word (optional)
    createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp for when the word was added
});

// Create the Word model from the schema
const Word = mongoose.model('Word', wordSchema);

module.exports = Word;
