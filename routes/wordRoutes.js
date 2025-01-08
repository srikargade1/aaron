const express = require('express');
const router = express.Router();
const { body, param, validationResult } = require('express-validator');
const Word = require('../models/wordModel'); // Import the Word model

// @desc    Get all words
// @route   GET /api/words
// @access  Public
router.get('/', async (req, res) => {
    try {
        const words = await Word.find(); // Fetch all words from the database
        res.status(200).json(words); // Send the words as a JSON response
    } catch (error) {
        console.error('Error fetching words:', error.message);
        res.status(500).json({ message: 'Failed to fetch words', error: error.message });
    }
});

// @desc    Add a new word
// @route   POST /api/words
// @access  Public
router.post(
    '/',
    [
        // Validation rules
        body('word').notEmpty().withMessage('Word is required'),
        body('meanings')
            .isArray({ min: 1 })
            .withMessage('Meanings must be an array with at least one entry'),
        body('meanings.*.definition').notEmpty().withMessage('Each meaning must have a definition'),
        body('meanings.*.usageExample')
            .optional()
            .isString()
            .withMessage('Usage example must be a string'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { word, meanings, grammarNotes } = req.body;

        try {
            const newWord = new Word({
                word,
                meanings, // Array of meanings
                grammarNotes,
            });

            await newWord.save(); // Save the new word to the database
            res.status(201).json(newWord); // Send the newly created word as a response
        } catch (error) {
            console.error('Error adding word:', error.message);
            res.status(400).json({ message: 'Failed to add word', error: error.message });
        }
    }
);

// @desc    Get a word by ID
// @route   GET /api/words/:id
// @access  Public
router.get(
    '/:id',
    [
        // Validation rule for word ID
        param('id').isMongoId().withMessage('Invalid word ID'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const word = await Word.findById(id); // Find word by ID
            if (!word) {
                return res.status(404).json({ message: 'Word not found' });
            }
            res.status(200).json(word);
        } catch (error) {
            console.error('Error fetching word:', error.message);
            res.status(500).json({ message: 'Failed to fetch word', error: error.message });
        }
    }
);

// @desc    Update a word by ID
// @route   PUT /api/words/:id
// @access  Public
router.put(
    '/:id',
    [
        // Validation rules
        param('id').isMongoId().withMessage('Invalid word ID'),
        body('word').optional().notEmpty().withMessage('Word cannot be empty'),
        body('meanings')
            .optional()
            .isArray({ min: 1 })
            .withMessage('Meanings must be an array with at least one entry'),
        body('meanings.*.definition')
            .optional()
            .notEmpty()
            .withMessage('Each meaning must have a definition'),
        body('meanings.*.usageExample')
            .optional()
            .isString()
            .withMessage('Usage example must be a string'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const updatedWord = await Word.findByIdAndUpdate(id, req.body, {
                new: true, // Return the updated document
                runValidators: true, // Ensure schema validation
            });

            if (!updatedWord) {
                return res.status(404).json({ message: 'Word not found' });
            }

            res.status(200).json(updatedWord);
        } catch (error) {
            console.error('Error updating word:', error.message);
            res.status(400).json({ message: 'Failed to update word', error: error.message });
        }
    }
);

// @desc    Delete a word by ID
// @route   DELETE /api/words/:id
// @access  Public
router.delete(
    '/:id',
    [
        // Validation rule for word ID
        param('id').isMongoId().withMessage('Invalid word ID'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { id } = req.params;

        try {
            const deletedWord = await Word.findByIdAndDelete(id);

            if (!deletedWord) {
                return res.status(404).json({ message: 'Word not found' });
            }

            res.status(200).json({ message: 'Word deleted successfully' });
        } catch (error) {
            console.error('Error deleting word:', error.message);
            res.status(500).json({ message: 'Failed to delete word', error: error.message });
        }
    }
);

module.exports = router;

