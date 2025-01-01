const mongoose = require('mongoose'); // Import mongoose to define the schema and model

// Define the Article schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Article title, required
    content: { type: String, required: true }, // The main content of the article, required
    tags: [{ type: String }], // Array of tags for categorizing the article (e.g., Politics, Education)
    difficultyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    // Difficulty level for the article, must be one of the specified values (Beginner, Intermediate, Advanced)
    type: { type: String, enum: ['sample', 'custom'], required: true },
    // Indicates whether the article is a sample or custom article
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: function() { return this.type === 'custom'; } 
        // If the article is custom, it must reference the user who created it
    },
    createdAt: { type: Date, default: Date.now }, // Auto-generated timestamp for when the article was created
});

// Create the Article model from the schema
const Article = mongoose.model('Article', articleSchema);

// Export the Article model for use in other parts of the app
module.exports = Article;
