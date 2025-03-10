const express = require('express');
const router = express.Router();


// Placeholder route for translating text
router.post('/translate', (req, res) => {
    res.send('Translation endpoint is working!');
});

// @desc    Get a word translation from the api
// @route   GET /api/translate/word/:word
// @access  Public
router.get('/word/:word', (req, res) => {
    res.send("okay");
})

// @desc    Get a sentence translation from the api
// @route   GET /api/translate/sentence/:sentence
// @access  Public
router.get('/sentence/:sentence', (req, res) => {
    res.send("fire")
})

module.exports = router;
