const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Company = require('../models/Company');
const emailService = require('../services/emailService');
const otpService = require('../services/otpService');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Register Job Seeker (Step 1: Send OTP)
router.post('/register', async (req, res) => {
    try {
        const { email, password, fullName, role = 'jobseeker' } = req.body;

        // Validate role
        if (!['jobseeker', 'employer'].includes(role)) {
            return res.status(400).json({ message: 'Invalid role. Must be jobseeker or employer' });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Generate OTP
        const { code, expiresAt } = otpService.generateOTPWithExpiry(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user with pending verification
        const user = new User({
            email,
            password: hashedPassword,
            fullName,
            role,
            isVerified: false,
            emailVerification: {
                code,
                expiresAt,
                attempts: 0
            }
        });

        await user.save();

        // Return verification data for frontend to send email
        res.status(201).json({
            message: 'User created successfully. Please verify your email.',
            userId: user._id,
            email: user.email,
            code: code, // Send code to frontend
            expiresIn: '10 minutes'
        });
    } catch (error) {
        console.error('Register error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Register Company (Step 1: Send OTP)
router.post('/register-company', async (req, res) => {
    try {
        console.log('Register company called with body:', req.body);
        const { email, password, name, description, address } = req.body;
        console.log('Destructured:', { email, password, name, description, address });

        // Validate required fields
        if (!email || !password || !name) {
            console.log('Validation failed:', { email, password, name });
            return res.status(400).json({
                message: 'Missing required fields: email, password, and name are required'
            });
        }

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Check if company already exists
        const existingCompany = await Company.findOne({ email });
        if (existingCompany) {
            return res.status(400).json({ message: 'Company already exists' });
        }

        // Generate OTP
        const { code, expiresAt } = otpService.generateOTPWithExpiry(10);

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create company first
        const company = new Company({
            name,
            email,
            description,
            address: {
                street: address
            }
        });

        await company.save();
        console.log('Company created:', company._id);

        // Create user with employer role and pending verification
        const user = new User({
            email,
            password: hashedPassword,
            fullName: name,
            role: 'employer',
            companyId: company._id,
            isVerified: false,
            emailVerification: {
                code,
                expiresAt,
                attempts: 0
            }
        });

        await user.save();
        console.log('User created:', user._id);

        // Return verification data for frontend to send email
        res.status(201).json({
            message: 'Company created successfully. Please verify your email.',
            userId: user._id,
            companyId: company._id,
            email: user.email,
            code: code, // Send code to frontend
            expiresIn: '10 minutes'
        });
    } catch (error) {
        console.error('Register company error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Verify Email with OTP
router.post('/verify-email', async (req, res) => {
    try {
        const { userId, code } = req.body;

        if (!userId || !code) {
            return res.status(400).json({
                message: 'User ID and verification code are required'
            });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Check attempts
        const attemptsCheck = otpService.checkAttempts(user.emailVerification.attempts);
        if (!attemptsCheck.valid) {
            return res.status(429).json({ message: attemptsCheck.message });
        }

        // Validate OTP
        const validation = otpService.validateOTP(
            code,
            user.emailVerification.code,
            user.emailVerification.expiresAt
        );

        if (!validation.valid) {
            // Increment attempts
            user.emailVerification.attempts += 1;
            await user.save();

            return res.status(400).json({ message: validation.message });
        }

        // Verify user
        user.isVerified = true;
        user.emailVerification = undefined; // Clear verification data
        await user.save();

        // Refresh user from database to ensure we have latest data
        const refreshedUser = await User.findById(user._id);
        console.log('User verified - refreshedUser.companyId:', refreshedUser.companyId);
        console.log('User verified - refreshedUser.role:', refreshedUser.role);

        // Generate JWT
        const tokenPayload = {
            userId: refreshedUser._id,
            email: refreshedUser.email,
            role: refreshedUser.role
        };

        // Add companyId for employers
        if (refreshedUser.role === 'employer' && refreshedUser.companyId) {
            tokenPayload.companyId = refreshedUser.companyId;
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        // Send welcome email
        await emailService.sendWelcomeEmail(user.email, user.fullName, user.role);

        // Get company info if employer
        let company = null;
        if (refreshedUser.role === 'employer' && refreshedUser.companyId) {
            company = await Company.findById(refreshedUser.companyId);
            console.log('Company found:', company ? company._id : 'null');
        }

        res.status(200).json({
            message: 'Email verified successfully',
            token,
            user: {
                id: refreshedUser._id,
                email: refreshedUser.email,
                fullName: refreshedUser.fullName,
                role: refreshedUser.role,
                isVerified: refreshedUser.isVerified,
                companyId: refreshedUser.companyId
            },
            company: company ? {
                id: company._id,
                name: company.name,
                description: company.description
            } : null
        });

        console.log('Response sent - refreshedUser.companyId:', refreshedUser.companyId);
    } catch (error) {
        console.error('Verify email error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Resend Verification Code
router.post('/resend-verification', async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Check if already verified
        if (user.isVerified) {
            return res.status(400).json({ message: 'Email already verified' });
        }

        // Generate new OTP
        const { code, expiresAt } = otpService.generateOTPWithExpiry(10);

        // Update user with new OTP
        user.emailVerification = {
            code,
            expiresAt,
            attempts: 0 // Reset attempts
        };
        await user.save();

        // Send verification email
        const emailResult = await emailService.sendVerificationCode(user.email, code, user.fullName);

        if (!emailResult.success) {
            return res.status(500).json({
                message: 'Failed to send verification email',
                error: emailResult.error
            });
        }

        res.status(200).json({
            message: 'Verification code resent to your email',
            expiresIn: '10 minutes'
        });
    } catch (error) {
        console.error('Resend verification error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Check if email is verified
        if (!user.isVerified) {
            return res.status(400).json({
                message: 'Please verify your email before logging in',
                needsVerification: true,
                userId: user._id
            });
        }

        // Check password
        const isValidPassword = await bcrypt.compare(password, user.password);
        if (!isValidPassword) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const tokenPayload = {
            userId: user._id,
            email: user.email,
            role: user.role
        };

        // Add companyId for employers
        if (user.role === 'employer' && user.companyId) {
            tokenPayload.companyId = user.companyId;
        }

        const token = jwt.sign(
            tokenPayload,
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '7d' }
        );

        res.json({
            message: 'Login successful',
            token,
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                role: user.role,
                companyId: user.companyId
            }
        });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Forgot Password (Step 1: Send OTP)
router.post('/forgot-password', async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }

        // Check if user exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Generate OTP for password reset
        const otpData = otpService.generateOTPWithExpiry();
        console.log('Generated OTP data:', otpData);

        // Store OTP in user document
        user.passwordResetOTP = {
            code: otpData.code,
            expiresAt: otpData.expiresAt
        };
        await user.save();

        console.log(`Password reset OTP for ${email}: ${otpData.code}`);

        const responseData = {
            message: 'Password reset OTP sent successfully',
            code: otpData.code, // For EmailJS to send
            userId: user._id,
            email: user.email
        };
        console.log('Sending response:', responseData);
        res.json(responseData);
    } catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Reset Password (Step 2: Verify OTP and reset password)
router.post('/reset-password', async (req, res) => {
    try {
        const { userId, code, newPassword } = req.body;

        if (!userId || !code || !newPassword) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Find user
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Verify OTP
        if (!user.passwordResetOTP || !user.passwordResetOTP.code) {
            return res.status(400).json({ message: 'No password reset request found' });
        }

        const isValidOTP = otpService.validateOTP(code, user.passwordResetOTP.code, user.passwordResetOTP.expiresAt);
        if (!isValidOTP) {
            return res.status(400).json({ message: 'Invalid or expired OTP' });
        }

        // Hash new password
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password and clear OTP
        user.password = hashedPassword;
        user.passwordResetOTP = undefined;
        await user.save();

        console.log(`Password reset successful for user: ${user.email}`);

        res.json({
            message: 'Password reset successfully'
        });
    } catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Save user profile data
router.put('/profile', async (req, res) => {
    try {
        const { userId, profileData } = req.body;

        if (!userId || !profileData) {
            return res.status(400).json({ message: 'User ID and profile data are required' });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Update user profile data
        user.fullName = profileData.fullName || user.fullName;
        user.phone = profileData.phone || user.phone;

        // Update profile object
        if (!user.profile) {
            user.profile = {};
        }

        user.profile.bio = profileData.bio || user.profile.bio;
        user.profile.skills = profileData.skills || user.profile.skills || [];
        user.profile.experience = profileData.experience || user.profile.experience || [];
        user.profile.education = profileData.education || user.profile.education || [];
        user.profile.cvUrl = profileData.cvUrl || user.profile.cvUrl; // ✅ Thêm hỗ trợ CV URL

        // Update location
        if (!user.profile.location) {
            user.profile.location = {};
        }
        user.profile.location.address = profileData.location || user.profile.location.address;

        await user.save();

        console.log(`Profile updated for user: ${user.email}`);
        res.json({
            message: 'Profile updated successfully',
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                location: user.profile?.location?.address || '',
                bio: user.profile?.bio || '',
                skills: user.profile?.skills || [],
                experience: user.profile?.experience || [],
                education: user.profile?.education || [],
                role: user.role,
                profile: {
                    cvUrl: user.profile?.cvUrl || '' // ✅ Trả về CV URL
                }
            }
        });
    } catch (error) {
        console.error('Save profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get user profile data
router.get('/profile/:userId', async (req, res) => {
    try {
        const { userId } = req.params;

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            user: {
                id: user._id,
                email: user.email,
                fullName: user.fullName,
                phone: user.phone,
                location: user.profile?.location?.address || '',
                bio: user.profile?.bio || '',
                skills: user.profile?.skills || [],
                experience: user.profile?.experience || [],
                education: user.profile?.education || [],
                role: user.role
            }
        });
    } catch (error) {
        console.error('Get profile error:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

// Get current user info (validate token)
router.get('/me', authenticateToken, async (req, res) => {
    try {
        const user = await User.findById(req.user.userId)
            .select('-password')
            .populate('companyId', 'name logo');

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.json({
            id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            companyId: user.companyId,
            isVerified: user.isVerified,
            avatar: user.avatar,
            phone: user.phone,
            location: user.profile?.location?.address || '',
            bio: user.profile?.bio || '',
            skills: user.profile?.skills || [],
            experience: user.profile?.experience || [],
            education: user.profile?.education || [],
            profile: {
                cvUrl: user.profile?.cvUrl || '' // ✅ Trả về CV URL
            }
        });
    } catch (error) {
        console.error('Get current user error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Create sample company for testing (development only)
router.post('/create-sample-company', authenticateToken, async (req, res) => {
    try {
        if (process.env.NODE_ENV === 'production') {
            return res.status(403).json({ message: 'Not available in production' });
        }

        if (req.user.role !== 'employer') {
            return res.status(403).json({ message: 'Only employers can create companies' });
        }

        // Check if user already has a company
        const user = await User.findById(req.user.userId);
        if (user.companyId) {
            return res.status(400).json({ message: 'User already has a company' });
        }

        const sampleCompany = {
            name: 'TechCorp Vietnam',
            email: 'hr@techcorp.vn',
            description: 'Công ty công nghệ hàng đầu chuyên phát triển phần mềm và ứng dụng di động.',
            website: 'https://techcorp.vn',
            phone: '0901234567',
            address: {
                street: '123 Nguyễn Văn Cừ',
                district: 'Quận 5',
                city: 'Ho Chi Minh City',
                coordinates: {
                    lat: 10.7769,
                    lng: 106.6951
                }
            },
            industry: 'Technology',
            size: 'medium',
            foundedYear: 2018,
            socialMedia: {
                facebook: 'https://facebook.com/techcorp',
                linkedin: 'https://linkedin.com/company/techcorp'
            }
        };

        const company = new Company(sampleCompany);
        await company.save();

        // Update user with company ID
        user.companyId = company._id;
        await user.save();

        res.status(201).json({
            message: 'Sample company created successfully',
            company
        });
    } catch (error) {
        console.error('Error creating sample company:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

module.exports = router;

