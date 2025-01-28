const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const UserWord = require('../models/userWordModel'); 

// @desc    Fetch user statistics like total articles, total words, articles left
// @route   GET /api/users
// @access  Public
router.get('/:id', async (req, res) => {
    try
    {


    }
    catch (error)
    {

    }

});



// @desc    Statistics about words user has interacted with
// @route   GET /api/users
// @access  Public
router.get('/word/:userId', async (req, res) => {
    const { userId } = req.params;
    try 
    {
        const wordResults = await UserWord.find({ userId });
        res.status(200).json(wordResults.length);
    }
    catch (error) 
    {
        res.status(500).json({ message: 'Failed to fetch user statistics', error: error.message });
    }
});


// @desc    Statistics about articles user has interacted with
// @route   GET /api/users
// @access  Public

module.exports = router;