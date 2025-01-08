const express = require('express');
const router = express.Router();
const fs = require('fs').promises;
const { body, param, validationResult } = require('express-validator');
const Article = require('../models/articleModel');
const upload = require('../middleware/uploadMiddleware');

// @desc    Upload a custom article
// @route   POST /api/articles/upload
// @access  Private
router.post(
    '/upload',
    upload.single('file'),
    [
        // Validation rules
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('difficultyLevel')
            .isIn(['Beginner', 'Intermediate', 'Advanced'])
            .withMessage('Difficulty level must be Beginner, Intermediate, or Advanced'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId, difficultyLevel } = req.body;

            if (!req.file) {
                return res.status(400).json({ message: 'No file uploaded' });
            }

            // Read the content of the uploaded file
            const filePath = req.file.path;
            const fileContent = await fs.readFile(filePath, 'utf8');

            // Create a new Article document
            const article = new Article({
                title: req.file.originalname,
                content: fileContent,
                type: 'custom',
                userId,
                difficultyLevel,
            });

            // Save the article to the database
            await article.save();

            res.status(201).json({ message: 'Custom article uploaded successfully', article });
        } catch (error) {
            console.error('Error uploading article:', error);
            res.status(500).json({ message: 'Failed to upload custom article', error: error.message });
        }
    }
);

// @desc    Get custom articles for a specific user
// @route   GET /api/articles/custom/:userId
// @access  Private
router.get(
    '/custom/:userId',
    [
        // Validation rule for userId
        param('userId').isMongoId().withMessage('Invalid user ID'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        try {
            const { userId } = req.params;

            // Fetch custom articles for the user
            const articles = await Article.find({ userId, type: 'custom' });

            if (!articles.length) {
                return res.status(404).json({ message: 'No custom articles found for this user' });
            }

            res.status(200).json({ articles });
        } catch (error) {
            console.error('Error fetching custom articles:', error);
            res.status(500).json({ message: 'Failed to fetch custom articles', error: error.message });
        }
    }
);

module.exports = router;

