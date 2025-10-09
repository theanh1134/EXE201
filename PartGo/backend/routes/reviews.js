const express = require('express');
const Review = require('../models/Review');
const Company = require('../models/Company');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Create review
router.post('/', authenticateToken, async (req, res) => {
    try {
        const reviewData = req.body;
        reviewData.reviewer = req.user.userId;

        const review = new Review(reviewData);
        await review.save();

        // Update company rating
        const company = await Company.findById(reviewData.company);
        const reviews = await Review.find({ company: reviewData.company });
        const averageRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;

        await Company.findByIdAndUpdate(reviewData.company, {
            'rating.average': averageRating,
            'rating.count': reviews.length
        });

        res.status(201).json(review);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get company reviews
router.get('/company/:companyId', async (req, res) => {
    try {
        const reviews = await Review.find({ company: req.params.companyId })
            .populate('reviewer', 'fullName')
            .populate('job', 'title')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get job reviews
router.get('/job/:jobId', async (req, res) => {
    try {
        const reviews = await Review.find({ job: req.params.jobId })
            .populate('reviewer', 'fullName')
            .populate('company', 'name')
            .sort({ createdAt: -1 });

        res.json(reviews);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update review helpful count
router.put('/:id/helpful', async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({ message: 'Review not found' });
        }

        review.helpful += 1;
        await review.save();

        res.json({ helpful: review.helpful });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;








