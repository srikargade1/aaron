const express = require('express');
const router = express.Router();

// Placeholder route for translating text
router.post('/translate', (req, res) => {
    res.send('Translation endpoint is working!');
});

module.exports = router;
