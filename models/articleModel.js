const mongoose = require('mongoose'); // Import mongoose to define the schema and model

// Define the Article schema
const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, required: true },
    tags: [{ type: String }],
    difficultyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    type: { type: String, enum: ['sample', 'custom'], required: true },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: function () { return this.type === 'custom'; },
    },
    createdAt: { type: Date, default: Date.now },
});

// Create the Article model from the schema
const Article = mongoose.model('Article', articleSchema);

// Export the Article model for use in other parts of the app
module.exports = Article;
