const express = require('express');
const router = express.Router();
const Company = require('../models/Company');
const User = require('../models/User');
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

// ==================== PUBLIC ROUTES ====================

// Get all companies (public, with pagination and filters)
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 12,
            industry,
            size,
            city,
            search,
            verified,
            sort = 'newest'
        } = req.query;

        let filter = {};

        // Filters
        if (industry) filter.industry = industry;
        if (size) filter.size = size;
        if (city) filter['address.city'] = new RegExp(city, 'i');
        if (verified === 'true') filter['verification.isVerified'] = true;

        // Search
        if (search) {
            filter.$or = [
                { name: new RegExp(search, 'i') },
                { description: new RegExp(search, 'i') },
                { industry: new RegExp(search, 'i') }
            ];
        }

        // Sorting
        let sortOption = {};
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'name':
                sortOption = { name: 1 };
                break;
            case 'rating':
                sortOption = { 'rating.average': -1 };
                break;
            default:
                sortOption = { createdAt: -1 };
        }

        const companies = await Company.find(filter)
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .select('-verification.documents')
            .lean();

        const total = await Company.countDocuments(filter);

        // Get job count for each company
        const companiesWithJobCount = await Promise.all(
            companies.map(async (company) => {
                const jobCount = await Job.countDocuments({
                    company: company._id,
                    status: 'published'
                });
                return { ...company, jobCount };
            })
        );

        res.json({
            companies: companiesWithJobCount,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('GET /companies error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get company by ID (public)
router.get('/:id', async (req, res) => {
    try {
        const company = await Company.findById(req.params.id)
            .select('-verification.documents')
            .lean();

        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get published jobs count
        const jobCount = await Job.countDocuments({
            company: company._id,
            status: 'published'
        });

        // Get recent jobs
        const recentJobs = await Job.find({
            company: company._id,
            status: 'published'
        })
            .sort({ createdAt: -1 })
            .limit(5)
            .select('title location salary type level createdAt')
            .lean();

        res.json({
            ...company,
            jobCount,
            recentJobs
        });
    } catch (error) {
        console.error('GET /companies/:id error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// ==================== AUTHENTICATED ROUTES ====================

// Get current user's company
router.get('/my/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can access company profile' });
        }

        const user = await User.findById(req.user.userId);
        if (!user || !user.companyId) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const company = await Company.findById(user.companyId).lean();
        if (!company) {
            return res.status(404).json({ message: 'Company not found' });
        }

        // Get statistics
        const jobCount = await Job.countDocuments({ company: company._id });
        const publishedJobCount = await Job.countDocuments({ 
            company: company._id, 
            status: 'published' 
        });

        res.json({
            ...company,
            stats: {
                totalJobs: jobCount,
                publishedJobs: publishedJobCount
            }
        });
    } catch (error) {
        console.error('GET /companies/my/profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update company profile
router.put('/my/profile', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can update company profile' });
        }

        const user = await User.findById(req.user.userId);
        if (!user || !user.companyId) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const {
            name,
            description,
            website,
            phone,
            address,
            industry,
            size,
            foundedYear,
            socialMedia,
            logo
        } = req.body;

        // Validate required fields
        if (!name) {
            return res.status(400).json({ message: 'Company name is required' });
        }

        // Update company
        const updateData = {
            updatedAt: new Date()
        };

        if (name) updateData.name = name;
        if (description) updateData.description = description;
        if (website) updateData.website = website;
        if (phone) updateData.phone = phone;
        if (address) updateData.address = address;
        if (industry) updateData.industry = industry;
        if (size) updateData.size = size;
        if (foundedYear) updateData.foundedYear = foundedYear;
        if (socialMedia) updateData.socialMedia = socialMedia;
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(
            user.companyId,
            updateData,
            { new: true, runValidators: true }
        ).lean();

        res.json({
            message: 'Company profile updated successfully',
            company
        });
    } catch (error) {
        console.error('PUT /companies/my/profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Upload company logo
router.post('/my/logo', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can upload company logo' });
        }

        const user = await User.findById(req.user.userId);
        if (!user || !user.companyId) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const { logoUrl } = req.body;
        if (!logoUrl) {
            return res.status(400).json({ message: 'Logo URL is required' });
        }

        const company = await Company.findByIdAndUpdate(
            user.companyId,
            { logo: logoUrl, updatedAt: new Date() },
            { new: true }
        ).lean();

        res.json({
            message: 'Logo uploaded successfully',
            company
        });
    } catch (error) {
        console.error('POST /companies/my/logo error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get company statistics
router.get('/my/stats', authenticateToken, async (req, res) => {
    try {
        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can access company stats' });
        }

        const user = await User.findById(req.user.userId);
        if (!user || !user.companyId) {
            return res.status(404).json({ message: 'Company not found' });
        }

        const companyId = user.companyId;

        // Get job statistics
        const totalJobs = await Job.countDocuments({ company: companyId });
        const publishedJobs = await Job.countDocuments({ company: companyId, status: 'published' });
        const draftJobs = await Job.countDocuments({ company: companyId, status: 'draft' });
        const closedJobs = await Job.countDocuments({ company: companyId, status: 'closed' });

        // Get view statistics
        const jobs = await Job.find({ company: companyId }).select('views applied').lean();
        const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
        const totalApplications = jobs.reduce((sum, job) => sum + (job.applied || 0), 0);

        res.json({
            jobs: {
                total: totalJobs,
                published: publishedJobs,
                draft: draftJobs,
                closed: closedJobs
            },
            engagement: {
                totalViews,
                totalApplications,
                averageViewsPerJob: totalJobs > 0 ? Math.round(totalViews / totalJobs) : 0,
                averageApplicationsPerJob: totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0
            }
        });
    } catch (error) {
        console.error('GET /companies/my/stats error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

