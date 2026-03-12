const express = require('express');
const router = express.Router();
const Trip = require('../models/Trip');
const { verifyToken } = require('../middleware/auth');

// @route   GET api/trips
// @desc    Get user trips
// @access  Private
router.get('/', verifyToken, async (req, res) => {
    try {
        const trips = await Trip.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(trips);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/trips
// @desc    Create a trip
// @access  Private
router.post('/', verifyToken, async (req, res) => {
    const { title, steps, splitCost, startDate, endDate, budget, region, travelType, notes } = req.body;

    try {
        const newTrip = new Trip({
            user: req.user.id,
            title,
            steps,
            splitCost,
            startDate,
            endDate,
            budget,
            region,
            travelType,
            notes
        });

        const trip = await newTrip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/trips/:id
// @desc    Update a trip (mark as completed, add review)
// @access  Private
router.put('/:id', verifyToken, async (req, res) => {
    const { isCompleted, rating, review } = req.body;

    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Check user
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        if (isCompleted !== undefined) trip.isCompleted = isCompleted;
        if (rating !== undefined) trip.rating = rating;
        if (review !== undefined) trip.review = review;

        await trip.save();
        res.json(trip);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});


// @route   DELETE api/trips/:id
// @desc    Delete a trip
// @access  Private
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const trip = await Trip.findById(req.params.id);

        if (!trip) {
            return res.status(404).json({ msg: 'Trip not found' });
        }

        // Check user
        if (trip.user.toString() !== req.user.id) {
            return res.status(401).json({ msg: 'User not authorized' });
        }

        await trip.deleteOne();
        res.json({ msg: 'Trip removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
