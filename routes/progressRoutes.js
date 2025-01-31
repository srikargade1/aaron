const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserWord = require('../models/userWordModel'); 

// @desc    Fetch user statistics like total articles, total words, articles left
// @route   GET /api/users
// @access  Public
router.get('/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        // Fetch user data
        const user = await User.findById(userId)
            .populate('readArticles', 'title') // Fetch read articles' titles
            .populate('uploadedArticles', 'title'); // Fetch uploaded articles' titles

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Count total words interacted with
        const wordCount = await UserWord.countDocuments({ userId });

        // Calculate remaining articles to meet the daily goal
        const articlesRemaining = Math.max(0, user.goals.articlesPerDay - user.readArticles.length);

        res.status(200).json({
            totalWords: wordCount,
            totalArticlesRead: user.readArticles.length,
            totalArticlesUploaded: user.uploadedArticles.length,
            dailyStreak: user.streak,
            articlesRemainingToday: articlesRemaining,
            readArticles: user.readArticles, // Optional: List of articles
            uploadedArticles: user.uploadedArticles // Optional: List of uploaded articles
        });
    } catch (error) {
        console.error('Error fetching user progress:', error);
        res.status(500).json({ message: 'Failed to fetch user progress', error: error.message });
    }
});


// @desc    Statistics about words user has interacted with
// @route   GET /api/users
// @access  Public
router.get('/word/:userId', async (req, res) => {
    const { userId } = req.params;
    try {
        const words = await UserWord.find({ userId });

        // Count words based on interaction type
        const encounteredWords = words.length;
        const checkedWords = words.reduce((sum, word) => sum + word.checkedCount, 0);
        const wordsForReview = words.filter(word => word.isMarkedForReview).length;

        res.status(200).json({
            totalWordsEncountered: encounteredWords,
            totalWordsChecked: checkedWords,
            wordsMarkedForReview: wordsForReview
        });
    } catch (error) {
        console.error('Error fetching word statistics:', error);
        res.status(500).json({ message: 'Failed to fetch word statistics', error: error.message });
    }
});

// @desc    Statistics about articles user has interacted with
// @route   GET /api/users
// @access  Public
router.get('/articles/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        
        const totalRead = user.readArticles.length;
        const totalUploaded = user.uploadedArticles.length;
        const articlesRemaining = Math.max(0, user.goals.articlesPerDay - totalRead);

        res.status(200).json({
            totalArticlesRead: totalRead,
            totalArticlesUploaded: totalUploaded,
            articlesRemainingToday: articlesRemaining
        });
    } catch (error) {
        console.error('Error fetching article statistics:', error);
        res.status(500).json({ message: 'Failed to fetch article statistics', error: error.message });
    }
});

router.get('/progress/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            dailyStreak: user.streak,
            wordGoalCompleted: user.goals.wordsPerDay <= user.readArticles.length,
            articleGoalCompleted: user.goals.articlesPerDay <= user.readArticles.length
        });
    } catch (error) {
        console.error('Error fetching progress:', error);
        res.status(500).json({ message: 'Failed to fetch progress', error: error.message });
    }
});


module.exports = router;