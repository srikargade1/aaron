const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const argon2 = require('argon2');
const User = require('../models/userModel');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const { body, validationResult } = require('express-validator');
router.post(
    '/register',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
        body('firstName').notEmpty().withMessage('First name is required'),
        body('lastName').notEmpty().withMessage('Last name is required'),
        body('proficiencyLevel').isIn(['Beginner', 'Intermediate', 'Advanced']).withMessage('Invalid proficiency level'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { firstName, lastName, email, password, proficiencyLevel, learningLanguage } = req.body;

        try {
            // Check if user already exists
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                return res.status(400).json({ message: 'User already exists' });
            }

            // Hash the password
            const hashedPassword = await argon2.hash(password);

            // Create new user
            const newUser = new User({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                proficiencyLevel,
                learningLanguage,
            });

            await newUser.save();

            res.status(201).json({ message: 'User registered successfully', userId: newUser._id });
        } catch (error) {
            res.status(500).json({ message: 'Error registering user', error: error.message });
        }
    }
);


router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').notEmpty().withMessage('Password is required'),
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const isMatch = await argon2.verify(user.password, password);
            if (!isMatch) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            const refreshToken = jwt.sign({ userId: user._id }, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });

            user.refreshToken = refreshToken;
            await user.save();

            res.status(200).json({ token, refreshToken });
        } catch (error) {
            res.status(500).json({ message: 'Error logging in', error: error.message });
        }
    }
);


// @desc    Refresh JWT
// @route   POST /api/auth/refresh
// @access  Public
router.post('/refresh', async (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'No refresh token provided' });
    }

    try {
        // Verify the refresh token
        const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);

        // Check if the refresh token matches the one in the database
        const user = await User.findById(decoded.userId);
        if (!user || user.refreshToken !== refreshToken) {
            return res.status(403).json({ message: 'Invalid refresh token' });
        }

        // Generate a new JWT
        const newToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

        res.status(200).json({ token: newToken });
    } catch (error) {
        res.status(403).json({ message: 'Invalid refresh token', error: error.message });
    }
});

module.exports = router;
