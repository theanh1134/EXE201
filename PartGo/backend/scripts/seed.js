const mongoose = require('mongoose');
require('dotenv').config();

// Import models (path from scripts/ to models/)
const User = require('../models/User');
const Company = require('../models/Company');
const Job = require('../models/Job');
const Application = require('../models/Application');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const BlogPost = require('../models/BlogPost');
const ForumPost = require('../models/ForumPost');

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

async function clearDatabase() {
    console.log('🗑️ Clearing existing data...');
    await User.deleteMany({});
    await Company.deleteMany({});
    await Job.deleteMany({});
    await Application.deleteMany({});
    await Review.deleteMany({});
    await Notification.deleteMany({});
    await BlogPost.deleteMany({});
    await ForumPost.deleteMany({});
    console.log('✅ Database cleared');
}

async function seedUsers() {
    console.log('👥 Seeding users...');

    const users = [
        {
            email: 'nguyenvana@email.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            fullName: 'Nguyễn Văn A',
            phone: '0123456789',
            role: 'jobseeker',
            isVerified: true,
            profile: {
                bio: 'Sinh viên năm 3 ngành Công nghệ thông tin, có kinh nghiệm làm part-time',
                skills: ['JavaScript', 'React', 'Node.js', 'Giao tiếp', 'Làm việc nhóm'],
                experience: [{
                    company: 'Công ty ABC',
                    position: 'Intern Developer',
                    duration: '3 tháng',
                    description: 'Phát triển ứng dụng web với React'
                }],
                education: [{
                    school: 'Đại học FPT',
                    degree: 'Cử nhân Công nghệ thông tin',
                    year: '2021-2025'
                }],
                location: {
                    address: 'Ký túc xá Hòa Lạc',
                    coordinates: { lat: 21.015, lng: 105.526 }
                },
                availability: {
                    schedule: ['afternoon', 'evening', 'weekend'],
                    maxHoursPerWeek: 20,
                    preferredSalary: { min: 25000, max: 50000 }
                }
            },
            preferences: {
                jobCategories: ['Công nghệ', 'Văn phòng', 'Marketing'],
                maxDistance: 10,
                notifications: { email: true, push: true }
            }
        },
        {
            email: 'tranthib@email.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            fullName: 'Trần Thị B',
            phone: '0987654321',
            role: 'jobseeker',
            isVerified: true,
            profile: {
                bio: 'Sinh viên năm 2 ngành Kinh tế, năng động và có kinh nghiệm bán hàng',
                skills: ['Bán hàng', 'Giao tiếp', 'Tiếng Anh', 'Marketing', 'Customer Service'],
                experience: [{
                    company: 'Shopee',
                    position: 'Nhân viên bán hàng',
                    duration: '6 tháng',
                    description: 'Hỗ trợ khách hàng và bán hàng online'
                }],
                education: [{
                    school: 'Đại học Kinh tế Quốc dân',
                    degree: 'Cử nhân Kinh tế',
                    year: '2022-2026'
                }],
                location: {
                    address: 'Ký túc xá Hòa Lạc',
                    coordinates: { lat: 21.012, lng: 105.524 }
                },
                availability: {
                    schedule: ['morning', 'afternoon', 'weekend'],
                    maxHoursPerWeek: 25,
                    preferredSalary: { min: 20000, max: 40000 }
                }
            },
            preferences: {
                jobCategories: ['Bán hàng', 'Marketing', 'Dịch vụ'],
                maxDistance: 15,
                notifications: { email: true, push: true }
            }
        }
    ];

    const createdUsers = await User.insertMany(users);
    console.log(`✅ Created ${createdUsers.length} users`);
    return createdUsers;
}

