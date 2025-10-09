import React, { useState, useEffect } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { applicationAPI, applicationStatuses } from '../services/applicationAPI';
import ApplicationDetailModal from './ApplicationDetailModal';
import './ApplicationsList.css';

const ApplicationsList = ({ jobId, jobTitle, onClose }) => {
    const { success, error: showError } = useNotification();

    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedApplication, setSelectedApplication] = useState(null);
    const [showDetailModal, setShowDetailModal] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('all');
    const [stats, setStats] = useState({
        totalApplications: 0,
        statusBreakdown: []
    });

    useEffect(() => {
        loadApplications();
        loadStats();
    }, [jobId, selectedStatus]);

    const loadApplications = async () => {
        try {
            setLoading(true);
            const params = selectedStatus !== 'all' ? { status: selectedStatus } : {};

            console.log('Loading applications for job:', jobId, 'with params:', params);

            const response = await applicationAPI.getJobApplications(jobId, params);
            console.log('Applications response:', response);

            setApplications(response.applications || []);
        } catch (error) {
            console.error('Error loading applications:', error);
            showError('Lỗi khi tải danh sách ứng viên: ' + (error.message || 'Unknown error'), 'Lỗi');
        } finally {
            setLoading(false);
        }
    };

    const loadStats = async () => {
        try {
            const response = await applicationAPI.getJobApplicationStats(jobId);
            setStats(response);
        } catch (error) {
            console.error('Error loading stats:', error);
        }
    };

    const handleStatusChange = async (applicationId, newStatus) => {
        try {
            await applicationAPI.updateApplicationStatus(applicationId, newStatus);
            success('Đã cập nhật trạng thái ứng viên', 'Thành công');
            loadApplications();
            loadStats();
        } catch (error) {
            showError('Lỗi khi cập nhật trạng thái: ' + (error.message || 'Unknown error'), 'Lỗi');
        }
    };

    const handleViewApplication = (application) => {
        setSelectedApplication(application);
        setShowDetailModal(true);
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN');
    };

    const getStatusConfig = (status) => {
        return applicationStatuses.find(s => s.value === status) ||
            { label: status, color: '#64748b' };
    };

    const getStatusCount = (status) => {
        return stats.statusBreakdown.find(s => s._id === status)?.count || 0;
    };

    if (loading) {
        return (
            <div className="applications-list">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải danh sách ứng viên...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="applications-list">
            <div className="applications-header">
                <div className="header-content">
                    <button
                        className="back-btn"
                        onClick={onClose}
                        title="Quay lại danh sách công việc"
                    >
                        ← Quay lại
                    </button>
                    <div className="header-info">
                        <h1>Danh sách ứng viên</h1>
                        <p>{jobTitle}</p>
                    </div>
                </div>
            </div>

            {/* Statistics */}
            <div className="stats-section">
                <div className="stat-card">
                    <div className="stat-number">{stats.totalApplications}</div>
                    <div className="stat-label">Tổng ứng viên</div>
                </div>
                {applicationStatuses.map(status => (
                    <div key={status.value} className="stat-card">
                        <div className="stat-number">{getStatusCount(status.value)}</div>
                        <div className="stat-label">{status.label}</div>
                    </div>
                ))}
            </div>

            {/* Filter Tabs */}
            <div className="filter-tabs">
                <button
                    className={`filter-tab ${selectedStatus === 'all' ? 'active' : ''}`}
                    onClick={() => setSelectedStatus('all')}
                >
                    Tất cả ({stats.totalApplications})
                </button>
                {applicationStatuses.map(status => (
                    <button
                        key={status.value}
                        className={`filter-tab ${selectedStatus === status.value ? 'active' : ''}`}
                        onClick={() => setSelectedStatus(status.value)}
                    >
                        {status.label} ({getStatusCount(status.value)})
                    </button>
                ))}
            </div>

            {/* Applications List */}
            <div className="applications-grid">
                {applications.length === 0 ? (
                    <div className="empty-state">
                        <div className="empty-icon">👥</div>
                        <h3>Chưa có ứng viên nào</h3>
                        <p>Ứng viên sẽ xuất hiện ở đây khi họ nộp đơn ứng tuyển</p>
                    </div>
                ) : (
                    applications.map(application => (
                        <div key={application._id} className="application-card">
                            <div className="applicant-info">
                                <div className="applicant-avatar">
                                    {application.applicant?.fullName?.charAt(0) || 'A'}
                                </div>
                                <div className="applicant-details">
                                    <h3>{application.applicant?.fullName || 'Chưa có tên'}</h3>
                                    <p>{application.applicant?.email}</p>
                                    {application.applicant?.phone && (
                                        <p className="phone">{application.applicant.phone}</p>
                                    )}
                                </div>
                            </div>

                            <div className="application-meta">
                                <div className="applied-date">
                                    Nộp đơn: {formatDate(application.appliedAt)}
                                </div>
                                <div
                                    className="status-badge"
                                    style={{ backgroundColor: getStatusConfig(application.status).color }}
                                >
                                    {getStatusConfig(application.status).label}
                                </div>
                            </div>

                            {application.coverLetter && (
                                <div className="cover-letter-preview">
                                    <strong>Thư xin việc:</strong>
                                    <p>{application.coverLetter.substring(0, 100)}...</p>
                                </div>
                            )}

                            <div className="application-actions">
                                <button
                                    className="btn-primary"
                                    onClick={() => handleViewApplication(application)}
                                >
                                    Xem chi tiết
                                </button>

                                <select
                                    className="status-select"
                                    value={application.status}
                                    onChange={(e) => handleStatusChange(application._id, e.target.value)}
                                >
                                    {applicationStatuses.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    ))
                )}
            </div>

            {/* Application Detail Modal */}
            <ApplicationDetailModal
                isOpen={showDetailModal}
                onClose={() => {
                    setShowDetailModal(false);
                    setSelectedApplication(null);
                }}
                application={selectedApplication}
                onStatusChange={handleStatusChange}
                onRefresh={loadApplications}
            />
        </div>
    );
};

export default ApplicationsList;
