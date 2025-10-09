import api from './authAPI';

export async function fetchJobs(params = {}) {
    try {
        const response = await api.get('/jobs', { params });
        return response.data; // { jobs, totalPages, currentPage, total }
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function fetchJobById(id) {
    try {
        const response = await api.get(`/jobs/${id}`);
        return response.data; // job object
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function applyToJob({ jobId, coverLetter, cvUrl }) {
    try {
        const response = await api.post('/applications', { jobId, coverLetter, cvUrl });
        return response.data; // application object
    } catch (error) {
        throw error.response?.data || error.message;
    }
}

export async function fetchApplications() {
    try {
        const response = await api.get('/applications');
        return response.data; // array of applications
    } catch (error) {
        throw error.response?.data || error.message;
    }
}


