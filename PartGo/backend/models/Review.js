const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    reviewer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    rating: { type: Number, min: 1, max: 5, required: true },
    title: { type: String, required: true },
    content: { type: String, required: true },
    pros: [String],
    cons: [String],
    workEnvironment: { type: String, enum: ['excellent', 'good', 'average', 'poor'] },
    management: { type: String, enum: ['excellent', 'good', 'average', 'poor'] },
    workLifeBalance: { type: String, enum: ['excellent', 'good', 'average', 'poor'] },
    isVerified: { type: Boolean, default: false },
    helpful: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Review', reviewSchema);







