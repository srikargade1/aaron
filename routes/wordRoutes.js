const express = require('express');
const router = express.Router();
const Word = require('../models/wordModel'); // Import the Word model

// @desc    Get all words
// @route   GET /api/words
// @access  Public
router.get('/', async (req, res) => {
    try {
        const words = await Word.find(); // Fetch all words from the database
        res.status(200).json(words); // Send the words as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch words', error: error.message });
    }
});

// @desc    Add a new word
// @route   POST /api/words
// @access  Public
router.post('/', async (req, res) => {
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
        res.status(400).json({ message: 'Failed to add word', error: error.message });
    }
});

// @desc    Get a word by ID
// @route   GET /api/words/:id
// @access  Public
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const word = await Word.findById(id); // Find word by ID
        if (!word) {
            return res.status(404).json({ message: 'Word not found' });
        }
        res.status(200).json(word);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch word', error: error.message });
    }
});

// @desc    Update a word by ID
// @route   PUT /api/words/:id
// @access  Public
router.put('/:id', async (req, res) => {
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
        res.status(400).json({ message: 'Failed to update word', error: error.message });
    }
});

// @desc    Delete a word by ID
// @route   DELETE /api/words/:id
// @access  Public
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedWord = await Word.findByIdAndDelete(id);

        if (!deletedWord) {
            return res.status(404).json({ message: 'Word not found' });
        }

        res.status(200).json({ message: 'Word deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete word', error: error.message });
    }
});

module.exports = router;
