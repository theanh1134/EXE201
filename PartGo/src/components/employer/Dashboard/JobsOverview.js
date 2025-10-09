import React from 'react';
import { jobOptions } from '../../../services/jobAPI';
import './JobsOverview.css';

const JobsOverview = ({ jobs = [] }) => {
    const formatSalary = (salary) => {
        if (!salary || !salary.isPublic) return 'Thỏa thuận';
        const min = salary.min?.toLocaleString('vi-VN') || '0';
        const max = salary.max?.toLocaleString('vi-VN') || '0';
        return `${min} - ${max} ${salary.currency || 'VND'}`;
    };

    const getStatusBadge = (status) => {
        const statusConfig = jobOptions?.statuses?.find(s => s.value === status) || { label: status, color: 'gray' };
        return (
            <span className={`status-badge status-${statusConfig.color}`}>
                {statusConfig.label}
            </span>
        );
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    const handleJobClick = (jobId) => {
        window.location.href = `/company-dashboard/jobs/${jobId}`;
    };

    const handleViewAllJobs = () => {
        window.location.href = '/company-dashboard/jobs';
    };

    if (jobs.length === 0) {
        return (
            <div className="jobs-overview">
                <div className="overview-header">
                    <h3>Tin tuyển dụng gần đây</h3>
                    <p>Quản lý và theo dõi tin đăng</p>
                </div>
                <div className="empty-jobs">
                    <div className="empty-icon">💼</div>
                    <div className="empty-text">
                        <h4>Chưa có tin tuyển dụng nào</h4>
                        <p>Tạo tin tuyển dụng đầu tiên để bắt đầu</p>
                    </div>
                    <button 
                        className="create-job-btn"
                        onClick={() => window.location.href = '/company-dashboard/jobs/create'}
                    >
                        ➕ Tạo tin tuyển dụng
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="jobs-overview">
            <div className="overview-header">
                <div className="header-content">
                    <h3>Tin tuyển dụng gần đây</h3>
                    <p>Quản lý và theo dõi tin đăng ({jobs.length} tin)</p>
                </div>
                <button className="view-all-btn" onClick={handleViewAllJobs}>
                    Xem tất cả →
                </button>
            </div>

            <div className="jobs-table">
                <div className="table-header">
                    <div className="col-title">Tiêu đề</div>
                    <div className="col-status">Trạng thái</div>
                    <div className="col-stats">Thống kê</div>
                    <div className="col-salary">Lương</div>
                    <div className="col-date">Ngày tạo</div>
                    <div className="col-actions">Thao tác</div>
                </div>

                <div className="table-body">
                    {jobs.map(job => (
                        <div key={job._id} className="job-row" onClick={() => handleJobClick(job._id)}>
                            <div className="col-title">
                                <div className="job-title-info">
                                    <div className="job-title">{job.title}</div>
                                    <div className="job-meta">
                                        <span className="job-type">
                                            {jobOptions?.types?.find(t => t.value === job.type)?.label || job.type}
                                        </span>
                                        <span className="job-location">{job.location?.city}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-status">
                                {getStatusBadge(job.status)}
                            </div>

                            <div className="col-stats">
                                <div className="stats-group">
                                    <div className="stat-item">
                                        <span className="stat-number">{job.views || 0}</span>
                                        <span className="stat-label">views</span>
                                    </div>
                                    <div className="stat-item">
                                        <span className="stat-number">{job.applied || 0}</span>
                                        <span className="stat-label">applies</span>
                                    </div>
                                </div>
                            </div>

                            <div className="col-salary">
                                <div className="salary-info">
                                    {formatSalary(job.salary)}
                                </div>
                            </div>

                            <div className="col-date">
                                <div className="date-info">
                                    {formatDate(job.createdAt)}
                                </div>
                            </div>

                            <div className="col-actions">
                                <button 
                                    className="action-btn edit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `/company-dashboard/jobs/${job._id}/edit`;
                                    }}
                                    title="Chỉnh sửa"
                                >
                                    ✏️
                                </button>
                                <button 
                                    className="action-btn applications"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        window.location.href = `/company-dashboard/applications?job=${job._id}`;
                                    }}
                                    title="Xem ứng viên"
                                >
                                    👥
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default JobsOverview;
