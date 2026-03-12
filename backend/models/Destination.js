const mongoose = require('mongoose');

const DestinationSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    description: { type: String, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    region: { type: String, required: true },
    howToReach: { type: String },
    travelTime: { type: String },
    activities: { type: String },
    cost: { type: Number },
    duration: { type: String },
    mapLink: { type: String },
    lat: { type: Number, default: 19.7515 }, // Center of MH
    lng: { type: Number, default: 75.7139 },
    rating: { type: Number, default: 4.5 },
    reviews: [{
        user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        comment: String,
        rating: Number,
        date: { type: Date, default: Date.now }
    }]
}, { timestamps: true });

module.exports = mongoose.model('Destination', DestinationSchema);
