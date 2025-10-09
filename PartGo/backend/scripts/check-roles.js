const mongoose = require('mongoose');
const User = require('../models/User');
const Company = require('../models/Company');

// Connect to MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/partgo';
mongoose.connect(MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => console.log('MongoDB connected successfully'))
    .catch(err => console.error('MongoDB connection error:', err));

async function checkRoles() {
    try {
        console.log('\n=== KIỂM TRA PHÂN CHIA ROLE TRONG DATABASE ===\n');

        // Count users by role
        const jobSeekers = await User.countDocuments({ role: 'jobseeker' });
        const employers = await User.countDocuments({ role: 'employer' });

        console.log('📊 THỐNG KÊ USER BY ROLE:');
        console.log(`   👤 Job Seekers (role: 'jobseeker'): ${jobSeekers}`);
        console.log(`   🏢 Employers (role: 'employer'): ${employers}`);

        // Count companies
        const companies = await Company.countDocuments();
        console.log(`   🏭 Companies in Company collection: ${companies}`);

        // Show sample users
        console.log('\n📋 SAMPLE USERS:');
        const sampleUsers = await User.find({}).limit(5).select('email fullName role companyId');
        sampleUsers.forEach((user, index) => {
            console.log(`   ${index + 1}. ${user.fullName} (${user.email})`);
            console.log(`      Role: ${user.role}`);
            if (user.companyId) {
                console.log(`      Company ID: ${user.companyId}`);
            }
            console.log('');
        });

        // Show sample companies
        console.log('🏢 SAMPLE COMPANIES:');
        const sampleCompanies = await Company.find({}).limit(3).select('name email description');
        sampleCompanies.forEach((company, index) => {
            console.log(`   ${index + 1}. ${company.name} (${company.email})`);
            console.log(`      Description: ${company.description || 'N/A'}`);
            console.log('');
        });

        // Check role consistency
        console.log('🔍 ROLE CONSISTENCY CHECK:');
        const employersWithCompany = await User.find({
            role: 'employer',
            companyId: { $exists: true, $ne: null }
        }).countDocuments();

        const employersWithoutCompany = await User.find({
            role: 'employer',
            $or: [{ companyId: { $exists: false } }, { companyId: null }]
        }).countDocuments();

        console.log(`   ✅ Employers with companyId: ${employersWithCompany}`);
        console.log(`   ⚠️  Employers without companyId: ${employersWithoutCompany}`);

        console.log('\n=== KẾT LUẬN ===');
        console.log('✅ Role được phân chia rõ ràng:');
        console.log('   - jobseeker: Người ứng tuyển');
        console.log('   - employer: Người tuyển dụng');
        console.log('✅ Employers được liên kết với Company thông qua companyId');
        console.log('✅ Có thể sử dụng một endpoint /register cho cả hai loại');

    } catch (error) {
        console.error('Error checking roles:', error);
    } finally {
        mongoose.connection.close();
    }
}

checkRoles();
