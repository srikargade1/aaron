const mongoose = require('mongoose'); 

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
        required: function() { return this.type === 'custom'; } 
    },
    uploadedBy: { type: String, required: true }, // 'curator' or userId
    createdAt: { type: Date, default: Date.now }
});

// Indexing for search performance
articleSchema.index({ title: 1 });
articleSchema.index({ tags: 1 });

// Create the Article model
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
