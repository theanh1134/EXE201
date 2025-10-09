const mongoose = require('mongoose');
require('dotenv').config();

// Import User model
const User = require('../models/User');

// MongoDB Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partgo';

async function connectDB() {
    try {
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('✅ MongoDB connected successfully');
    } catch (error) {
        console.error('❌ MongoDB connection error:', error);
        process.exit(1);
    }
}

async function deleteTestUser() {
    try {
        console.log('🔍 Searching for Test User...');

        // Tìm user có tên chứa "Test" hoặc email chứa "test"
        const testUsers = await User.find({
            $or: [
                { fullName: { $regex: /test/i } },
                { email: { $regex: /test/i } },
                { fullName: 'Test User' },
                { email: 'test@example.com' }
            ]
        });

        if (testUsers.length === 0) {
            console.log('❌ No Test User found');
            return;
        }

        console.log(`📋 Found ${testUsers.length} test user(s):`);
        testUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName} (${user.email})`);
        });

        // Xóa tất cả test users
        const result = await User.deleteMany({
            $or: [
                { fullName: { $regex: /test/i } },
                { email: { $regex: /test/i } },
                { fullName: 'Test User' },
                { email: 'test@example.com' }
            ]
        });

        console.log(`✅ Deleted ${result.deletedCount} test user(s)`);

        // Hiển thị danh sách users còn lại
        const remainingUsers = await User.find({}, 'fullName email role');
        console.log('\n📊 Remaining users:');
        remainingUsers.forEach((user, index) => {
            console.log(`${index + 1}. ${user.fullName} (${user.email}) - ${user.role}`);
        });

    } catch (error) {
        console.error('❌ Error deleting test user:', error);
    }
}

async function main() {
    try {
        await connectDB();
        await deleteTestUser();
    } catch (error) {
        console.error('❌ Error:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

// Run script
main();





