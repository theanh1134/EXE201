const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    fullName: { type: String, required: true },
    phone: { type: String },
    avatar: { type: String },
    role: {
        type: String,
        enum: ['jobseeker', 'employer'],
        default: 'jobseeker',
        required: true
    },
    // For employers, link to company
    companyId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Company',
        required: function () { return this.role === 'employer'; }
    },
    profile: {
        bio: String,
        skills: [String],
        experience: [{
            company: String,
            position: String,
            duration: String,
            description: String
        }],
        education: [{
            school: String,
            degree: String,
            year: String
        }],
        cvUrl: String,
        location: {
            address: String,
            coordinates: {
                lat: Number,
                lng: Number
            }
        },
        availability: {
            schedule: [String], // ['morning', 'afternoon', 'evening', 'weekend']
            maxHoursPerWeek: Number,
            preferredSalary: {
                min: Number,
                max: Number
            }
        }
    },
    preferences: {
        jobCategories: [String],
        maxDistance: Number, // km
        notifications: {
            email: { type: Boolean, default: true },
            push: { type: Boolean, default: true }
        }
    },
    isVerified: { type: Boolean, default: false },
    emailVerification: {
        code: { type: String },
        expiresAt: { type: Date },
        attempts: { type: Number, default: 0 }
    },
    passwordResetOTP: {
        code: { type: String },
        expiresAt: { type: Date }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', userSchema);

