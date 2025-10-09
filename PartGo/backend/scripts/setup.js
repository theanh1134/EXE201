const fs = require('fs');
const path = require('path');

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('✅ Created uploads directory');
} else {
    console.log('📁 Uploads directory already exists');
}

console.log('🚀 Setup completed! You can now run:');
console.log('npm run seed  # To seed the database');
console.log('npm run dev   # To start the development server');








