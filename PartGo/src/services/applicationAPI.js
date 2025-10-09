import api from './authAPI';

// Application Management API for Employers
export const applicationAPI = {
    // Get applications for a specific job
    getJobApplications: async (jobId, params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await api.get(`/applications/job/${jobId}?${queryParams}`);
        // Backend returns { applications, totalPages, currentPage, total }
        // Return just the applications array for compatibility
        return response.data.applications || [];
    },

    // Get application statistics for a job
    getJobApplicationStats: async (jobId) => {
        const response = await api.get(`/applications/job/${jobId}/stats`);
        return response.data;
    },

    // Update application status
    updateApplicationStatus: async (applicationId, status) => {
        const response = await api.put(`/applications/${applicationId}/status`, {
            status
        });
        return response.data;
    },

    // Add note to application
    addNoteToApplication: async (applicationId, text) => {
        const response = await api.post(`/applications/${applicationId}/notes`, {
            text
        });
        return response.data;
    }
};

// Application status options
export const applicationStatuses = [
    {
        value: 'pending',
        label: 'Chờ xem xét',
        color: '#f59e0b',
        description: 'Đơn ứng tuyển mới'
    },
    {
        value: 'reviewed',
        label: 'Đã xem xét',
        color: '#3b82f6',
        description: 'Đã xem qua hồ sơ'
    },
    {
        value: 'shortlisted',
        label: 'Sơ tuyển',
        color: '#8b5cf6',
        description: 'Đã qua vòng sơ tuyển'
    },
    {
        value: 'interviewed',
        label: 'Đã phỏng vấn',
        color: '#06b6d4',
        description: 'Đã hoàn thành phỏng vấn'
    },
    {
        value: 'accepted',
        label: 'Chấp nhận',
        color: '#10b981',
        description: 'Đã chấp nhận ứng viên'
    },
    {
        value: 'rejected',
        label: 'Từ chối',
        color: '#ef4444',
        description: 'Không phù hợp'
    }
];

export default applicationAPI;

