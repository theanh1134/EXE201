import axios from 'axios';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ Thêm dòng này để gửi cookies
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth API
export const authAPI = {
    // Register job seeker (Step 1: Send OTP)
    register: async (userData) => {
        try {
            const response = await api.post('/auth/register', userData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Verify email with OTP
    verifyEmail: async (userId, code) => {
        try {
            const response = await api.post('/auth/verify-email', { userId, code });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Resend verification code
    resendVerification: async (userId) => {
        try {
            const response = await api.post('/auth/resend-verification', { userId });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Register company (Step 1: Send OTP)
    registerCompany: async (companyData) => {
        try {
            const response = await api.post('/auth/register-company', companyData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Login
    login: async (credentials) => {
        try {
            const response = await api.post('/auth/login', credentials);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Logout (client-side only)
    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
    },

    // Get current user from localStorage
    getCurrentUser: () => {
        const user = localStorage.getItem('user');
        return user ? JSON.parse(user) : null;
    },

    // Check if user is authenticated
    isAuthenticated: () => {
        const token = localStorage.getItem('token');
        return !!token;
    },

    // ✅ Di chuyển forgotPassword và resetPassword vào đúng chỗ
    // Forgot password
    forgotPassword: async (email) => {
        try {
            const response = await api.post('/auth/forgot-password', { email });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Reset password
    resetPassword: async (userId, code, newPassword) => {
        try {
            const response = await api.post('/auth/reset-password', {
                userId,
                code,
                newPassword
            });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Jobs API
export const jobsAPI = {
    // Get all jobs
    getAllJobs: async (params = {}) => {
        try {
            const response = await api.get('/jobs', { params });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get job by ID
    getJobById: async (jobId) => {
        try {
            const response = await api.get(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create job (employer only)
    createJob: async (jobData) => {
        try {
            const response = await api.post('/jobs', jobData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update job (employer only)
    updateJob: async (jobId, jobData) => {
        try {
            const response = await api.put(`/jobs/${jobId}`, jobData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Delete job (employer only)
    deleteJob: async (jobId) => {
        try {
            const response = await api.delete(`/jobs/${jobId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Applications API
export const applicationsAPI = {
    // Apply for job
    applyForJob: async (applicationData) => {
        try {
            const response = await api.post('/applications', applicationData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get user applications
    getUserApplications: async () => {
        try {
            const response = await api.get('/applications');
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Get job applications (employer only)
    getJobApplications: async (jobId) => {
        try {
            const response = await api.get(`/applications/job/${jobId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Update application status (employer only)
    updateApplicationStatus: async (applicationId, status) => {
        try {
            const response = await api.put(`/applications/${applicationId}`, { status });
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Reviews API
export const reviewsAPI = {
    // Get reviews for a job/company
    getReviews: async (jobId) => {
        try {
            const response = await api.get(`/reviews/job/${jobId}`);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    },

    // Create review
    createReview: async (reviewData) => {
        try {
            const response = await api.post('/reviews', reviewData);
            return response.data;
        } catch (error) {
            throw error.response?.data || error.message;
        }
    }
};

// Health check
export const healthCheck = async () => {
    try {
        const response = await api.get('/health');
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;