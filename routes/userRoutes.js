const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const User = require('../models/userModel'); // Import the User model
const argon2 = require('argon2');
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
// Register User Route
router.post(
    '/',
    [
        // Validation rules
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password')
            .isLength({ min: 6 })
            .withMessage('Password must be at least 6 characters long'),
        body('proficiencyLevel')
            .isIn(['Beginner', 'Intermediate', 'Advanced'])
            .withMessage('Proficiency level must be Beginner, Intermediate, or Advanced'),
        body('learningLanguage').notEmpty().withMessage('Learning language is required'),
    ],
    async (req, res) => {
        // Extract validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, proficiencyLevel, learningLanguage } = req.body;

        try {
            // Check if the email is already registered
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            // Hash the password before saving
            const hashedPassword = await argon2.hash(password);

            // Create a new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword, // Save the hashed password
                proficiencyLevel,
                learningLanguage,
            });

            await newUser.save(); // Save the new user to the database
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            console.error('Error registering user:', error.message);
            res.status(500).json({ message: 'Failed to create user', error: error.message });
        }
    }
);


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
