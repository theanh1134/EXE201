const mongoose = require('mongoose');
const Job = require('../models/Job');
require('dotenv').config();

// Danh sách tọa độ chi tiết cho các địa điểm cụ thể
const specificLocations = {
    // Hà Nội - các quận/huyện/xã
    'tân xã': { lat: 21.1833, lng: 105.7167, city: 'Hà Nội' }, // Tân Xã, Thạch Thất, Hà Nội
    'tan xa': { lat: 21.1833, lng: 105.7167, city: 'Hà Nội' },
    'thạch thất': { lat: 21.1833, lng: 105.7167, city: 'Hà Nội' },
    'thach that': { lat: 21.1833, lng: 105.7167, city: 'Hà Nội' },
    'hòa lạc': { lat: 21.0150, lng: 105.5260, city: 'Hà Nội' },
    'hoa lac': { lat: 21.0150, lng: 105.5260, city: 'Hà Nội' },
    'cầu giấy': { lat: 21.0333, lng: 105.7944, city: 'Hà Nội' },
    'cau giay': { lat: 21.0333, lng: 105.7944, city: 'Hà Nội' },
    'đống đa': { lat: 21.0167, lng: 105.8167, city: 'Hà Nội' },
    'dong da': { lat: 21.0167, lng: 105.8167, city: 'Hà Nội' },
    'hai bà trưng': { lat: 21.0167, lng: 105.8500, city: 'Hà Nội' },
    'hai ba trung': { lat: 21.0167, lng: 105.8500, city: 'Hà Nội' },
    'hoàn kiếm': { lat: 21.0285, lng: 105.8542, city: 'Hà Nội' },
    'hoan kiem': { lat: 21.0285, lng: 105.8542, city: 'Hà Nội' },
    'long biên': { lat: 21.0500, lng: 105.8833, city: 'Hà Nội' },
    'long bien': { lat: 21.0500, lng: 105.8833, city: 'Hà Nội' },
    'tây hồ': { lat: 21.0667, lng: 105.8167, city: 'Hà Nội' },
    'tay ho': { lat: 21.0667, lng: 105.8167, city: 'Hà Nội' },
    'thanh xuân': { lat: 20.9833, lng: 105.8167, city: 'Hà Nội' },
    'thanh xuan': { lat: 20.9833, lng: 105.8167, city: 'Hà Nội' },
    
    // TP.HCM - các quận
    'quận 1': { lat: 10.7769, lng: 106.7009, city: 'Hồ Chí Minh' },
    'quan 1': { lat: 10.7769, lng: 106.7009, city: 'Hồ Chí Minh' },
    'quận 3': { lat: 10.7756, lng: 106.6888, city: 'Hồ Chí Minh' },
    'quan 3': { lat: 10.7756, lng: 106.6888, city: 'Hồ Chí Minh' },
    'quận 5': { lat: 10.7569, lng: 106.6639, city: 'Hồ Chí Minh' },
    'quan 5': { lat: 10.7569, lng: 106.6639, city: 'Hồ Chí Minh' },
    'quận 7': { lat: 10.7378, lng: 106.7197, city: 'Hồ Chí Minh' },
    'quan 7': { lat: 10.7378, lng: 106.7197, city: 'Hồ Chí Minh' },
    'quận 10': { lat: 10.7756, lng: 106.6639, city: 'Hồ Chí Minh' },
    'quan 10': { lat: 10.7756, lng: 106.6639, city: 'Hồ Chí Minh' },
    'thủ đức': { lat: 10.8500, lng: 106.7667, city: 'Hồ Chí Minh' },
    'thu duc': { lat: 10.8500, lng: 106.7667, city: 'Hồ Chí Minh' },
    'bình thạnh': { lat: 10.8019, lng: 106.7097, city: 'Hồ Chí Minh' },
    'binh thanh': { lat: 10.8019, lng: 106.7097, city: 'Hồ Chí Minh' },
    'gò vấp': { lat: 10.8378, lng: 106.6639, city: 'Hồ Chí Minh' },
    'go vap': { lat: 10.8378, lng: 106.6639, city: 'Hồ Chí Minh' },
    
    // Đà Nẵng
    'hải châu': { lat: 16.0678, lng: 108.2208, city: 'Đà Nẵng' },
    'hai chau': { lat: 16.0678, lng: 108.2208, city: 'Đà Nẵng' },
    'thanh khê': { lat: 16.0544, lng: 108.1544, city: 'Đà Nẵng' },
    'thanh khe': { lat: 16.0544, lng: 108.1544, city: 'Đà Nẵng' },
    'sơn trà': { lat: 16.0833, lng: 108.2500, city: 'Đà Nẵng' },
    'son tra': { lat: 16.0833, lng: 108.2500, city: 'Đà Nẵng' },
};

