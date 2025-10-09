const express = require('express');
const Application = require('../models/Application');
const Job = require('../models/Job');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Apply for job
router.post('/', authenticateToken, async (req, res) => {
    try {
        const { jobId, coverLetter, cvUrl } = req.body;

        // Check if already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: req.user.userId
        });

        if (existingApplication) {
            return res.status(400).json({ message: 'Already applied to this job' });
        }

        // Get job details
        const job = await Job.findById(jobId).populate('company');
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        const application = new Application({
            job: jobId,
            applicant: req.user.userId,
            company: job.company?._id,
            coverLetter,
            cvUrl
        });

        await application.save();

        // Update job applied count
        await Job.findByIdAndUpdate(jobId, { $inc: { applied: 1 } });

        res.status(201).json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get applications
router.get('/', authenticateToken, async (req, res) => {
    try {
        const { role } = req.user;

        let filter = {};
        if (role === 'jobseeker') {
            filter.applicant = req.user.userId;
        } else if (role === 'employer') {
            filter.company = req.user.companyId;
        }
        const applications = await Application.find(filter)
            .populate({ path: 'job', select: 'title company location salary createdAt', populate: { path: 'company', select: 'name logo' } })
            .populate('applicant', 'fullName email')
            .populate('company', 'name logo')
            .sort({ appliedAt: -1 })
            .lean();

        res.json(applications);
    } catch (error) {
        console.error('GET /applications error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Update application status
router.put('/:id/status', authenticateToken, async (req, res) => {
    try {
        const { status } = req.body;
        console.log('Updating application status:', req.params.id, 'to:', status);
        console.log('User:', req.user.userId, 'Role:', req.user.role, 'CompanyId:', req.user.companyId);

        const application = await Application.findById(req.params.id).populate('job');

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        console.log('Application found:', application._id, 'Job:', application.job?._id, 'Company:', application.company);

        // Check if user is authorized to update this application
        if (req.user.role === 'employer') {
            // Check via job ownership or company membership
            const job = application.job;
            if (!job) {
                return res.status(400).json({ message: 'Application job not found' });
            }

            const isJobCreator = job.createdBy.toString() === req.user.userId;
            const isCompanyMember = req.user.companyId && job.company.toString() === req.user.companyId;

            if (!isJobCreator && !isCompanyMember) {
                console.log('Not authorized - job created by:', job.createdBy, 'job company:', job.company, 'user:', req.user.userId, 'user company:', req.user.companyId);
                return res.status(403).json({ message: 'Not authorized' });
            }
        }

        // Validate status
        const validStatuses = ['pending', 'reviewed', 'shortlisted', 'interviewed', 'accepted', 'rejected'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({ message: 'Invalid status' });
        }

        application.status = status;
        if (status === 'reviewed') {
            application.reviewedAt = new Date();
        }

        await application.save();

        // Return populated application
        const updatedApplication = await Application.findById(application._id)
            .populate('applicant', 'fullName email phone avatar')
            .populate('job', 'title')
            .populate('company', 'name logo');

        console.log('Application updated successfully');
        res.json(updatedApplication);
    } catch (error) {
        console.error('Error updating application status:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Add note to application
router.post('/:id/notes', authenticateToken, async (req, res) => {
    try {
        const { text } = req.body;
        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        application.notes.push({
            text,
            addedBy: req.user.role === 'employer' ? 'employer' : 'applicant',
            addedAt: new Date()
        });

        await application.save();
        res.json(application);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get applications for a specific job (for employers)
router.get('/job/:jobId', authenticateToken, async (req, res) => {
    try {
        const { jobId } = req.params;
        const { status, page = 1, limit = 20 } = req.query;

        console.log('Getting applications for job:', jobId);
        console.log('User:', req.user.userId);

        // Verify job ownership
        const job = await Job.findById(jobId);
        if (!job) {
            console.log('Job not found:', jobId);
            return res.status(404).json({ message: 'Job not found' });
        }

        console.log('Job found:', job.title, 'Created by:', job.createdBy, 'Company:', job.company);

        // Check authorization - either job creator or company member
        const isJobCreator = job.createdBy.toString() === req.user.userId;
        const isCompanyMember = req.user.role === 'employer' && req.user.companyId && job.company.toString() === req.user.companyId;

        if (!isJobCreator && !isCompanyMember) {
            console.log('Not authorized - job created by:', job.createdBy, 'job company:', job.company, 'user:', req.user.userId, 'user company:', req.user.companyId);
            return res.status(403).json({ message: 'Not authorized to view applications for this job' });
        }

        // Build filter
        let filter = { job: jobId };
        if (status) filter.status = status;

        console.log('Filter:', filter);

        const applications = await Application.find(filter)
            .populate('applicant', 'fullName email phone avatar')
            .populate('job', 'title')
            .sort({ appliedAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        console.log('Found applications:', applications.length);

        const total = await Application.countDocuments(filter);

        res.json({
            applications,
            totalPages: Math.ceil(total / limit),
            currentPage: parseInt(page),
            total
        });
    } catch (error) {
        console.error('Error in get applications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get application statistics for a job
router.get('/job/:jobId/stats', authenticateToken, async (req, res) => {
    try {
        const { jobId } = req.params;

        // Verify job ownership
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check authorization - either job creator or company member
        const isJobCreator = job.createdBy.toString() === req.user.userId;
        const isCompanyMember = req.user.role === 'employer' && req.user.companyId && job.company.toString() === req.user.companyId;

        if (!isJobCreator && !isCompanyMember) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        const stats = await Application.aggregate([
            { $match: { job: job._id } },
            {
                $group: {
                    _id: '$status',
                    count: { $sum: 1 }
                }
            }
        ]);

        const totalApplications = await Application.countDocuments({ job: job._id });

        res.json({
            totalApplications,
            statusBreakdown: stats
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Test status update route
router.post('/test-status-update', authenticateToken, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Not available in production' });
        }

        const { applicationId, status } = req.body;

        console.log('Test status update:', { applicationId, status, user: req.user });

        const application = await Application.findById(applicationId).populate('job');
        if (!application) {
            return res.status(404).json({ message: 'Application not found' });
        }

        console.log('Application before update:', {
            id: application._id,
            currentStatus: application.status,
            job: application.job?._id,
            jobCreatedBy: application.job?.createdBy,
            jobCompany: application.job?.company
        });

        // Update status
        application.status = status;
        await application.save();

        console.log('Application after update:', {
            id: application._id,
            newStatus: application.status
        });

        res.json({
            message: 'Status updated successfully',
            application: {
                id: application._id,
                oldStatus: application.status,
                newStatus: status
            }
        });
    } catch (error) {
        console.error('Test status update error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Debug route to check data
router.get('/debug', authenticateToken, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Not available in production' });
        }

        const User = require('../models/User');
        const user = await User.findById(req.user.userId);

        const jobs = await Job.find({ createdBy: req.user.userId }).populate('company');
        const applications = await Application.find({}).populate('job').populate('applicant').populate('company');

        res.json({
            user: {
                id: user._id,
                email: user.email,
                role: user.role,
                companyId: user.companyId
            },
            tokenPayload: req.user,
            jobs: jobs.length,
            jobsList: jobs,
            applications: applications.length,
            applicationsList: applications
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Create sample applications for testing (development only)
router.post('/create-sample', authenticateToken, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Not available in production' });
        }

        const { jobId } = req.body;

        // Verify job exists and user has access
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({ message: 'Job not found' });
        }

        // Check authorization
        const isJobCreator = job.createdBy.toString() === req.user.userId;
        const isCompanyMember = req.user.role === 'employer' && req.user.companyId && job.company.toString() === req.user.companyId;

        if (!isJobCreator && !isCompanyMember) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        // Create sample applications
        const sampleApplications = [
            {
                job: jobId,
                applicant: req.user.userId, // Using current user as sample applicant
                company: job.company,
                coverLetter: 'Tôi rất quan tâm đến vị trí này và tin rằng kinh nghiệm của tôi phù hợp với yêu cầu công việc.',
                status: 'pending',
                cvUrl: '/uploads/sample-cv-1.txt'
            },
            {
                job: jobId,
                applicant: req.user.userId,
                company: job.company,
                coverLetter: 'Với 3 năm kinh nghiệm trong lĩnh vực này, tôi tự tin có thể đóng góp tích cực cho công ty.',
                status: 'reviewed',
                cvUrl: '/uploads/sample-cv-2.txt'
            }
        ];

        const createdApplications = await Application.insertMany(sampleApplications);

        // Update job applied count
        await Job.findByIdAndUpdate(jobId, { $inc: { applied: createdApplications.length } });

        res.json({
            message: 'Sample applications created',
            applications: createdApplications
        });
    } catch (error) {
        console.error('Error creating sample applications:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;



