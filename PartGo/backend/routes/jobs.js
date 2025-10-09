const express = require('express');
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get all jobs (public)
router.get('/', async (req, res) => {
    try {
        const {
            page = 1,
            limit = 10,
            category,
            type,
            level,
            location,
            salaryMin,
            salaryMax,
            search,
            sort = 'newest'
        } = req.query;

        let filter = {
            status: { $in: ['published'] },
            $or: [
                { publishAt: { $exists: false } },
                { publishAt: { $lte: new Date() } }
            ]
        };

        // Filters
        if (category) filter.category = category;
        if (type) filter.type = type;
        if (level) filter.level = level;
        if (location) filter['location.city'] = new RegExp(location, 'i');

        if (salaryMin || salaryMax) {
            filter['salary.min'] = { $gte: parseInt(salaryMin) || 0 };
            if (salaryMax) filter['salary.max'] = { $lte: parseInt(salaryMax) };
        }

        // Search
        if (search) {
            filter.$text = { $search: search };
        }

        // Sort options
        let sortOption = { createdAt: -1 };
        switch (sort) {
            case 'newest':
                sortOption = { createdAt: -1 };
                break;
            case 'oldest':
                sortOption = { createdAt: 1 };
                break;
            case 'salary-high':
                sortOption = { 'salary.max': -1 };
                break;
            case 'salary-low':
                sortOption = { 'salary.min': 1 };
                break;
            case 'urgent':
                sortOption = { isUrgent: -1, createdAt: -1 };
                break;
            case 'hot':
                sortOption = { isHot: -1, createdAt: -1 };
                break;
        }

        const jobs = await Job.find(filter)
            .populate('company', 'name logo address')
            .sort(sortOption)
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user's jobs (authenticated)
router.get('/my-jobs', authenticateToken, async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;
        const userId = req.user.userId;

        let filter = { createdBy: userId };
        if (status) filter.status = status;

        const jobs = await Job.find(filter)
            .populate('company', 'name logo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get jobs by user (authenticated) - MUST be before /:id route
router.get('/user/:userId', authenticateToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        // Check if user has access to this user's jobs
        if (req.user.userId !== userId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        let filter = { createdBy: userId };
        if (status) filter.status = status;

        const jobs = await Job.find(filter)
            .populate('company', 'name logo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get jobs by company (authenticated) - MUST be before /:id route
router.get('/company/:companyId', authenticateToken, async (req, res) => {
    try {
        const { companyId } = req.params;
        const { status, page = 1, limit = 10 } = req.query;

        // Check if user has access to this company
        // Cho phép nếu companyId trùng với user.companyId hoặc user.id (fallback)
        const userCompanyId = req.user.companyId || req.user.userId;
        if (userCompanyId !== companyId && req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Not authorized' });
        }

        let filter = { company: companyId };
        if (status) filter.status = status;

        const jobs = await Job.find(filter)
            .populate('company', 'name logo')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Job.countDocuments(filter);

        res.json({
            jobs,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get job by ID (public) - MUST be after /company/:companyId route
router.get('/:id', async (req, res) => {
    try {
        const job = await Job.findById(req.params.id)
            .populate('company', 'name logo description address rating')
            .populate('createdBy', 'fullName email');

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Increment view count
        await Job.findByIdAndUpdate(req.params.id, { $inc: { views: 1 } });

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create new job (authenticated)
router.post('/', authenticateToken, async (req, res) => {
    try {
        const jobData = req.body;
        console.log('Creating job with data:', jobData);
        console.log('User info:', req.user);

        // Validate required fields
        if (!jobData.title || !jobData.description || !jobData.category) {
            return res.status(400).json({
                message: 'Missing required fields: title, description, category'
            });
        }

        // Set company and creator
        jobData.company = req.user.companyId || req.user.userId; // Fallback to userId if no companyId
        jobData.createdBy = req.user.userId;
        jobData.lastModifiedBy = req.user.userId;

        // Set default status to draft if not specified
        if (!jobData.status) {
            jobData.status = 'draft';
        }

        console.log('Final job data before save:', jobData);

        const job = new Job(jobData);
        await job.save();

        console.log('Job saved successfully:', job._id);

        // Try to populate company info
        try {
            await job.populate('company', 'name logo');
            await job.populate('createdBy', 'fullName email');
        } catch (populateError) {
            console.log('Population error (non-critical):', populateError.message);
        }

        res.status(201).json(job);
    } catch (error) {
        console.error('Job creation error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update job (authenticated)
router.put('/:id', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.company.toString() !== req.user.companyId && job.company.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update lastModifiedBy
        req.body.lastModifiedBy = req.user.userId;
        req.body.updatedAt = new Date();

        const updatedJob = await Job.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        ).populate('company', 'name logo')
            .populate('createdBy', 'fullName email');

        res.json(updatedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Publish job (authenticated)
router.post('/:id/publish', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.company.toString() !== req.user.companyId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Update job status
        job.status = 'published';
        job.publishAt = new Date();
        job.lastModifiedBy = req.user.userId;
        job.updatedAt = new Date();

        await job.save();

        await job.populate('company', 'name logo');
        await job.populate('createdBy', 'fullName email');

        res.json(job);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Clone job (authenticated)
router.post('/:id/clone', authenticateToken, async (req, res) => {
    try {
        const originalJob = await Job.findById(req.params.id);

        if (!originalJob) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (originalJob.company.toString() !== req.user.companyId && originalJob.company.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create cloned job
        const clonedJobData = originalJob.toObject();
        delete clonedJobData._id;
        delete clonedJobData.createdAt;
        delete clonedJobData.updatedAt;
        delete clonedJobData.applied;
        delete clonedJobData.views;
        delete clonedJobData.saves;

        clonedJobData.title = `${originalJob.title} (Copy)`;
        clonedJobData.status = 'draft';
        clonedJobData.createdBy = req.user.userId;
        clonedJobData.lastModifiedBy = req.user.userId;

        const clonedJob = new Job(clonedJobData);
        await clonedJob.save();

        await clonedJob.populate('company', 'name logo');
        await clonedJob.populate('createdBy', 'fullName email');

        res.status(201).json(clonedJob);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Delete job (authenticated)
router.delete('/:id', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.company.toString() !== req.user.companyId && job.company.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Job.findByIdAndDelete(req.params.id);
        res.json({ message: 'Job deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get job statistics (authenticated)
router.get('/:id/stats', authenticateToken, async (req, res) => {
    try {
        const job = await Job.findById(req.params.id);

        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check if user owns this job
        if (job.company.toString() !== req.user.companyId && job.company.toString() !== req.user.userId) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const stats = {
            views: job.views,
            applied: job.applied,
            saves: job.saves,
            capacity: job.capacity,
            status: job.status,
            createdAt: job.createdAt,
            publishAt: job.publishAt
        };

        res.json(stats);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create sample job for testing (development only)
router.post('/create-sample', authenticateToken, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Not available in production' });
        }

        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can create jobs' });
        }

        // Get user's company
        const User = require('../models/User');
        const user = await User.findById(req.user.userId);

        if (!user.companyId) {
            return res.status(400).json({ message: 'User must have a company' });
        }

        const sampleJob = {
            title: 'Frontend Developer - React.js',
            company: user.companyId,
            description: 'Chúng tôi đang tìm kiếm một Frontend Developer có kinh nghiệm với React.js để tham gia vào đội ngũ phát triển sản phẩm.',
            requirements: [
                'Có ít nhất 2 năm kinh nghiệm với React.js',
                'Thành thạo HTML, CSS, JavaScript',
                'Kinh nghiệm với Redux hoặc Context API',
                'Hiểu biết về RESTful API'
            ],
            responsibilities: [
                'Phát triển giao diện người dùng với React.js',
                'Tối ưu hóa hiệu suất ứng dụng',
                'Làm việc với team backend để tích hợp API',
                'Code review và maintain code quality'
            ],
            benefits: [
                'Lương cạnh tranh từ 15-25 triệu',
                'Bảo hiểm đầy đủ',
                'Môi trường làm việc năng động',
                'Cơ hội thăng tiến'
            ],
            category: 'Technology',
            type: 'full-time',
            level: 'middle',
            location: {
                address: '123 Nguyễn Văn Cừ, Quận 5, TP.HCM',
                city: 'Ho Chi Minh City',
                district: 'Quận 5',
                coordinates: {
                    lat: 10.7769,
                    lng: 106.6951
                }
            },
            salary: {
                type: 'monthly',
                min: 15000000,
                max: 25000000,
                currency: 'VND',
                isPublic: true
            },
            capacity: 2,
            status: 'published',
            priority: 'normal',
            deadline: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
            tags: ['React', 'JavaScript', 'Frontend', 'Web Development'],
            skills: ['React.js', 'HTML', 'CSS', 'JavaScript', 'Redux'],
            experience: '2-years',
            education: 'university',
            createdBy: req.user.userId
        };

        const job = new Job(sampleJob);
        await job.save();

        // Populate company info
        await job.populate('company', 'name logo');

        res.status(201).json({
            message: 'Sample job created successfully',
            job
        });
    } catch (error) {
        console.error('Error creating sample job:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;






