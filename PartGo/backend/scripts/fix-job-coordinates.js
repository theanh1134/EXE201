const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

// Danh sách tọa độ mặc định cho các thành phố Việt Nam
const cityCoordinates = {
    'Ho Chi Minh City': { lat: 10.8231, lng: 106.6297 },
    'Hồ Chí Minh': { lat: 10.8231, lng: 106.6297 },
    'Hanoi': { lat: 21.0285, lng: 105.8542 },
    'Hà Nội': { lat: 21.0285, lng: 105.8542 },
    'Da Nang': { lat: 16.0544, lng: 108.2022 },
    'Đà Nẵng': { lat: 16.0544, lng: 108.2022 },
    'Hai Phong': { lat: 20.8449, lng: 106.6881 },
    'Hải Phòng': { lat: 20.8449, lng: 106.6881 },
    'Can Tho': { lat: 10.0452, lng: 105.7469 },
    'Cần Thơ': { lat: 10.0452, lng: 105.7469 },
    'Bien Hoa': { lat: 10.9510, lng: 106.8340 },
    'Biên Hòa': { lat: 10.9510, lng: 106.8340 },
    'Nha Trang': { lat: 12.2388, lng: 109.1967 },
    'Hue': { lat: 16.4637, lng: 107.5909 },
    'Huế': { lat: 16.4637, lng: 107.5909 },
    'Vung Tau': { lat: 10.3460, lng: 107.0843 },
    'Vũng Tàu': { lat: 10.3460, lng: 107.0843 },
    'Hòa Lạc': { lat: 21.0150, lng: 105.5260 },
    'Hoa Lac': { lat: 21.0150, lng: 105.5260 }
};

// Hàm lấy tọa độ từ tên thành phố
function getCoordinatesForCity(cityName) {
    if (!cityName) return null;
    
    // Tìm exact match
    if (cityCoordinates[cityName]) {
        return cityCoordinates[cityName];
    }
    
    // Tìm partial match
    const cityLower = cityName.toLowerCase();
    for (const [key, coords] of Object.entries(cityCoordinates)) {
        if (key.toLowerCase().includes(cityLower) || cityLower.includes(key.toLowerCase())) {
            return coords;
        }
    }
    
    // Default to Hanoi if not found
    console.log(`⚠️  Không tìm thấy tọa độ cho "${cityName}", dùng Hà Nội mặc định`);
    return { lat: 21.0285, lng: 105.8542 };
}

async function fixJobCoordinates() {
    try {
        // Connect to MongoDB
        const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partgo';
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ Connected to MongoDB');

        // Find all jobs
        const jobs = await Job.find({});
        console.log(`📊 Found ${jobs.length} jobs`);

        let fixedCount = 0;
        let alreadyHaveCoords = 0;
        let errors = 0;

        for (const job of jobs) {
            try {
                // Check if job already has coordinates
                if (job.location?.coordinates?.lat && job.location?.coordinates?.lng) {
                    alreadyHaveCoords++;
                    console.log(`✓ Job "${job.title}" already has coordinates`);
                    continue;
                }

                // Get city name
                const cityName = job.location?.city || job.location?.address;
                if (!cityName) {
                    console.log(`⚠️  Job "${job.title}" has no city information`);
                    errors++;
                    continue;
                }

                // Get coordinates
                const coords = getCoordinatesForCity(cityName);
                if (!coords) {
                    console.log(`❌ Could not get coordinates for "${cityName}"`);
                    errors++;
                    continue;
                }

                // Update job
                if (!job.location) {
                    job.location = {};
                }
                if (!job.location.coordinates) {
                    job.location.coordinates = {};
                }
                
                job.location.coordinates.lat = coords.lat;
                job.location.coordinates.lng = coords.lng;
                
                // Ensure city is set
                if (!job.location.city) {
                    job.location.city = cityName;
                }
                
                // Ensure address is set
                if (!job.location.address) {
                    job.location.address = cityName;
                }

                await job.save();
                fixedCount++;
                console.log(`✅ Fixed coordinates for "${job.title}" (${cityName}): ${coords.lat}, ${coords.lng}`);
            } catch (error) {
                console.error(`❌ Error fixing job "${job.title}":`, error.message);
                errors++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Total jobs: ${jobs.length}`);
        console.log(`   ✅ Fixed: ${fixedCount}`);
        console.log(`   ✓ Already had coordinates: ${alreadyHaveCoords}`);
        console.log(`   ❌ Errors: ${errors}`);

        await mongoose.disconnect();
        console.log('\n✅ Disconnected from MongoDB');
        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error);
        process.exit(1);
    }
}

// Run the script
fixJobCoordinates();

