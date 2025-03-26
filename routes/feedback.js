const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Feedback = require('../models/feedbackModel'); // Import the Feedback model

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @desc    Submit detailed feedback
// @route   POST /api/feedback
// @access  Public
router.post(
    '/',
    [
        // Validation rules
        body('userId').optional().isMongoId().withMessage('Invalid user ID'),
        body('feedbackText').notEmpty().withMessage('Feedback text is required'),
        body('rating')
            .optional()
            .isInt({ min: 1, max: 5 })
            .withMessage('Rating must be an integer between 1 and 5'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { userId, feedbackText, rating } = req.body;

        try {
            // Create a new feedback entry
            const feedback = new Feedback({
                userId, // Optional: Can be null for anonymous feedback
                feedbackText,
                rating, // Optional: Rating between 1 and 5
            });

            // Save the feedback to the database
            await feedback.save();

            res.status(201).json({ message: 'Feedback submitted successfully', feedback });
        } catch (error) {
            console.error('Error submitting feedback:', error.message);
            res.status(500).json({ message: 'Failed to submit feedback', error: error.message });
        }
    }
);

// @desc    Get all feedback
// @route   GET /api/feedback
// @access  Admin/Private (can be changed based on requirements)
router.get('/', async (req, res) => {
    try {
        const feedbacks = await Feedback.find().populate('userId', 'firstName lastName email'); // Fetch all feedbacks and optionally populate user details
        res.status(200).json(feedbacks);
    } catch (error) {
        console.error('Error fetching feedback:', error.message);
        res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
    }
});

// @desc    Get feedback by ID
// @route   GET /api/feedback/:id
// @access  Admin/Private (can be changed based on requirements)
router.get(
    '/:id',
    [
        // Validation rule for feedback ID (from URL parameter)
        param('id').isMongoId().withMessage('Invalid feedback ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const feedback = await Feedback.findById(id).populate('userId', 'firstName lastName email');
            if (!feedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            res.status(200).json(feedback);
        } catch (error) {
            console.error('Error fetching feedback:', error.message);
            res.status(500).json({ message: 'Failed to fetch feedback', error: error.message });
        }
    }
);

// @desc    Delete feedback by ID
// @route   DELETE /api/feedback/:id
// @access  Admin/Private (can be changed based on requirements)
router.delete(
    '/:id',
    [
        // Validation rule for feedback ID (from URL parameter)
        param('id').isMongoId().withMessage('Invalid feedback ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const deletedFeedback = await Feedback.findByIdAndDelete(id);
            if (!deletedFeedback) {
                return res.status(404).json({ message: 'Feedback not found' });
            }

            res.status(200).json({ message: 'Feedback deleted successfully', feedback: deletedFeedback });
        } catch (error) {
            console.error('Error deleting feedback:', error.message);
            res.status(500).json({ message: 'Failed to delete feedback', error: error.message });
        }
    }
);


module.exports = router;
