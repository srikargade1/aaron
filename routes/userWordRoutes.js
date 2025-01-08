const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const mongoose = require('mongoose');
const UserWord = require('../models/userWordModel'); // Import the UserWord model

// Middleware for validation error handling
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @desc    Get all user-word interactions for a user
// @route   GET /api/userwords/:userId
// @access  Public (for now)
router.get(
    '/:userId',
    [
        param('userId').isMongoId().withMessage('Invalid user ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId } = req.params;

        try {
            const interactions = await UserWord.find({ userId }).populate('wordId');
            if (!interactions.length) {
                return res.status(404).json({ message: 'No user-word interactions found for this user' });
            }
            res.status(200).json(interactions);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user-word interactions', error: error.message });
        }
    }
);

// @desc    Create or update a user-word interaction
// @route   POST /api/userwords
// @access  Public (for now)
router.post(
    '/',
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('wordId').isMongoId().withMessage('Invalid word ID'),
        body('isMarkedForReview').optional().isBoolean().withMessage('isMarkedForReview must be a boolean'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId, wordId, isMarkedForReview } = req.body;

        try {
            let interaction = await UserWord.findOne({ userId, wordId });

            if (interaction) {
                interaction.encounteredCount += 1;
                if (isMarkedForReview !== undefined) interaction.isMarkedForReview = isMarkedForReview;
                interaction.lastEncounteredAt = Date.now();
            } else {
                interaction = new UserWord({
                    userId,
                    wordId,
                    encounteredCount: 1,
                    isMarkedForReview: isMarkedForReview || false,
                });
            }

            await interaction.save();
            res.status(200).json(interaction);
        } catch (error) {
            res.status(400).json({ message: 'Failed to create or update user-word interaction', error: error.message });
        }
    }
);

// @desc    Update a specific user-word interaction
// @route   PATCH /api/userwords/:id
// @access  Public (for now)
router.patch(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid interaction ID'),
        body('encounteredCount').optional().isInt({ min: 0 }).withMessage('encounteredCount must be a non-negative integer'),
        body('checkedCount').optional().isInt({ min: 0 }).withMessage('checkedCount must be a non-negative integer'),
        body('isMarkedForReview').optional().isBoolean().withMessage('isMarkedForReview must be a boolean'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const updatedInteraction = await UserWord.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedInteraction) {
                return res.status(404).json({ message: 'Interaction not found' });
            }

            res.status(200).json(updatedInteraction);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update interaction', error: error.message });
        }
    }
);

// @desc    Delete a specific user-word interaction
// @route   DELETE /api/userwords/:id
// @access  Public (for now)
router.delete(
    '/:id',
    [
        param('id').isMongoId().withMessage('Invalid interaction ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const deletedInteraction = await UserWord.findByIdAndDelete(id);

            if (!deletedInteraction) {
                return res.status(404).json({ message: 'Interaction not found' });
            }

            res.status(200).json({ message: 'Interaction deleted successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Failed to delete interaction', error: error.message });
        }
    }
);

// @desc    Increment encounter count for a word
// @route   POST /api/userwords/encounter
// @access  Private
router.post(
    '/encounter',
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('wordId').isMongoId().withMessage('Invalid word ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId, wordId } = req.body;

        try {
            let userWord = await UserWord.findOne({ userId, wordId });
            if (!userWord) {
                userWord = new UserWord({ userId, wordId });
            }

            userWord.encounteredCount += 1;
            userWord.lastEncounteredAt = Date.now();
            await userWord.save();

            res.status(200).json({ message: 'Encounter logged', userWord });
        } catch (error) {
            res.status(500).json({ message: 'Error logging encounter', error: error.message });
        }
    }
);

// @desc    Increment checked count for a word
// @route   POST /api/userwords/check
// @access  Private
router.post(
    '/check',
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('wordId').isMongoId().withMessage('Invalid word ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId, wordId } = req.body;

        try {
            let userWord = await UserWord.findOne({ userId, wordId });
            if (!userWord) {
                userWord = new UserWord({ userId, wordId });
            }

            userWord.checkedCount += 1;
            await userWord.save();

            res.status(200).json({ message: 'Checked count incremented', userWord });
        } catch (error) {
            res.status(500).json({ message: 'Error logging check', error: error.message });
        }
    }
);

// @desc    Toggle review status for a word
// @route   PATCH /api/userwords/review
// @access  Private
router.patch(
    '/review',
    [
        body('userId').isMongoId().withMessage('Invalid user ID'),
        body('wordId').isMongoId().withMessage('Invalid word ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId, wordId } = req.body;

        try {
            let userWord = await UserWord.findOne({ userId, wordId });
            if (!userWord) {
                userWord = new UserWord({ userId, wordId });
            }

            userWord.isMarkedForReview = !userWord.isMarkedForReview;
            await userWord.save();

            res.status(200).json({ message: 'Review status toggled', userWord });
        } catch (error) {
            res.status(500).json({ message: 'Error toggling review status', error: error.message });
        }
    }
);

module.exports = router;

