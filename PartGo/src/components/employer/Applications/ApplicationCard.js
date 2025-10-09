import React from 'react';
import { applicationStatuses } from '../../../services/applicationAPI';
import './ApplicationCard.css';

const ApplicationCard = ({
    application,
    selected,
    onSelect,
    onStatusUpdate,
    onViewDetails,
    onScheduleInterview,
    viewMode
}) => {
    const getStatusInfo = (status) => {
        return applicationStatuses.find(s => s.value === status) || {
            label: status,
            color: '#64748b'
        };
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getTimeAgo = (dateString) => {
        const now = new Date();
        const date = new Date(dateString);
        const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));

        if (diffInHours < 1) return 'Vừa xong';
        if (diffInHours < 24) return `${diffInHours} giờ trước`;

        const diffInDays = Math.floor(diffInHours / 24);
        if (diffInDays < 7) return `${diffInDays} ngày trước`;

        const diffInWeeks = Math.floor(diffInDays / 7);
        if (diffInWeeks < 4) return `${diffInWeeks} tuần trước`;

        const diffInMonths = Math.floor(diffInDays / 30);
        return `${diffInMonths} tháng trước`;
    };

    const statusInfo = getStatusInfo(application.status);

    if (viewMode === 'table') {
        return (
            <div className={`application-card table-view ${selected ? 'selected' : ''}`}>
                <div className="table-row">
                    <div className="table-cell checkbox-cell">
                        <input
                            type="checkbox"
                            checked={selected}
                            onChange={(e) => onSelect(e.target.checked)}
                        />
                    </div>

                    <div className="table-cell applicant-cell">
                        <div className="applicant-info">
                            <div className="applicant-avatar">
                                {application.applicant?.avatar ? (
                                    <img src={application.applicant.avatar} alt="" />
                                ) : (
                                    <span>{application.applicant?.fullName?.charAt(0) || '?'}</span>
                                )}
                            </div>
                            <div className="applicant-details">
                                <h4>{application.applicant?.fullName || 'N/A'}</h4>
                                <p>{application.applicant?.email || 'N/A'}</p>
                            </div>
                        </div>
                    </div>

                    <div className="table-cell job-cell">
                        <span className="job-title">{application.jobInfo?.title || 'N/A'}</span>
                    </div>

                    <div className="table-cell status-cell">
                        <span
                            className="status-badge"
                            style={{ backgroundColor: statusInfo.color }}
                        >
                            {statusInfo.label}
                        </span>
                    </div>

                    <div className="table-cell date-cell">
                        <span className="date-text">{formatDate(application.appliedAt)}</span>
                        <span className="time-ago">{getTimeAgo(application.appliedAt)}</span>
                    </div>

                    <div className="table-cell actions-cell">
                        <div className="action-buttons">
                            <button
                                className="action-btn view-btn"
                                onClick={onViewDetails}
                                title="Xem chi tiết"
                            >
                                👁️
                            </button>
                            {application.status === 'shortlisted' && (
                                <button
                                    className="action-btn interview-btn"
                                    onClick={onScheduleInterview}
                                    title="Lên lịch phỏng vấn"
                                >
                                    📅
                                </button>
                            )}
                            <select
                                className="status-select"
                                value={application.status}
                                onChange={(e) => onStatusUpdate(e.target.value)}
                            >
                                {applicationStatuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className={`application-card card-view ${selected ? 'selected' : ''}`}>
            <div className="card-header">
                <div className="card-checkbox">
                    <input
                        type="checkbox"
                        checked={selected}
                        onChange={(e) => onSelect(e.target.checked)}
                    />
                </div>
                <div className="applicant-info">
                    <div className="applicant-avatar">
                        {application.applicant?.avatar ? (
                            <img src={application.applicant.avatar} alt="" />
                        ) : (
                            <span>{application.applicant?.fullName?.charAt(0) || '?'}</span>
                        )}
                    </div>
                    <div className="applicant-details">
                        <h4>{application.applicant?.fullName || 'N/A'}</h4>
                        <p>{application.applicant?.email || 'N/A'}</p>
                        {application.applicant?.phone && (
                            <p className="phone">📞 {application.applicant.phone}</p>
                        )}
                    </div>
                </div>
                <div className="card-status">
                    <span
                        className="status-badge"
                        style={{ backgroundColor: statusInfo.color }}
                    >
                        {statusInfo.label}
                    </span>
                </div>
            </div>

            <div className="card-body">
                <div className="job-info">
                    <h5>Vị trí ứng tuyển</h5>
                    <p className="job-title">{application.jobInfo?.title || 'N/A'}</p>
                    {application.jobInfo?.location && (
                        <p className="job-location">📍 {application.jobInfo.location.city}</p>
                    )}
                </div>

                <div className="application-meta">
                    <div className="meta-item">
                        <span className="meta-label">Thời gian ứng tuyển:</span>
                        <span className="meta-value">{formatDate(application.appliedAt)}</span>
                        <span className="time-ago">({getTimeAgo(application.appliedAt)})</span>
                    </div>

                    {application.coverLetter && (
                        <div className="meta-item">
                            <span className="meta-label">Thư xin việc:</span>
                            <p className="cover-letter-preview">
                                {application.coverLetter.length > 100
                                    ? `${application.coverLetter.substring(0, 100)}...`
                                    : application.coverLetter
                                }
                            </p>
                        </div>
                    )}

                    {application.cvUrl && (
                        <div className="meta-item">
                            <span className="meta-label">CV:</span>
                            <a
                                href={application.cvUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="cv-link"
                            >
                                📄 Xem CV
                            </a>
                        </div>
                    )}
                </div>
            </div>

            <div className="card-footer">
                <div className="status-update">
                    <label>Cập nhật trạng thái:</label>
                    <select
                        value={application.status}
                        onChange={(e) => onStatusUpdate(e.target.value)}
                    >
                        {applicationStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                <div className="card-actions">
                    <button
                        className="action-btn primary icon-only"
                        onClick={onViewDetails}
                        title="Xem chi tiết"
                    >
                        👁️
                    </button>
                    {application.status === 'shortlisted' && (
                        <button
                            className="action-btn secondary icon-only"
                            onClick={onScheduleInterview}
                            title="Lên lịch phỏng vấn"
                        >
                            📅
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ApplicationCard;
