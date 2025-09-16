// seed.js
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Incident = require('./models/incident');
const Resource = require('./models/resource');
const Event = require('./models/event');
const incidents = require('./data/incidents.json');
const resources = require('./data/resources.json');
const events = require('./data/events.json');

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB Connected for Seeding...');
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

const importData = async () => {
    try {
        await Incident.deleteMany();
        await Resource.deleteMany();
        await Event.deleteMany();

        await Incident.insertMany(incidents);
        await Resource.insertMany(resources);
        await Event.insertMany(events);

        console.log('Data Imported!');
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Incident.deleteMany();
        await Resource.deleteMany();
        await Event.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (err) {
        console.error(`${err}`);
        process.exit(1);
    }
};

const run = async () => {
    await connectDB();
    if (process.argv[2] === '-d') {
        await destroyData();
    } else {
        await importData();
    }
};

run();