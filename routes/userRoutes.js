const express = require('express');
const router = express.Router();
const User = require('../models/userModel'); // Import the User model

// @desc    Get all users
// @route   GET /api/users
// @access  Public (for now)
router.get('/', async (req, res) => {
    try {
        const users = await User.find(); // Fetch all users from the database
        res.status(200).json(users); // Send the users as a JSON response
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// @desc    Create a new user
// @route   POST /api/users
// @access  Public (for now)
router.post('/', async (req, res) => {
    const { firstName, lastName, email, password, proficiencyLevel, learningLanguage } = req.body;

    try {
        const newUser = new User({
            firstName,
            lastName,
            email,
            password, // Note: Password should be hashed before saving (we'll handle this later)
            proficiencyLevel,
            learningLanguage,
        });

        await newUser.save(); // Save the new user to the database
        res.status(201).json(newUser); // Send the newly created user as a response
    } catch (error) {
        res.status(400).json({ message: 'Failed to create user', error: error.message });
    }
});

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Public (for now)
router.put('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, req.body, {
            new: true, // Return the updated document
            runValidators: true, // Ensure schema validation
        });

        if (!updatedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json(updatedUser);
    } catch (error) {
        res.status(400).json({ message: 'Failed to update user', error: error.message });
    }
});

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Public (for now)
router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const deletedUser = await User.findByIdAndDelete(id);

        if (!deletedUser) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Failed to delete user', error: error.message });
    }
});

module.exports = router;