// Hàm tìm tọa độ chính xác
function getSpecificCoordinates(address, city) {
    if (!address) return null;
    
    const addressLower = address.toLowerCase().trim();
    const cityLower = (city || '').toLowerCase().trim();
    
    console.log(`🔍 Searching for: "${addressLower}" in "${cityLower}"`);
    
    // Tìm exact match
    if (specificLocations[addressLower]) {
        console.log(`✅ Found exact match for "${addressLower}"`);
        return specificLocations[addressLower];
    }
    
    // Tìm partial match trong address
    for (const [key, coords] of Object.entries(specificLocations)) {
        if (addressLower.includes(key) || key.includes(addressLower)) {
            console.log(`✅ Found partial match: "${key}" for "${addressLower}"`);
            return coords;
        }
    }
    
    // Tìm trong city nếu không tìm thấy trong address
    if (cityLower && specificLocations[cityLower]) {
        console.log(`✅ Found city match for "${cityLower}"`);
        return specificLocations[cityLower];
    }
    
    console.log(`❌ No specific location found for "${addressLower}" in "${cityLower}"`);
    return null;
}

async function fixSpecificLocations() {
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
        console.log(`📊 Found ${jobs.length} jobs\n`);

        let fixedCount = 0;
        let skippedCount = 0;
        let errors = 0;

        for (const job of jobs) {
            try {
                console.log(`\n🔍 Processing: "${job.title}"`);
                console.log(`   Current address: "${job.location?.address || 'N/A'}"`);
                console.log(`   Current city: "${job.location?.city || 'N/A'}"`);
                console.log(`   Current coords: ${job.location?.coordinates?.lat || 'N/A'}, ${job.location?.coordinates?.lng || 'N/A'}`);

                // Get specific coordinates
                const specificCoords = getSpecificCoordinates(
                    job.location?.address,
                    job.location?.city
                );

                if (!specificCoords) {
                    console.log(`   ⏭️  Skipping - no specific coordinates found`);
                    skippedCount++;
                    continue;
                }

                // Check if coordinates are already correct
                const currentLat = job.location?.coordinates?.lat;
                const currentLng = job.location?.coordinates?.lng;
                
                if (currentLat === specificCoords.lat && currentLng === specificCoords.lng) {
                    console.log(`   ✓ Already has correct coordinates`);
                    skippedCount++;
                    continue;
                }

                // Update coordinates
                if (!job.location) {
                    job.location = {};
                }
                if (!job.location.coordinates) {
                    job.location.coordinates = {};
                }
                
                job.location.coordinates.lat = specificCoords.lat;
                job.location.coordinates.lng = specificCoords.lng;
                
                // Update city if needed
                if (!job.location.city && specificCoords.city) {
                    job.location.city = specificCoords.city;
                }

                await job.save();
                fixedCount++;
                
                console.log(`   ✅ Updated coordinates to: ${specificCoords.lat}, ${specificCoords.lng}`);
                console.log(`   🔗 Google Maps: https://www.google.com/maps/search/?api=1&query=${specificCoords.lat},${specificCoords.lng}`);
                
            } catch (error) {
                console.error(`   ❌ Error processing job "${job.title}":`, error.message);
                errors++;
            }
        }

        console.log('\n📊 Summary:');
        console.log(`   Total jobs: ${jobs.length}`);
        console.log(`   ✅ Fixed: ${fixedCount}`);
        console.log(`   ⏭️  Skipped: ${skippedCount}`);
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
fixSpecificLocations();
