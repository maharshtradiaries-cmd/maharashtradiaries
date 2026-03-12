const mongoose = require('mongoose');

const TripSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    steps: [{
        id: String,
        placeId: String,
        place: String,
        date: String,
        activity: String,
        image: String,
        cost: Number,
        howToReach: String,
        lat: Number,
        lng: Number
    }],
    splitCost: {
        groupSize: { type: Number, default: 1 },
        totalCost: { type: Number, default: 0 },
        costPerPerson: { type: Number, default: 0 }
    },
    startDate: Date,
    endDate: Date,
    budget: Number,
    region: String,
    travelType: String,
    notes: String,
    isCompleted: {
        type: Boolean,
        default: false
    },
    rating: Number,
    review: String
}, { timestamps: true });

module.exports = mongoose.model('Trip', TripSchema);
