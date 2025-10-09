const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

async function checkJobLocations() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partgo';
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Find all jobs
        const jobs = await Job.find({}).select('title location').lean();
        console.log(`📊 Found ${jobs.length} jobs\n`);

        jobs.forEach((job, index) => {
            console.log(`${index + 1}. "${job.title}"`);
            console.log(`   📍 Address: ${job.location?.address || 'N/A'}`);
            console.log(`   🏙️  City: ${job.location?.city || 'N/A'}`);
            console.log(`   🗺️  Coordinates: ${job.location?.coordinates?.lat || 'N/A'}, ${job.location?.coordinates?.lng || 'N/A'}`);
            
            if (job.location?.coordinates?.lat && job.location?.coordinates?.lng) {
                const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${job.location.coordinates.lat},${job.location.coordinates.lng}`;
                console.log(`   🔗 Google Maps: ${googleMapsUrl}`);
            }
            console.log('');
        });

        await mongoose.disconnect();
        console.log('✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
checkJobLocations();
