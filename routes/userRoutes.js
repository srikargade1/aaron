const express = require('express');
const router = express.Router();
const { body, validationResult, param } = require('express-validator');
const User = require('../models/userModel');
const argon2 = require('argon2');

// Middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// @desc    Get all users
// @route   GET /api/users
// @access  Public
router.get('/', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: 'Failed to fetch users', error: error.message });
    }
});

// @desc    Get a user by ID
// @route   GET /api/users/:id
// @access  Public
router.get(
    '/:id',
    [
        // Validate the user ID
        param('id').isMongoId().withMessage('Invalid user ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const user = await User.findById(id);
            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(200).json(user);
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch user', error: error.message });
        }
    }
);

// @desc    Create a new user
// @route   POST /api/users
// @access  Public
router.post(
    '/',
    [
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('email').isEmail().withMessage('Valid email is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
        body('proficiencyLevel')
            .isIn(['Beginner', 'Intermediate', 'Advanced'])
            .withMessage('Proficiency level must be Beginner, Intermediate, or Advanced'),
        body('learningLanguage').notEmpty().withMessage('Learning language is required'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { firstName, lastName, email, password, proficiencyLevel, learningLanguage } = req.body;

        try {
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'Email is already registered' });
            }

            const hashedPassword = await argon2.hash(password);

            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                proficiencyLevel,
                learningLanguage,
            });

            await newUser.save();
            res.status(201).json({ message: 'User registered successfully', user: newUser });
        } catch (error) {
            res.status(500).json({ message: 'Failed to create user', error: error.message });
        }
    }
);

// @desc    Update a user by ID
// @route   PUT /api/users/:id
// @access  Public
router.put(
    '/:id',
    [
        // Validate the user ID
        param('id').isMongoId().withMessage('Invalid user ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
        const { id } = req.params;

        try {
            const updatedUser = await User.findByIdAndUpdate(id, req.body, {
                new: true,
                runValidators: true,
            });

            if (!updatedUser) {
                return res.status(404).json({ message: 'User not found' });
            }

            res.status(200).json(updatedUser);
        } catch (error) {
            res.status(400).json({ message: 'Failed to update user', error: error.message });
        }
    }
);

// @desc    Delete a user by ID
// @route   DELETE /api/users/:id
// @access  Public
router.delete(
    '/:id',
    [
        // Validate the user ID
        param('id').isMongoId().withMessage('Invalid user ID'),
    ],
    handleValidationErrors,
    async (req, res) => {
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
    }
);

module.exports = router;
