import React, { useState, useEffect } from 'react';
import { useEmployerData } from '../../../hooks/employer/useEmployerData';
import { applicationAPI } from '../../../services/applicationAPI';
import api from '../../../services/authAPI';
import { useNotification } from '../../../contexts/NotificationContext';
import { useAuth } from '../../../contexts/AuthContext';
import EmployerLayout from '../Layout/EmployerLayout';
import ApplicationFilters from './ApplicationFilters';
import ApplicationCard from './ApplicationCard';
import ApplicationBulkActions from './ApplicationBulkActions';
import ApplicationDetailModal from './ApplicationDetailModal';
import InterviewScheduleModal from './InterviewScheduleModal';
import './ApplicationManagement.css';

const ApplicationManagement = () => {
    const { jobs, loading: jobsLoading, loadData } = useEmployerData();
    const { success, error: showError, success: showSuccess } = useNotification();
    const { user } = useAuth();

    // Debug logging
    useEffect(() => {
        console.log('ApplicationManagement - Auth state:', {
            user,
            isLoggedIn: !!user,
            userRole: user?.role,
            token: localStorage.getItem('token') ? 'exists' : 'missing'
        });
    }, [user]);

    const [applications, setApplications] = useState([]);
    const [filteredApplications, setFilteredApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplications, setSelectedApplications] = useState([]);

    const [filters, setFilters] = useState({
        jobId: 'all',
        status: 'all',
        search: '',
        dateRange: 'all',
        sortBy: 'newest'
    });

    const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [showInterviewModal, setShowInterviewModal] = useState(false);
    const [interviewApplication, setInterviewApplication] = useState(null);

    // Load applications
    useEffect(() => {
        loadApplications();
    }, [jobs]);

    // ESC key handler to close modals
    useEffect(() => {
        const handleEscKey = (event) => {
            if (event.key === 'Escape') {
                setShowDetailModal(false);
                setShowInterviewModal(false);
                setSelectedApplication(null);
                setInterviewApplication(null);
            }
        };

        document.addEventListener('keydown', handleEscKey);
        return () => {
            document.removeEventListener('keydown', handleEscKey);
        };
    }, []);

    const loadApplications = async () => {
        if (jobs.length === 0) return;

        try {
            setLoading(true);
            const allApplications = [];

            // Load applications for all jobs
            for (const job of jobs) {
                try {
                    const jobApplications = await applicationAPI.getJobApplications(job._id);
                    const applicationsWithJob = jobApplications.map(app => ({
                        ...app,
                        jobInfo: {
                            _id: job._id,
                            title: job.title,
                            type: job.type,
                            location: job.location
                        }
                    }));
                    allApplications.push(...applicationsWithJob);
                } catch (error) {
                    console.warn(`Failed to load applications for job ${job._id}:`, error);
                }
            }

            setApplications(allApplications);
        } catch (error) {
            showError('Lỗi khi tải danh sách ứng viên: ' + (error.message || 'Unknown error'));
        } finally {
            setLoading(false);
        }
    };

    // Create sample data for testing
    const createSampleData = async () => {
        try {
            setLoading(true);

            // Create sample company first (if user doesn't have one)
            try {
                await api.post('/auth/create-sample-company');
            } catch (companyError) {
                // Company might already exist, continue
                console.log('Company creation skipped:', companyError.response?.data?.message);
            }

            // Create sample job
            const jobResponse = await api.post('/jobs/create-sample');
            const job = jobResponse.data.job;

            // Create sample applications for the job
            await api.post('/applications/create-sample', { jobId: job._id });

            // Reload data
            await loadData();
            await loadApplications();
            showSuccess('Đã tạo dữ liệu mẫu thành công!');
        } catch (error) {
            console.error('Error creating sample data:', error);
            showError('Lỗi khi tạo dữ liệu mẫu: ' + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    // Filter and sort applications
    useEffect(() => {
        let filtered = [...applications];

        // Apply filters
        if (filters.jobId !== 'all') {
            filtered = filtered.filter(app => app.job === filters.jobId);
        }

        if (filters.status !== 'all') {
            filtered = filtered.filter(app => app.status === filters.status);
        }

        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(app =>
                app.applicant?.fullName?.toLowerCase().includes(searchLower) ||
                app.applicant?.email?.toLowerCase().includes(searchLower) ||
                app.jobInfo?.title?.toLowerCase().includes(searchLower)
            );
        }

        // Date range filter
        if (filters.dateRange !== 'all') {
            const now = new Date();
            const filterDate = new Date();

            switch (filters.dateRange) {
                case 'today':
                    filterDate.setHours(0, 0, 0, 0);
                    break;
                case 'week':
                    filterDate.setDate(now.getDate() - 7);
                    break;
                case 'month':
                    filterDate.setMonth(now.getMonth() - 1);
                    break;
                default:
                    break;
            }

            if (filters.dateRange !== 'all') {
                filtered = filtered.filter(app => new Date(app.appliedAt) >= filterDate);
            }
        }

        // Apply sorting
        switch (filters.sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.appliedAt) - new Date(a.appliedAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.appliedAt) - new Date(b.appliedAt));
                break;
            case 'name':
                filtered.sort((a, b) => (a.applicant?.fullName || '').localeCompare(b.applicant?.fullName || ''));
                break;
            case 'status':
                filtered.sort((a, b) => a.status.localeCompare(b.status));
                break;
            default:
                break;
        }

        setFilteredApplications(filtered);
    }, [applications, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setSelectedApplications([]); // Clear selection when filters change
    };

    const handleApplicationSelect = (applicationId, selected) => {
        if (selected) {
            setSelectedApplications(prev => [...prev, applicationId]);
        } else {
            setSelectedApplications(prev => prev.filter(id => id !== applicationId));
        }
    };

    const handleSelectAll = (selected) => {
        if (selected) {
            setSelectedApplications(filteredApplications.map(app => app._id));
        } else {
            setSelectedApplications([]);
        }
    };

    const handleStatusUpdate = async (applicationId, newStatus) => {
        try {
            await applicationAPI.updateApplicationStatus(applicationId, newStatus);

            // Update local state
            setApplications(prev => prev.map(app =>
                app._id === applicationId ? { ...app, status: newStatus } : app
            ));

            success(`Đã cập nhật trạng thái thành "${getStatusLabel(newStatus)}"`);
        } catch (error) {
            showError('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Unknown error'));
        }
    };

    const handleBulkStatusUpdate = async (status) => {
        if (selectedApplications.length === 0) {
            showError('Vui lòng chọn ít nhất một ứng viên');
            return;
        }

        try {
            await Promise.all(
                selectedApplications.map(id => applicationAPI.updateApplicationStatus(id, status))
            );

            // Update local state
            setApplications(prev => prev.map(app =>
                selectedApplications.includes(app._id) ? { ...app, status } : app
            ));

            success(`Đã cập nhật trạng thái cho ${selectedApplications.length} ứng viên`);
            setSelectedApplications([]);
        } catch (error) {
            showError('Lỗi khi cập nhật hàng loạt: ' + (error.message || 'Unknown error'));
        }
    };

    const refreshAuthState = async () => {
        try {
            const { validateAuthState } = await import('../../../services/authAPI');
            const validatedUser = await validateAuthState();
            console.log('Auth state refreshed:', validatedUser);
            showSuccess('Auth state đã được refresh!');
        } catch (error) {
            console.error('Refresh auth state error:', error);
            showError('Lỗi khi refresh auth state: ' + error.message);
        }
    };

    const handleViewDetails = (application) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };

    const handleScheduleInterview = (application) => {
        setInterviewApplication(application);
        setShowInterviewModal(true);
    };

    const getStatusLabel = (status) => {
        const statusMap = {
            'pending': 'Chờ xem xét',
            'reviewed': 'Đã xem xét',
            'shortlisted': 'Sơ tuyển',
            'interviewed': 'Đã phỏng vấn',
            'accepted': 'Chấp nhận',
            'rejected': 'Từ chối'
        };
        return statusMap[status] || status;
    };

    if (jobsLoading || loading) {
        return (
            <EmployerLayout currentPage="applications">
                <div className="application-management">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải danh sách ứng viên...</p>
                    </div>
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout currentPage="applications">
            <div className="application-management">
                {/* Header */}
                <div className="application-management-header">
                    <div className="header-content">
                        <h1>Quản lý ứng viên</h1>
                        <p>Xem xét và quản lý các đơn ứng tuyển</p>
                        {applications.length === 0 && !loading && (
                            <button
                                className="sample-btn"
                                onClick={createSampleData}
                                disabled={loading}
                                style={{
                                    marginTop: '12px',
                                    padding: '8px 16px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    cursor: 'pointer'
                                }}
                            >
                                🎯 Tạo dữ liệu mẫu
                            </button>
                        )}

                        {/* Debug: Auth Status */}
                        <div style={{
                            marginTop: '12px',
                            padding: '8px',
                            background: '#f0f0f0',
                            borderRadius: '4px',
                            fontSize: '12px'
                        }}>
                            <strong>Auth Debug:</strong> User: {user ? `${user.email} (${user.role})` : 'Not logged in'} |
                            Token: {localStorage.getItem('token') ? 'exists' : 'missing'}
                            <button
                                onClick={refreshAuthState}
                                style={{
                                    marginLeft: '8px',
                                    padding: '4px 8px',
                                    background: '#3b82f6',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '3px',
                                    fontSize: '11px',
                                    cursor: 'pointer'
                                }}
                            >
                                🔄 Refresh Auth
                            </button>
                        </div>

                        {/* Debug: Force close modals */}
                        {(showDetailModal || showInterviewModal) && (
                            <div style={{ marginTop: '12px' }}>
                                <span style={{
                                    fontSize: '12px',
                                    color: '#ef4444',
                                    marginRight: '8px'
                                }}>
                                    Modal đang mở: {showDetailModal ? 'Detail' : ''} {showInterviewModal ? 'Interview' : ''}
                                </span>
                                <button
                                    onClick={() => {
                                        setShowDetailModal(false);
                                        setShowInterviewModal(false);
                                        setSelectedApplication(null);
                                        setInterviewApplication(null);
                                    }}
                                    style={{
                                        padding: '6px 12px',
                                        background: '#ef4444',
                                        color: 'white',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        cursor: 'pointer'
                                    }}
                                >
                                    ❌ Đóng Modal
                                </button>
                            </div>
                        )}
                    </div>
                    <div className="header-stats">
                        <div className="stat-item">
                            <span className="stat-number">{applications.length}</span>
                            <span className="stat-label">Tổng ứng viên</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {applications.filter(app => app.status === 'pending').length}
                            </span>
                            <span className="stat-label">Chờ xem xét</span>
                        </div>
                        <div className="stat-item">
                            <span className="stat-number">
                                {applications.filter(app => app.status === 'interviewed').length}
                            </span>
                            <span className="stat-label">Đã phỏng vấn</span>
                        </div>
                    </div>
                </div>

                {/* Filters */}
                <ApplicationFilters
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    jobs={jobs}
                    applicationCount={filteredApplications.length}
                    totalCount={applications.length}
                />

                {/* Bulk Actions */}
                {selectedApplications.length > 0 && (
                    <ApplicationBulkActions
                        selectedCount={selectedApplications.length}
                        onBulkStatusUpdate={handleBulkStatusUpdate}
                        onClearSelection={() => setSelectedApplications([])}
                    />
                )}

                {/* View Controls */}
                <div className="view-controls">
                    <div className="view-mode">
                        <button
                            className={`view-btn ${viewMode === 'cards' ? 'active' : ''}`}
                            onClick={() => setViewMode('cards')}
                        >
                            ⊞ Cards
                        </button>
                        <button
                            className={`view-btn ${viewMode === 'table' ? 'active' : ''}`}
                            onClick={() => setViewMode('table')}
                        >
                            ☰ Table
                        </button>
                    </div>

                    <div className="select-all">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedApplications.length === filteredApplications.length && filteredApplications.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            Chọn tất cả ({filteredApplications.length})
                        </label>
                    </div>
                </div>

                {/* Applications List */}
                <div className={`applications-container ${viewMode}`}>
                    {filteredApplications.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">👥</div>
                            <h3>Không tìm thấy ứng viên nào</h3>
                            <p>
                                {applications.length === 0
                                    ? 'Chưa có ứng viên nào ứng tuyển vào các tin tuyển dụng của bạn.'
                                    : 'Thử thay đổi bộ lọc để xem thêm kết quả'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="applications-grid">
                            {filteredApplications.map(application => (
                                <ApplicationCard
                                    key={application._id}
                                    application={application}
                                    selected={selectedApplications.includes(application._id)}
                                    onSelect={(selected) => handleApplicationSelect(application._id, selected)}
                                    onStatusUpdate={(status) => handleStatusUpdate(application._id, status)}
                                    onViewDetails={() => handleViewDetails(application)}
                                    onScheduleInterview={() => handleScheduleInterview(application)}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Modals */}
                {showDetailModal && selectedApplication && (
                    <ApplicationDetailModal
                        isOpen={showDetailModal}
                        onClose={() => {
                            setShowDetailModal(false);
                            setSelectedApplication(null);
                        }}
                        application={selectedApplication}
                        onStatusUpdate={handleStatusUpdate}
                    />
                )}

                {showInterviewModal && interviewApplication && (
                    <InterviewScheduleModal
                        isOpen={showInterviewModal}
                        onClose={() => {
                            setShowInterviewModal(false);
                            setInterviewApplication(null);
                        }}
                        application={interviewApplication}
                        onScheduled={() => {
                            setShowInterviewModal(false);
                            setInterviewApplication(null);
                            loadApplications(); // Refresh data
                        }}
                    />
                )}
            </div>
        </EmployerLayout>
    );
};

export default ApplicationManagement;
