const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company' },
    coverLetter: { type: String },
    cvUrl: { type: String },
    status: {
        type: String,
        enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'],
        default: 'pending'
    },
    appliedAt: { type: Date, default: Date.now },
    reviewedAt: { type: Date },
    interviewScheduled: { type: Date },
    notes: [{
        text: String,
        addedBy: { type: String, enum: ['applicant', 'employer'] },
        addedAt: { type: Date, default: Date.now }
    }]
});

module.exports = mongoose.model('Application', applicationSchema);



