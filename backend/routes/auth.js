const express = require('express');
const User = require('../models/User');
const { generateToken, verifyToken } = require('../middleware/auth');
const { sendWelcomeEmail } = require('../utils/email');

const router = express.Router();

// POST /api/auth/signup
router.post('/signup', async (req, res) => {
    try {
        const { username, email, password, age } = req.body;

        // Validation
        if (!username || !email || !password || !age) {
            return res.status(400).json({ message: 'All fields are required.' });
        }

        if (age < 13) {
            return res.status(400).json({ message: 'You must be at least 13 years old to register.' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({
            $or: [{ email }, { username }]
        });

        if (existingUser) {
            if (existingUser.email === email) {
                return res.status(400).json({ message: 'Email is already registered. Please sign in instead.' });
            }
            return res.status(400).json({ message: 'Username is already taken. Please choose a different one or sign in.' });
        }

        // Create new user
        const user = new User({ username, email, password, age });
        await user.save();

        // Send Welcome Email (async, don't wait for it to respond to user)
        sendWelcomeEmail(email, username).catch(err => console.error('Delayed welcome email error:', err));

        // Generate token
        const token = generateToken(user._id);

        res.status(201).json({
            message: 'Account created successfully!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                favorites: user.favorites || [],
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Signup error:', error);
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(e => e.message);
            return res.status(400).json({ message: messages[0] });
        }
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email/Username and password are required.' });
        }

        // Find user by either email OR username
        const user = await User.findOne({
            $or: [{ email: email }, { username: email }]
        });

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials. User not found.' });
        }

        // Check password
        const isMatch = await user.comparePassword(password);
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials. Incorrect password.' });
        }

        // Generate token
        const token = generateToken(user._id);

        res.json({
            message: 'Login successful!',
            token,
            user: {
                id: user._id,
                username: user.username,
                email: user.email,
                age: user.age,
                favorites: user.favorites || [],
                createdAt: user.createdAt
            }
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error. Please try again later.' });
    }
});

// GET /api/auth/me - Get current user profile
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.userId).select('-password');
        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }
        res.json({ user });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error.' });
    }
});

// POST /api/auth/favorites - Toggle favorite destination
router.post('/favorites', verifyToken, async (req, res) => {
    try {
        const { destinationId } = req.body;
        const user = await User.findById(req.userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        if (!user.favorites) user.favorites = [];

        if (!user.favorites) user.favorites = [];

        const isFavorite = user.favorites.includes(destinationId);
        if (isFavorite) {
            user.favorites = user.favorites.filter(id => id !== destinationId);
        } else {
            user.favorites.push(destinationId);
        }

        await user.save();
        res.json({ favorites: user.favorites });
    } catch (error) {
        console.error('Favorite toggle error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
