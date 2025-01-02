const express = require('express');
const router = express.Router();
const UserWord = require('../models/userWordModel'); // Import the UserWord model

// @desc    Get all user-word interactions for a user
// @route   GET /api/userwords/:userId
// @access  Public (for now)
router.get('/:userId', async (req, res) => {
    const { userId } = req.params;

    try {
        const interactions = await UserWord.find({ userId }).populate('wordId'); // Fetch interactions and populate word details
        res.status(200).json(interactions);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch user-word interactions', error: error.message });
    }
});

// @desc    Create or update a user-word interaction
// @route   POST /api/userwords
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { userId, wordId, isMarkedForReview } = req.body;

    try {
        // Find existing interaction
        let interaction = await UserWord.findOne({ userId, wordId });

        if (interaction) {
            // Update the existing interaction
            interaction.encounteredCount += 1; // Increment the encountered count
            if (isMarkedForReview !== undefined) interaction.isMarkedForReview = isMarkedForReview;
            interaction.lastEncounteredAt = new Date(); // Update the last encountered time
        } else {
            // Create a new interaction
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
});

// @desc    Update a specific user-word interaction
// @route   PATCH /api/userwords/:id
// @access  Public (for now)
router.patch('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedInteraction = await UserWord.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure schema validation
        });

        if (!updatedInteraction) {
            return res.status(404).json({ message: 'Interaction not found' });
        }

        res.status(200).json(updatedInteraction);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update interaction', error: error.message });
    }
});

// @desc    Delete a specific user-word interaction
// @route   DELETE /api/userwords/:id
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
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
});

module.exports = router;
