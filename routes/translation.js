const express = require('express');
const router = express.Router();
const axios = require('axios');
const Word = require('../models/wordModel'); // Adjust the path to your Mongoose model
const multer = require('multer');
const fs = require('fs').promises;
const path = require('path'); 

const upload = multer({ dest: 'uploads/' });


router.get('/word/:word', async (req, res) => {
    const word = req.params.word;

    try {
        // Define the system prompt
        const systemPrompt = `
You are a helpful French language assistant. For a given French word, provide the following:
1. The word itself.
2. An array of meanings, where each meaning includes:
   - A definition (required).
   - A usage example (optional).
3. Optional grammar notes about the word.

Respond in JSON format like this:
{
    "word": "Bonjour",
    "meanings": [
        {
            "definition": "Hello",
            "usageExample": "Bonjour, comment ça va?"
        },
        {
            "definition": "Good day",
            "usageExample": "Bonjour, monsieur!"
        }
    ],
    "grammarNotes": "Common greeting in French."
}
`;

        // Define the request data for the Deepseek API
        const data = {
            messages: [
                {
                    role: "system",
                    content: systemPrompt
                },
                {
                    role: "user",
                    content: `Provide the details for the French word: ${word}`
                }
            ],
            model: "deepseek-chat",
            temperature: 0.7,
            max_tokens: 500,
        };

        // Define the Axios configuration
        const config = {
            method: 'post',
            url: 'https://api.deepseek.com/chat/completions',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer sk-dd5aeb2a76a34e169867622bb28de685` // Replace with your actual API key
            },
            data: data
        };

        // Send the request to the Deepseek API
        const response = await axios(config);

        // Extract the AI-generated response
        const aiResponse = response.data.choices[0].message.content;

        // Clean the response (remove code block)
        const cleanedResponse = aiResponse.replace(/```json\n|\n```/g, '');

        // Parse the cleaned JSON string into an object
        const wordDetails = JSON.parse(cleanedResponse);

        // Save the word details to the database
        const newWord = new Word(wordDetails);
        await newWord.save();

        // Send the response back to the client
        res.json({
            success: true,
            message: 'Word saved successfully!',
            wordDetails: newWord
        });

    } catch (error) {
        console.error('Error calling Deepseek API:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing your request.',
            error: error.message
        });
    }
});

// @desc    Translate all the words in the given text.
// @route   POST /api/translation/sentence
// @access  Public
router.post('/sentence', upload.single('textfile'), async (req, res) => {
    if (!req.file) {
        return res.status(400).send('No file uploaded.');
    }

    const filePath = req.file.path;

    try {
        // Read the text file using the promise-based fs.readFile
        const fileContent = await fs.readFile(filePath, 'utf8'); // Correct usage

        // Split the file content into words
        const words = fileContent.split(/\s+/); // Split by whitespace

        // Array to store responses for each word
        const wordResponses = [];

        // Loop through each word and call the /word/:word route
        for (const word of words) {
            try {
                // Call the /word/:word route internally
                const response = await axios.get(`http://localhost:3000/api/translation/word/${encodeURIComponent(word)}`);
                wordResponses.push(response.data);
            } catch (error) {
                console.error(`Error processing word "${word}":`, error.message);
                wordResponses.push({
                    word: word,
                    error: `Failed to process word: ${error.message}`
                });
            }
        }

        // Send the aggregated responses back to the client
        res.json({
            success: true,
            message: 'All words processed successfully!',
            wordResponses: wordResponses
        });

    } catch (error) {
        console.error('Error processing the text file:', error);
        res.status(500).json({
            success: false,
            message: 'An error occurred while processing the text file.',
            error: error.message
        });
    }
});
// @desc    Get a sentence translation from the api
// @route   GET /api/translation/article/:articleid
// @access  Public
router.get('/article/:articleid', (req, res) => {
    const { articleID } = req.params.articleid;
    res.send("This route is for adding all the missing words in an uploaded article to the database.");
});

module.exports = router;
