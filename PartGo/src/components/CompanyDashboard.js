import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { jobAPI, jobOptions } from '../services/jobAPI';
import CreateJobModal from './CreateJobModal';
import ApplicationsList from './ApplicationsList';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
import './CompanyDashboard.css';

const CompanyDashboard = () => {
    const { user, logout } = useAuth();
    const { success, error: showError, warning } = useNotification();

    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateJob, setShowCreateJob] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [currentView, setCurrentView] = useState('jobs'); // 'jobs', 'applications'
    const [selectedJob, setSelectedJob] = useState(null);
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        draft: 0,
        closed: 0,
        totalViews: 0,
        totalApplications: 0
    });

    useEffect(() => {
        console.log('CompanyDashboard - user:', user);
        console.log('CompanyDashboard - user.companyId:', user?.companyId);

        // Chỉ cần kiểm tra role === 'employer' là đủ
        if (user?.role === 'employer') {
            loadJobs();
        } else {
            // Nếu không có user hoặc không phải employer, set loading = false
            setLoading(false);
        }
    }, [user, selectedStatus]);

    const loadJobs = async () => {
        try {
            setLoading(true);
            const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};

            // Lấy jobs của user hiện tại
            console.log('Loading jobs for current user');

            const response = await jobAPI.getUserJobs(null, params);
            console.log('Jobs response:', response);

            setJobs(response.jobs || []);

            // Tính thống kê
            const totalStats = {
                total: response.jobs?.length || 0,
                published: response.jobs?.filter(job => job.status === 'published').length || 0,
                draft: response.jobs?.filter(job => job.status === 'draft').length || 0,
                closed: response.jobs?.filter(job => job.status === 'closed').length || 0,
                totalViews: response.jobs?.reduce((sum, job) => sum + (job.views || 0), 0) || 0,
                totalApplications: response.jobs?.reduce((sum, job) => sum + (job.applied || 0), 0) || 0
            };
            setStats(totalStats);
        } catch (error) {
            console.error('Error loading jobs:', error);
            showError('Lỗi khi tải danh sách công việc: ' + (error.message || 'Unknown error'), 'Lỗi');
        } finally {
            setLoading(false);
        }
    };

    const handleCreateJob = () => {
        setEditingJob(null);
        setShowCreateJob(true);
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setShowCreateJob(true);
    };

    const handleJobCreated = (job) => {
        if (editingJob) {
            setJobs(prev => prev.map(j => j._id === job._id ? job : j));
            success('Đã cập nhật công việc thành công!', 'Cập nhật');
        } else {
            setJobs(prev => [job, ...prev]);
            success('Đã tạo công việc thành công!', 'Tạo mới');
        }
        loadJobs(); // Reload để cập nhật stats
    };

    const handlePublishJob = async (jobId) => {
        try {
            await jobAPI.publishJob(jobId);
            setJobs(prev => prev.map(job =>
                job._id === jobId ? { ...job, status: 'published', publishAt: new Date() } : job
            ));
            success('Đã đăng tin tuyển dụng thành công!', 'Đăng tin');
            loadJobs(); // Reload để cập nhật stats
        } catch (error) {
            showError('Lỗi khi đăng tin: ' + (error.message || 'Unknown error'), 'Lỗi');
        }
    };

    const handleCloneJob = async (jobId) => {
        try {
            const clonedJob = await jobAPI.cloneJob(jobId);
            setJobs(prev => [clonedJob, ...prev]);
            success('Đã sao chép công việc thành công!', 'Sao chép');
            loadJobs(); // Reload để cập nhật stats
        } catch (error) {
            showError('Lỗi khi sao chép: ' + (error.message || 'Unknown error'), 'Lỗi');
        }
    };

    const handleViewApplications = (job) => {
        console.log('Viewing applications for job:', job._id, job.title);
        setSelectedJob(job);
        setCurrentView('applications');
    };

    const handleBackToJobs = () => {
        setCurrentView('jobs');
        setSelectedJob(null);
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            return;
        }

        try {
            await jobAPI.deleteJob(jobId);
            setJobs(prev => prev.filter(job => job._id !== jobId));
            success('Đã xóa công việc thành công!', 'Xóa');
            loadJobs(); // Reload để cập nhật stats
        } catch (error) {
            showError('Lỗi khi xóa: ' + (error.message || 'Unknown error'), 'Lỗi');
        }
    };

    const getStatusBadge = (status) => {
        const statusConfig = jobOptions.statuses.find(s => s.value === status);
        return (
            <span className={`status-badge status-${statusConfig?.color || 'gray'}`}>
                {statusConfig?.label || status}
            </span>
        );
    };

    const getPriorityBadge = (priority) => {
        const priorityConfig = jobOptions.priorities.find(p => p.value === priority);
        return (
            <span className={`priority-badge priority-${priorityConfig?.color || 'blue'}`}>
                {priorityConfig?.label || priority}
            </span>
        );
    };

    const formatSalary = (salary) => {
        if (!salary.isPublic) return 'Thỏa thuận';
        const min = salary.min?.toLocaleString('vi-VN') || '0';
        const max = salary.max?.toLocaleString('vi-VN') || '0';
        return `${min} - ${max} ${salary.currency}`;
    };

    if (loading) {
        return (
            <div className="company-dashboard">
                <Header />
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải...</p>
                </div>
                <PartGOFooter />
            </div>
        );
    }

    // Nếu đang xem applications, hiển thị ApplicationsList
    if (currentView === 'applications' && selectedJob) {
        return (
            <div className="company-dashboard">
                <Header />
                <ApplicationsList
                    jobId={selectedJob._id}
                    jobTitle={selectedJob.title}
                    onClose={handleBackToJobs}
                />
                <PartGOFooter />
            </div>
        );
    }

    return (
        <div className="company-dashboard">
            <Header />

            <div className="dashboard-container">
                <div className="dashboard-header">
                    <div className="header-content">
                        <h1>Dashboard Nhà Tuyển Dụng</h1>
                        <p>Quản lý tin tuyển dụng và ứng viên</p>
                    </div>
                    <button
                        className="btn-create-job"
                        onClick={handleCreateJob}
                    >
                        + Đăng tin tuyển dụng
                    </button>
                </div>

                {/* Statistics */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <div className="stat-icon">📊</div>
                        <div className="stat-content">
                            <h3>{stats.total}</h3>
                            <p>Tổng tin đăng</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">✅</div>
                        <div className="stat-content">
                            <h3>{stats.published}</h3>
                            <p>Đã đăng</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📝</div>
                        <div className="stat-content">
                            <h3>{stats.draft}</h3>
                            <p>Nháp</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">👁️</div>
                        <div className="stat-content">
                            <h3>{stats.totalViews}</h3>
                            <p>Lượt xem</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <div className="stat-icon">📋</div>
                        <div className="stat-content">
                            <h3>{stats.totalApplications}</h3>
                            <p>Ứng tuyển</p>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <div className="filters-section">
                    <div className="filter-tabs">
                        <button
                            className={`filter-tab ${selectedStatus === 'all' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('all')}
                        >
                            Tất cả ({stats.total})
                        </button>
                        <button
                            className={`filter-tab ${selectedStatus === 'published' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('published')}
                        >
                            Đã đăng ({stats.published})
                        </button>
                        <button
                            className={`filter-tab ${selectedStatus === 'draft' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('draft')}
                        >
                            Nháp ({stats.draft})
                        </button>
                        <button
                            className={`filter-tab ${selectedStatus === 'closed' ? 'active' : ''}`}
                            onClick={() => setSelectedStatus('closed')}
                        >
                            Đã đóng ({stats.closed})
                        </button>
                    </div>
                </div>

                {/* Jobs List */}
                <div className="jobs-section">
                    <h2>Danh sách công việc</h2>

                    {jobs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>Chưa có tin tuyển dụng nào</h3>
                            <p>Bắt đầu bằng cách tạo tin tuyển dụng đầu tiên của bạn</p>
                            <button
                                className="btn-primary"
                                onClick={handleCreateJob}
                            >
                                Tạo tin tuyển dụng
                            </button>
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {jobs.map(job => (
                                <div key={job._id} className="job-card">
                                    <div className="job-header">
                                        <div className="job-title-section">
                                            <h3>{job.title}</h3>
                                            <div className="job-badges">
                                                {getStatusBadge(job.status)}
                                                {getPriorityBadge(job.priority)}
                                                {job.isUrgent && <span className="urgent-badge">🔥 Urgent</span>}
                                                {job.isHot && <span className="hot-badge">⭐ Hot</span>}
                                            </div>
                                        </div>
                                        <div className="job-actions">
                                            <button
                                                className="action-btn applicants"
                                                onClick={() => handleViewApplications(job)}
                                                title="Xem ứng viên"
                                            >
                                                👥
                                            </button>
                                            <button
                                                className="action-btn edit"
                                                onClick={() => handleEditJob(job)}
                                                title="Chỉnh sửa"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                className="action-btn clone"
                                                onClick={() => handleCloneJob(job._id)}
                                                title="Sao chép"
                                            >
                                                📋
                                            </button>
                                            <button
                                                className="action-btn delete"
                                                onClick={() => handleDeleteJob(job._id)}
                                                title="Xóa"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </div>

                                    <div className="job-content">
                                        <div className="job-info">
                                            <div className="info-item">
                                                <span className="label">Loại:</span>
                                                <span>{jobOptions.types.find(t => t.value === job.type)?.label}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Cấp bậc:</span>
                                                <span>{jobOptions.levels.find(l => l.value === job.level)?.label}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Địa điểm:</span>
                                                <span>{job.location?.city}</span>
                                            </div>
                                            <div className="info-item">
                                                <span className="label">Lương:</span>
                                                <span>{formatSalary(job.salary)}</span>
                                            </div>
                                        </div>

                                        <div className="job-stats">
                                            <div className="stat-item">
                                                <span className="stat-number">{job.views || 0}</span>
                                                <span className="stat-label">Lượt xem</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">{job.applied || 0}</span>
                                                <span className="stat-label">Ứng tuyển</span>
                                            </div>
                                            <div className="stat-item">
                                                <span className="stat-number">{job.saves || 0}</span>
                                                <span className="stat-label">Lưu</span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="job-footer">
                                        <div className="job-dates">
                                            <span>Tạo: {new Date(job.createdAt).toLocaleDateString('vi-VN')}</span>
                                            {job.publishAt && (
                                                <span>Đăng: {new Date(job.publishAt).toLocaleDateString('vi-VN')}</span>
                                            )}
                                        </div>
                                        {job.status === 'draft' && (
                                            <button
                                                className="btn-publish"
                                                onClick={() => handlePublishJob(job._id)}
                                            >
                                                Đăng tin
                                            </button>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <PartGOFooter />

            {/* Create/Edit Job Modal */}
            <CreateJobModal
                isOpen={showCreateJob}
                onClose={() => {
                    setShowCreateJob(false);
                    setEditingJob(null);
                }}
                onJobCreated={handleJobCreated}
                editJob={editingJob}
            />
        </div>
    );
};

export default CompanyDashboard;