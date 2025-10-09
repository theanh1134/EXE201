const mongoose = require('mongoose');

const companySchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    logo: { type: String },
    description: { type: String },
    website: { type: String },
    phone: { type: String },
    address: {
        street: String,
        district: String,
        city: String,
        coordinates: {
            lat: Number,
            lng: Number
        }
    },
    industry: { type: String },
    size: { type: String }, // 'startup', 'small', 'medium', 'large'
    foundedYear: { type: Number },
    socialMedia: {
        facebook: String,
        linkedin: String,
        instagram: String
    },
    verification: {
        isVerified: { type: Boolean, default: false },
        documents: [String]
    },
    rating: {
        average: { type: Number, default: 0 },
        count: { type: Number, default: 0 }
    },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Company', companySchema);