async function seedCompanies() {
    console.log('🏢 Seeding companies...');

    const companyData = [
        {
            email: 'sieuthihoalac@company.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Siêu thị Hòa Lạc',
            description: 'Siêu thị hàng đầu tại khu vực Hòa Lạc, chuyên cung cấp các sản phẩm chất lượng cao cho cộng đồng sinh viên và người dân địa phương.',
            website: 'www.sieuthihoalac.com',
            phone: '0241234567',
            address: {
                street: '123 Đường Hòa Lạc',
                district: 'Thạch Thất',
                city: 'Hà Nội',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            industry: 'Bán lẻ',
            size: 'medium',
            foundedYear: 2018,
            socialMedia: {
                facebook: 'facebook.com/sieuthihoalac',
                linkedin: 'linkedin.com/company/sieuthihoalac'
            },
            verification: {
                isVerified: true,
                documents: ['business_license.pdf', 'tax_certificate.pdf']
            },
            rating: {
                average: 4.2,
                count: 15
            }
        },
        {
            email: 'quancafehoalac@company.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Quán cà phê Hòa Lạc',
            description: 'Quán cà phê phong cách hiện đại, không gian học tập lý tưởng cho sinh viên.',
            website: 'www.quancafehoalac.com',
            phone: '0241234568',
            address: {
                street: '456 Đường Hòa Lạc',
                district: 'Thạch Thất',
                city: 'Hà Nội',
                coordinates: { lat: 21.011, lng: 105.525 }
            },
            industry: 'Dịch vụ ăn uống',
            size: 'small',
            foundedYear: 2020,
            socialMedia: {
                facebook: 'facebook.com/quancafehoalac',
                instagram: 'instagram.com/quancafehoalac'
            },
            verification: {
                isVerified: true,
                documents: ['business_license.pdf']
            },
            rating: {
                average: 4.5,
                count: 8
            }
        },
        {
            email: 'trungtamgiasu@company.com',
            password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
            name: 'Trung tâm Gia sư Hòa Lạc',
            description: 'Trung tâm gia sư uy tín, chuyên cung cấp dịch vụ dạy kèm cho học sinh các cấp.',
            website: 'www.trungtamgiasuhoalac.com',
            phone: '0241234569',
            address: {
                street: '789 Đường Hòa Lạc',
                district: 'Thạch Thất',
                city: 'Hà Nội',
                coordinates: { lat: 21.017, lng: 105.523 }
            },
            industry: 'Giáo dục',
            size: 'small',
            foundedYear: 2019,
            socialMedia: {
                facebook: 'facebook.com/trungtamgiasuhoalac'
            },
            verification: {
                isVerified: true,
                documents: ['business_license.pdf', 'education_certificate.pdf']
            },
            rating: {
                average: 4.8,
                count: 12
            }
        }
    ];

    // Create companies first
    const createdCompanies = await Company.insertMany(companyData);
    console.log(`✅ Created ${createdCompanies.length} companies`);

    // Create employer users linked to companies
    const employerUsers = companyData.map((company, index) => ({
        email: company.email,
        password: company.password,
        fullName: company.name,
        phone: company.phone,
        role: 'employer',
        isVerified: true,
        companyId: createdCompanies[index]._id
    }));

    await User.insertMany(employerUsers);
    console.log(`✅ Created ${employerUsers.length} employer users`);

    return createdCompanies;
}

// Helper function to generate slug
function generateSlug(title) {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim('-');
}

async function seedJobs(companies, users) {
    console.log('💼 Seeding jobs...');

    const jobs = [
        {
            title: 'Nhân viên bán hàng',
            company: companies[0]._id,
            description: 'Tìm kiếm nhân viên bán hàng part-time tại siêu thị Hòa Lạc. Công việc bao gồm hỗ trợ khách hàng, quản lý hàng hóa và bán hàng.',
            requirements: ['Kỹ năng giao tiếp tốt', 'Có kinh nghiệm bán hàng', 'Nhiệt tình, trách nhiệm'],
            responsibilities: ['Hỗ trợ khách hàng', 'Quản lý hàng hóa', 'Bán hàng và thu ngân'],
            benefits: ['Lương cạnh tranh', 'Môi trường làm việc thân thiện', 'Được đào tạo kỹ năng'],
            category: 'Bán hàng',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 25000,
                max: 35000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 10,
            applied: 15,
            status: 'published',
            priority: 'normal',
            tags: ['Bán hàng', 'Bán lẻ', 'Customer Service'],
            skills: ['Giao tiếp', 'Bán hàng', 'Customer Service'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Nhân viên bán hàng')
        },
        {
            title: 'Nhân viên phục vụ',
            company: companies[1]._id,
            description: 'Tuyển nhân viên phục vụ part-time tại quán cà phê. Công việc bao gồm phục vụ khách hàng, dọn dẹp và quản lý quầy bar.',
            requirements: ['Kỹ năng giao tiếp', 'Ngoại hình ưa nhìn', 'Có kinh nghiệm phục vụ'],
            responsibilities: ['Phục vụ khách hàng', 'Dọn dẹp bàn ghế', 'Quản lý quầy bar'],
            benefits: ['Lương + tip', 'Môi trường làm việc năng động', 'Được học hỏi kỹ năng'],
            category: 'Phục vụ',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '456 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.011, lng: 105.525 }
            },
            salary: {
                type: 'hourly',
                min: 20000,
                max: 30000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 8,
            applied: 8,
            status: 'published',
            priority: 'normal',
            tags: ['Phục vụ', 'Nhà hàng', 'Cà phê'],
            skills: ['Phục vụ', 'Giao tiếp', 'Làm việc nhóm'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000),
            createdBy: users[1]._id,
            slug: generateSlug('Nhân viên phục vụ')
        },
        {
            title: 'Gia sư Toán',
            company: companies[2]._id,
            description: 'Tuyển gia sư dạy Toán cho học sinh cấp 2, cấp 3. Yêu cầu có kiến thức vững vàng và phương pháp giảng dạy hiệu quả.',
            requirements: ['Kiến thức Toán vững vàng', 'Kỹ năng giảng dạy', 'Kiên nhẫn và nhiệt tình'],
            responsibilities: ['Dạy kèm Toán cho học sinh', 'Chuẩn bị bài giảng', 'Theo dõi tiến độ học tập'],
            benefits: ['Lương cao', 'Lịch làm việc linh hoạt', 'Được phát triển kỹ năng sư phạm'],
            category: 'Giáo dục',
            type: 'part-time',
            level: 'junior',
            location: {
                address: '789 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.017, lng: 105.523 }
            },
            salary: {
                type: 'hourly',
                min: 50000,
                max: 80000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 12,
            applied: 8,
            status: 'published',
            priority: 'premium',
            tags: ['Giáo dục', 'Gia sư', 'Toán học'],
            skills: ['Toán học', 'Giảng dạy', 'Giao tiếp'],
            experience: '1-year',
            education: 'university',
            deadline: new Date(Date.now() + 45 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Gia sư Toán')
        },
        {
            title: 'Nhân viên văn phòng',
            company: companies[0]._id,
            description: 'Tuyển nhân viên văn phòng part-time làm việc linh hoạt. Công việc bao gồm xử lý tài liệu, hỗ trợ hành chính.',
            requirements: ['Kỹ năng tin học văn phòng', 'Cẩn thận, tỉ mỉ', 'Có kinh nghiệm làm việc văn phòng'],
            responsibilities: ['Xử lý tài liệu', 'Hỗ trợ hành chính', 'Quản lý hồ sơ'],
            benefits: ['Môi trường làm việc chuyên nghiệp', 'Được đào tạo kỹ năng', 'Lương ổn định'],
            category: 'Văn phòng',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 30000,
                max: 40000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 5,
            applied: 0,
            status: 'published',
            priority: 'normal',
            tags: ['Văn phòng', 'Hành chính', 'Tin học'],
            skills: ['Microsoft Office', 'Giao tiếp', 'Tổ chức'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 25 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Nhân viên văn phòng')
        },
        {
            title: 'Nhân viên giao hàng',
            company: companies[0]._id,
            description: 'Tuyển nhân viên giao hàng part-time cho khu vực Hòa Lạc. Yêu cầu có phương tiện di chuyển và biết đường.',
            requirements: ['Có xe máy', 'Biết đường Hòa Lạc', 'Có kinh nghiệm giao hàng'],
            responsibilities: ['Giao hàng cho khách', 'Kiểm tra hàng hóa', 'Thu tiền COD'],
            benefits: ['Lương + phụ cấp xăng', 'Lịch làm việc linh hoạt', 'Được hỗ trợ bảo hiểm'],
            category: 'Giao hàng',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 35000,
                max: 50000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 8,
            applied: 5,
            status: 'published',
            priority: 'urgent',
            tags: ['Giao hàng', 'Vận chuyển', 'Logistics'],
            skills: ['Giao hàng', 'Giao tiếp', 'Tổ chức'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Nhân viên giao hàng')
        },
        {
            title: 'Lập trình viên Frontend',
            company: companies[0]._id,
            description: 'Tuyển lập trình viên Frontend có kinh nghiệm với React.js. Làm việc part-time hoặc full-time tùy theo khả năng.',
            requirements: ['Kinh nghiệm React.js', 'HTML, CSS, JavaScript', 'Hiểu biết API RESTful'],
            responsibilities: ['Phát triển giao diện', 'Tối ưu hóa hiệu suất', 'Code review'],
            benefits: ['Lương cạnh tranh', 'Làm việc remote', 'Phát triển kỹ năng'],
            category: 'Công nghệ',
            type: 'part-time',
            level: 'junior',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 80000,
                max: 120000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 3,
            applied: 12,
            status: 'published',
            priority: 'premium',
            tags: ['Lập trình', 'Frontend', 'React'],
            skills: ['React.js', 'JavaScript', 'HTML', 'CSS'],
            experience: '1-year',
            education: 'university',
            deadline: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Lập trình viên Frontend')
        },
        {
            title: 'Nhân viên Marketing',
            company: companies[1]._id,
            description: 'Tuyển nhân viên Marketing part-time để hỗ trợ các chiến dịch quảng cáo trên mạng xã hội.',
            requirements: ['Kinh nghiệm Social Media', 'Sáng tạo', 'Kỹ năng viết content'],
            responsibilities: ['Tạo content', 'Quản lý Social Media', 'Phân tích dữ liệu'],
            benefits: ['Lương linh hoạt', 'Học hỏi kỹ năng marketing', 'Môi trường sáng tạo'],
            category: 'Marketing',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '456 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.011, lng: 105.525 }
            },
            salary: {
                type: 'hourly',
                min: 40000,
                max: 60000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 4,
            applied: 6,
            status: 'published',
            priority: 'normal',
            tags: ['Marketing', 'Social Media', 'Content'],
            skills: ['Social Media', 'Content Writing', 'Giao tiếp'],
            experience: 'no-experience',
            education: 'college',
            deadline: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000),
            createdBy: users[1]._id,
            slug: generateSlug('Nhân viên Marketing')
        },
        {
            title: 'Gia sư Tiếng Anh',
            company: companies[2]._id,
            description: 'Tuyển gia sư dạy Tiếng Anh cho học sinh cấp 1, cấp 2. Phương pháp giảng dạy hiện đại, vui vẻ.',
            requirements: ['Tiếng Anh thành thạo', 'Kỹ năng giảng dạy', 'Kiên nhẫn'],
            responsibilities: ['Dạy kèm Tiếng Anh', 'Chuẩn bị bài giảng', 'Theo dõi tiến độ'],
            benefits: ['Lương cao', 'Lịch linh hoạt', 'Phát triển sự nghiệp'],
            category: 'Giáo dục',
            type: 'part-time',
            level: 'junior',
            location: {
                address: '789 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.017, lng: 105.523 }
            },
            salary: {
                type: 'hourly',
                min: 45000,
                max: 75000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 10,
            applied: 7,
            status: 'published',
            priority: 'normal',
            tags: ['Giáo dục', 'Gia sư', 'Tiếng Anh'],
            skills: ['Tiếng Anh', 'Giảng dạy', 'Giao tiếp'],
            experience: '1-year',
            education: 'university',
            deadline: new Date(Date.now() + 50 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Gia sư Tiếng Anh')
        },
        {
            title: 'Nhân viên kho hàng',
            company: companies[0]._id,
            description: 'Tuyển nhân viên kho hàng part-time. Công việc bao gồm sắp xếp hàng, kiểm kê, đóng gói.',
            requirements: ['Khỏe mạnh', 'Cẩn thận', 'Có kinh nghiệm kho hàng'],
            responsibilities: ['Sắp xếp hàng', 'Kiểm kê', 'Đóng gói hàng'],
            benefits: ['Lương ổn định', 'Môi trường làm việc an toàn', 'Được hỗ trợ bảo hiểm'],
            category: 'Kho hàng',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 28000,
                max: 38000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 6,
            applied: 3,
            status: 'published',
            priority: 'normal',
            tags: ['Kho hàng', 'Logistics', 'Vận chuyển'],
            skills: ['Sắp xếp', 'Kiểm kê', 'Làm việc nhóm'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Nhân viên kho hàng')
        },
        {
            title: 'Nhân viên bảo vệ',
            company: companies[1]._id,
            description: 'Tuyển nhân viên bảo vệ part-time cho khu vực Hòa Lạc. Công việc bao gồm tuần tra, kiểm soát ra vào.',
            requirements: ['Khỏe mạnh', 'Trách nhiệm cao', 'Có chứng chỉ bảo vệ'],
            responsibilities: ['Tuần tra', 'Kiểm soát ra vào', 'Báo cáo sự cố'],
            benefits: ['Lương ổn định', 'Lịch làm việc linh hoạt', 'Được hỗ trợ bảo hiểm'],
            category: 'Bảo vệ',
            type: 'part-time',
            level: 'fresher',
            location: {
                address: '456 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.011, lng: 105.525 }
            },
            salary: {
                type: 'hourly',
                min: 32000,
                max: 45000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 5,
            applied: 2,
            status: 'published',
            priority: 'urgent',
            tags: ['Bảo vệ', 'An ninh', 'Tuần tra'],
            skills: ['Bảo vệ', 'Giao tiếp', 'Tỉnh táo'],
            experience: 'no-experience',
            education: 'high-school',
            deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000),
            createdBy: users[1]._id,
            slug: generateSlug('Nhân viên bảo vệ')
        },
        {
            title: 'Nhân viên thiết kế đồ họa',
            company: companies[0]._id,
            description: 'Tuyển nhân viên thiết kế đồ họa part-time. Thiết kế poster, banner, hình ảnh cho các chiến dịch marketing.',
            requirements: ['Thành thạo Photoshop/Figma', 'Sáng tạo', 'Có portfolio'],
            responsibilities: ['Thiết kế đồ họa', 'Chỉnh sửa hình ảnh', 'Tạo content visual'],
            benefits: ['Lương cạnh tranh', 'Làm việc remote', 'Phát triển kỹ năng'],
            category: 'Thiết kế',
            type: 'part-time',
            level: 'junior',
            location: {
                address: '123 Đường Hòa Lạc, Thạch Thất, Hà Nội',
                city: 'Hà Nội',
                district: 'Thạch Thất',
                coordinates: { lat: 21.015, lng: 105.526 }
            },
            salary: {
                type: 'hourly',
                min: 70000,
                max: 100000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 2,
            applied: 9,
            status: 'published',
            priority: 'premium',
            tags: ['Thiết kế', 'Đồ họa', 'Creative'],
            skills: ['Photoshop', 'Figma', 'Sáng tạo'],
            experience: '1-year',
            education: 'college',
            deadline: new Date(Date.now() + 38 * 24 * 60 * 60 * 1000),
            createdBy: users[0]._id,
            slug: generateSlug('Nhân viên thiết kế đồ họa')
        }
    ];

    const createdJobs = await Job.insertMany(jobs);
    console.log(`✅ Created ${createdJobs.length} jobs`);
    return createdJobs;
}

async function seedApplications(users, jobs) {
    console.log('📝 Seeding applications...');

    const applications = [
        {
            job: jobs[0]._id,
            applicant: users[0]._id,
            company: jobs[0].company,
            coverLetter: 'Tôi là sinh viên năm 3 ngành CNTT, có kinh nghiệm làm việc với React và Node.js. Tôi mong muốn được làm việc tại siêu thị để phát triển kỹ năng giao tiếp và bán hàng.',
            cvUrl: '/uploads/cv_nguyenvana.pdf',
            status: 'pending',
            appliedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            job: jobs[1]._id,
            applicant: users[1]._id,
            company: jobs[1].company,
            coverLetter: 'Tôi có kinh nghiệm bán hàng tại Shopee và kỹ năng giao tiếp tốt. Mong muốn được làm việc trong môi trường cà phê năng động.',
            cvUrl: '/uploads/cv_tranthib.pdf',
            status: 'reviewed',
            appliedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
            reviewedAt: new Date(Date.now() - 12 * 60 * 60 * 1000) // 12 hours ago
        },
        {
            job: jobs[2]._id,
            applicant: users[0]._id,
            company: jobs[2].company,
            coverLetter: 'Tôi có kiến thức Toán vững vàng và đã từng dạy kèm cho em họ. Mong muốn được phát triển kỹ năng sư phạm.',
            cvUrl: '/uploads/cv_nguyenvana.pdf',
            status: 'interviewed',
            appliedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // 5 days ago
            reviewedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // 3 days ago
            interviewScheduled: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) // 2 days from now
        }
    ];

    const createdApplications = await Application.insertMany(applications);
    console.log(`✅ Created ${createdApplications.length} applications`);
    return createdApplications;
}

async function seedReviews(users, jobs, companies) {
    console.log('⭐ Seeding reviews...');

    const reviews = [
        {
            company: companies[0]._id,
            job: jobs[0]._id,
            reviewer: users[0]._id,
            rating: 4,
            title: 'Môi trường làm việc tốt',
            content: 'Siêu thị có môi trường làm việc khá tốt, đồng nghiệp thân thiện. Lương đúng hạn và có cơ hội phát triển.',
            pros: ['Môi trường thân thiện', 'Lương đúng hạn', 'Được đào tạo'],
            cons: ['Ca làm việc cố định', 'Áp lực bán hàng'],
            workEnvironment: 'good',
            management: 'good',
            workLifeBalance: 'average',
            isVerified: true,
            helpful: 5
        },
        {
            company: companies[1]._id,
            job: jobs[1]._id,
            reviewer: users[1]._id,
            rating: 5,
            title: 'Quán cà phê tuyệt vời',
            content: 'Quán cà phê có không gian đẹp, khách hàng lịch sự. Công việc không quá áp lực và được tip tốt.',
            pros: ['Không gian đẹp', 'Khách hàng lịch sự', 'Được tip'],
            cons: ['Ca chiều hơi đông'],
            workEnvironment: 'excellent',
            management: 'excellent',
            workLifeBalance: 'good',
            isVerified: true,
            helpful: 8
        }
    ];

    const createdReviews = await Review.insertMany(reviews);
    console.log(`✅ Created ${createdReviews.length} reviews`);
    return createdReviews;
}

async function seedNotifications(users, jobs) {
    console.log('🔔 Seeding notifications...');

    const notifications = [
        {
            user: users[0]._id,
            type: 'job_match',
            title: 'Việc làm phù hợp với bạn',
            message: 'Có 3 việc làm mới phù hợp với profile của bạn',
            data: { jobIds: [jobs[0]._id, jobs[2]._id, jobs[3]._id] },
            isRead: false,
            createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
        },
        {
            user: users[1]._id,
            type: 'application_update',
            title: 'Cập nhật ứng tuyển',
            message: 'Đơn ứng tuyển của bạn đã được xem xét',
            data: { applicationId: 'application_id_here' },
            isRead: true,
            createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
        },
        {
            user: users[0]._id,
            type: 'interview_invite',
            title: 'Lời mời phỏng vấn',
            message: 'Bạn được mời phỏng vấn cho vị trí Gia sư Toán',
            data: { jobId: jobs[2]._id, interviewDate: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000) },
            isRead: false,
            createdAt: new Date(Date.now() - 30 * 60 * 1000) // 30 minutes ago
        }
    ];

    const createdNotifications = await Notification.insertMany(notifications);
    console.log(`✅ Created ${createdNotifications.length} notifications`);
    return createdNotifications;
}

async function seedBlogPosts(users) {
    console.log('📝 Seeding blog posts...');

    const blogPosts = [
        {
            title: 'Kinh nghiệm làm việc part-time cho sinh viên',
            slug: 'kinh-nghiem-lam-viec-part-time-cho-sinh-vien',
            content: 'Làm việc part-time là cách tuyệt vời để sinh viên tích lũy kinh nghiệm và kiếm thêm thu nhập...',
            excerpt: 'Chia sẻ kinh nghiệm làm việc part-time hiệu quả cho sinh viên',
            author: users[0]._id,
            category: 'Kinh nghiệm',
            tags: ['Part-time', 'Sinh viên', 'Kinh nghiệm'],
            status: 'published',
            views: 150,
            likes: 12,
            publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // 7 days ago
        },
        {
            title: 'Cách cân bằng học tập và làm việc',
            slug: 'cach-can-bang-hoc-tap-va-lam-viec',
            content: 'Cân bằng giữa việc học và làm việc part-time là thách thức lớn với nhiều sinh viên...',
            excerpt: 'Bí quyết cân bằng học tập và làm việc part-time',
            author: users[1]._id,
            category: 'Bí quyết',
            tags: ['Cân bằng', 'Học tập', 'Làm việc'],
            status: 'published',
            views: 89,
            likes: 7,
            publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
        }
    ];

    const createdBlogPosts = await BlogPost.insertMany(blogPosts);
    console.log(`✅ Created ${createdBlogPosts.length} blog posts`);
    return createdBlogPosts;
}

async function seedForumPosts(users) {
    console.log('💬 Seeding forum posts...');

    const forumPosts = [
        {
            title: 'Kinh nghiệm phỏng vấn part-time',
            content: 'Mình muốn chia sẻ kinh nghiệm phỏng vấn part-time cho các bạn sinh viên...',
            author: users[0]._id,
            category: 'Kinh nghiệm',
            tags: ['Phỏng vấn', 'Part-time', 'Kinh nghiệm'],
            replies: [{
                author: users[1]._id,
                content: 'Cảm ơn bạn đã chia sẻ! Rất hữu ích cho mình.',
                createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000),
                likes: 3
            }],
            views: 45,
            likes: 5,
            isPinned: false,
            createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
        },
        {
            title: 'Tìm việc part-time ở Hòa Lạc',
            content: 'Các bạn có biết chỗ nào tuyển part-time ở Hòa Lạc không? Mình đang tìm việc...',
            author: users[1]._id,
            category: 'Tìm việc',
            tags: ['Tìm việc', 'Part-time', 'Hòa Lạc'],
            replies: [],
            views: 23,
            likes: 2,
            isPinned: true,
            createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
        }
    ];

    const createdForumPosts = await ForumPost.insertMany(forumPosts);
    console.log(`✅ Created ${createdForumPosts.length} forum posts`);
    return createdForumPosts;
}

async function seedDatabase() {
    try {
        await connectDB();
        await clearDatabase();

        const users = await seedUsers();
        const companies = await seedCompanies();
        const jobs = await seedJobs(companies, users);
        const applications = await seedApplications(users, jobs);
        const reviews = await seedReviews(users, jobs, companies);
        const notifications = await seedNotifications(users, jobs);
        const blogPosts = await seedBlogPosts(users);
        const forumPosts = await seedForumPosts(users);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📊 Summary:');
        console.log(`👥 Users: ${users.length}`);
        console.log(`🏢 Companies: ${companies.length}`);
        console.log(`💼 Jobs: ${jobs.length}`);
        console.log(`📝 Applications: ${applications.length}`);
        console.log(`⭐ Reviews: ${reviews.length}`);
        console.log(`🔔 Notifications: ${notifications.length}`);
        console.log(`📝 Blog Posts: ${blogPosts.length}`);
        console.log(`💬 Forum Posts: ${forumPosts.length}`);

        console.log('\n🔑 Test Accounts:');
        console.log('Job Seeker: nguyenvana@email.com / password');
        console.log('Job Seeker: tranthib@email.com / password');
        console.log('Company: sieuthihoalac@company.com / password');
        console.log('Company: quancafehoalac@company.com / password');
        console.log('Company: trungtamgiasu@company.com / password');

    } catch (error) {
        console.error('❌ Error seeding database:', error);
    } finally {
        await mongoose.connection.close();
        console.log('\n🔌 Database connection closed');
        process.exit(0);
    }
}

// Run seeding
seedDatabase();



