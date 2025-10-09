const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    // Thông tin cơ bản
    title: { type: String, required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    description: { type: String, required: true },
    requirements: [String],
    responsibilities: [String],
    benefits: [String],

    // Phân loại và loại hình
    category: { type: String, required: true },
    type: {
        type: String,
        enum: ['full-time', 'part-time', 'freelance', 'remote', 'contract', 'internship'],
        required: true
    },
    level: {
        type: String,
        enum: ['intern', 'fresher', 'junior', 'middle', 'senior', 'lead', 'manager'],
        required: true
    },

    // Địa điểm
    location: {
        address: { type: String, required: true },
        city: { type: String, required: true },
        district: { type: String },
        coordinates: {
            lat: { type: Number, required: true },
            lng: { type: Number, required: true }
        }
    },

    // Lương
    salary: {
        type: { type: String, enum: ['hourly', 'monthly', 'project', 'negotiable'], required: true },
        min: { type: Number, required: true },
        max: { type: Number, required: true },
        currency: { type: String, default: 'VND' },
        isPublic: { type: Boolean, default: true } // Có thể ẩn mức lương
    },

    // Số lượng và ứng tuyển
    capacity: { type: Number, default: 1 },
    applied: { type: Number, default: 0 },

    // Trạng thái và ưu tiên
    status: {
        type: String,
        enum: ['draft', 'published', 'closed', 'expired', 'paused'],
        default: 'draft'
    },
    priority: {
        type: String,
        enum: ['normal', 'premium', 'urgent', 'hot'],
        default: 'normal'
    },

    // Tính năng nâng cao
    isUrgent: { type: Boolean, default: false }, // Tuyển gấp
    isHot: { type: Boolean, default: false }, // Tin nổi bật
    autoClose: { type: Boolean, default: false }, // Tự động đóng khi đủ ứng viên
    maxApplications: { type: Number }, // Số lượng ứng tuyển tối đa

    // Thời gian
    deadline: { type: Date },
    publishAt: { type: Date }, // Thời gian đăng tin (schedule)
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },

    // Tags và hình ảnh
    tags: [String],
    skills: [String], // Kỹ năng yêu cầu
    images: [String],

    // Thông tin bổ sung
    experience: {
        type: String,
        enum: ['no-experience', '1-year', '2-years', '3-years', '5-years', '5+ years']
    },
    education: {
        type: String,
        enum: ['no-requirement', 'high-school', 'college', 'university', 'master', 'phd']
    },

    // SEO và tìm kiếm
    keywords: [String],
    slug: { type: String, unique: true },

    // Thống kê
    views: { type: Number, default: 0 },
    saves: { type: Number, default: 0 }, // Số lượt lưu job

    // Người tạo và chỉnh sửa
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    lastModifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
});

// Tạo slug từ title
jobSchema.pre('save', function (next) {
    if (this.isModified('title')) {
        this.slug = this.title
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .trim('-');
    }
    next();
});

// Index cho tìm kiếm
jobSchema.index({ title: 'text', description: 'text', tags: 'text', skills: 'text' });
jobSchema.index({ status: 1, publishAt: 1 });
jobSchema.index({ company: 1, status: 1 });
jobSchema.index({ location: 1, type: 1, level: 1 });

module.exports = mongoose.model('Job', jobSchema);






