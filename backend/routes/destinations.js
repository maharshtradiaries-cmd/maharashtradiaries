const express = require('express');
const router = express.Router();
const Destination = require('../models/Destination');
const { verifyToken } = require('../middleware/auth');

// @route   GET api/destinations
// @desc    Get all destinations
// @access  Public
router.get('/', async (req, res) => {
    try {
        const destinations = await Destination.find().sort({ title: 1 });
        res.json(destinations);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   GET api/destinations/:id
// @desc    Get destination by id
// @access  Public
router.get('/:id', async (req, res) => {
    try {
        const destination = await Destination.findOne({ id: req.params.id }).populate('reviews.user', 'username');
        if (!destination) {
            return res.status(404).json({ msg: 'Destination not found' });
        }
        res.json(destination);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/destinations/:id/reviews
// @desc    Add a review and update rating
// @access  Private
router.post('/:id/reviews', verifyToken, async (req, res) => {
    try {
        const { rating, comment } = req.body;
        const destination = await Destination.findOne({ id: req.params.id });

        if (!destination) {
            return res.status(404).json({ msg: 'Destination not found' });
        }

        const newReview = {
            user: req.userId,
            rating: Number(rating),
            comment,
            date: new Date()
        };

        destination.reviews.unshift(newReview);

        // Update average rating
        const totalRating = destination.reviews.reduce((acc, item) => item.rating + acc, 0);
        destination.rating = totalRating / destination.reviews.length;

        await destination.save();

        // Return populated destination
        const updatedDest = await Destination.findOne({ id: req.params.id }).populate('reviews.user', 'username');
        res.json(updatedDest);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
