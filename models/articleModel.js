const mongoose = require('mongoose');

const articleSchema = new mongoose.Schema({
    title: { type: String, required: true },
    content: { type: String, default: '' },  // ✅ Allow empty content initially
    tags: [{ type: String }],
    difficultyLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], required: true },
    type: { type: String, enum: ['sample', 'custom'], required: true },
    userId: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User',
        required: false  // ✅ Make `userId` optional (will be filled in step 2)
    },
    uploadedBy: { type: String, required: true }, // Can be 'curator' or a User ID
    createdAt: { type: Date, default: Date.now }
});

// Indexing for search performance
articleSchema.index({ title: 1 });
articleSchema.index({ tags: 1 });

// Create the Article model
const Article = mongoose.model('Article', articleSchema);
module.exports = Article;
