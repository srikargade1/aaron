const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import User model
const UserWord = require('../models/userWordModel'); // Import UserWord model
const Article = require('../models/articleModel'); // Import Article model

// @desc    Fetch user progress summary
// @route   GET /api/progress/:userId
// @access  Private
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Count words encountered
        const wordCount = await UserWord.countDocuments({ userId });

        // Count articles read
        const user = await User.findById(userId);
        const articleCount = user ? user.readArticles.length : 0;

        res.status(200).json({
            wordsEncountered: wordCount,
            articlesRead: articleCount
        });
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
    }
});

// @desc    Fetch all words user has interacted with
// @route   GET /api/progress/words/:userId
// @access  Private
router.get('/words/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch all user-word interactions
        const wordInteractions = await UserWord.find({ userId }).populate('wordId');

        res.status(200).json(wordInteractions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch word interactions', error: error.message });
    }
});

// @desc    Fetch all articles the user has read
// @route   GET /api/progress/articles/:userId
// @access  Private
router.get('/articles/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user document to get read articles
        const user = await User.findById(userId).populate('readArticles');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(user.readArticles);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch article interactions', error: error.message });
    }
});

module.exports = router;
