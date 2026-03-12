const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Destination = require('./models/Destination');
const { destinations } = require('./seedData'); // I'll create this from the TS file

dotenv.config();

const seedDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('Connected to MongoDB for seeding...');

        await Destination.deleteMany({});
        console.log('Cleared existing destinations');

        await Destination.insertMany(destinations);
        console.log(`Successfully seeded ${destinations.length} destinations!`);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

seedDB();
