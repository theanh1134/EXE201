import { useState, useEffect, useCallback } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { useNotification } from '../../contexts/NotificationContext';
import { jobAPI } from '../../services/jobAPI';
import { applicationAPI } from '../../services/applicationAPI';

export const useEmployerData = () => {
    const { user } = useAuth();
    const { error: showError } = useNotification();
    
    const [loading, setLoading] = useState(true);
    const [jobs, setJobs] = useState([]);
    const [applications, setApplications] = useState([]);
    const [stats, setStats] = useState({
        totalJobs: 0,
        activeJobs: 0,
        draftJobs: 0,
        closedJobs: 0,
        totalApplications: 0,
        pendingApplications: 0,
        totalViews: 0,
        totalSaves: 0,
        avgApplicationsPerJob: 0,
        conversionRate: 0
    });

    // Load all employer data
    const loadData = useCallback(async () => {
        if (!user || user.role !== 'employer') {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            
            // Load jobs
            const jobsResponse = await jobAPI.getUserJobs(null, { limit: 100 });
            const jobsData = jobsResponse.jobs || [];
            setJobs(jobsData);

            // Calculate job statistics
            const totalJobs = jobsData.length;
            const activeJobs = jobsData.filter(job => job.status === 'published').length;
            const draftJobs = jobsData.filter(job => job.status === 'draft').length;
            const closedJobs = jobsData.filter(job => job.status === 'closed').length;
            const totalViews = jobsData.reduce((sum, job) => sum + (job.views || 0), 0);
            const totalSaves = jobsData.reduce((sum, job) => sum + (job.saves || 0), 0);
            const totalApplications = jobsData.reduce((sum, job) => sum + (job.applied || 0), 0);

            // Calculate metrics
            const avgApplicationsPerJob = totalJobs > 0 ? Math.round(totalApplications / totalJobs) : 0;
            const conversionRate = totalViews > 0 ? Math.round((totalApplications / totalViews) * 100) : 0;

            // Try to load applications data (if API exists)
            let pendingApplications = 0;
            try {
                // This would need to be implemented in the API
                // const applicationsResponse = await applicationAPI.getMyApplications({ status: 'pending' });
                // pendingApplications = applicationsResponse.total || 0;
                // setApplications(applicationsResponse.applications || []);
            } catch (error) {
                console.log('Applications API not available');
            }

            setStats({
                totalJobs,
                activeJobs,
                draftJobs,
                closedJobs,
                totalApplications,
                pendingApplications,
                totalViews,
                totalSaves,
                avgApplicationsPerJob,
                conversionRate
            });

        } catch (error) {
            console.error('Error loading employer data:', error);
            showError('Lỗi khi tải dữ liệu: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    }, [user, showError]);

    // Load jobs only
    const loadJobs = useCallback(async (filters = {}) => {
        try {
            const response = await jobAPI.getUserJobs(null, filters);
            setJobs(response.jobs || []);
            return response;
        } catch (error) {
            console.error('Error loading jobs:', error);
            showError('Lỗi khi tải danh sách công việc: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Create job
    const createJob = useCallback(async (jobData) => {
        try {
            const response = await jobAPI.createJob(jobData);
            setJobs(prev => [response, ...prev]);
            return response;
        } catch (error) {
            console.error('Error creating job:', error);
            showError('Lỗi khi tạo công việc: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Update job
    const updateJob = useCallback(async (jobId, jobData) => {
        try {
            const response = await jobAPI.updateJob(jobId, jobData);
            setJobs(prev => prev.map(job => job._id === jobId ? response : job));
            return response;
        } catch (error) {
            console.error('Error updating job:', error);
            showError('Lỗi khi cập nhật công việc: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Delete job
    const deleteJob = useCallback(async (jobId) => {
        try {
            await jobAPI.deleteJob(jobId);
            setJobs(prev => prev.filter(job => job._id !== jobId));
        } catch (error) {
            console.error('Error deleting job:', error);
            showError('Lỗi khi xóa công việc: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Publish job
    const publishJob = useCallback(async (jobId) => {
        try {
            const response = await jobAPI.publishJob(jobId);
            setJobs(prev => prev.map(job => 
                job._id === jobId ? { ...job, status: 'published', publishAt: new Date() } : job
            ));
            return response;
        } catch (error) {
            console.error('Error publishing job:', error);
            showError('Lỗi khi đăng tin: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Clone job
    const cloneJob = useCallback(async (jobId) => {
        try {
            const response = await jobAPI.cloneJob(jobId);
            setJobs(prev => [response, ...prev]);
            return response;
        } catch (error) {
            console.error('Error cloning job:', error);
            showError('Lỗi khi sao chép công việc: ' + (error.message || 'Unknown error'));
            throw error;
        }
    }, [showError]);

    // Load data on mount
    useEffect(() => {
        loadData();
    }, [loadData]);

    return {
        loading,
        jobs,
        applications,
        stats,
        loadData,
        loadJobs,
        createJob,
        updateJob,
        deleteJob,
        publishJob,
        cloneJob
    };
};
