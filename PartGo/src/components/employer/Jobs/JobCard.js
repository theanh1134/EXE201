import React from 'react';
import './JobCard.css';

const JobCard = ({ job, selected, onSelect, onEdit, onDelete, onPublish, onClone, viewMode = 'grid' }) => {
    const getStatusBadge = (status) => {
        const statusConfig = {
            published: { label: 'Đã đăng', class: 'badge-success', icon: '✓' },
            draft: { label: 'Nháp', class: 'badge-pending', icon: '📝' },
            closed: { label: 'Đã đóng', class: 'badge-error', icon: '🔒' },
            paused: { label: 'Tạm dừng', class: 'badge-warning', icon: '⏸' },
            expired: { label: 'Hết hạn', class: 'badge-pending', icon: '⏰' }
        };
        
        const config = statusConfig[status] || statusConfig.draft;
        return (
            <span className={`badge-employer ${config.class}`}>
                <span>{config.icon}</span>
                {config.label}
            </span>
        );
    };

    const getTypeBadge = (type) => {
        const typeLabels = {
            'full-time': 'Toàn thời gian',
            'part-time': 'Bán thời gian',
            'freelance': 'Freelance',
            'remote': 'Remote',
            'contract': 'Hợp đồng',
            'internship': 'Thực tập'
        };
        return typeLabels[type] || type;
    };

    const getLevelBadge = (level) => {
        const levelLabels = {
            'intern': 'Thực tập sinh',
            'fresher': 'Fresher',
            'junior': 'Junior',
            'middle': 'Middle',
            'senior': 'Senior',
            'lead': 'Lead',
            'manager': 'Manager'
        };
        return levelLabels[level] || level;
    };

    const formatSalary = (salary) => {
        if (!salary) return 'Thỏa thuận';
        if (salary.type === 'negotiable') return 'Thỏa thuận';
        
        const formatNumber = (num) => {
            if (num >= 1000000) {
                return `${(num / 1000000).toFixed(1)}M`;
            }
            if (num >= 1000) {
                return `${(num / 1000).toFixed(0)}K`;
            }
            return num;
        };

        return `${formatNumber(salary.min)} - ${formatNumber(salary.max)} ${salary.currency}`;
    };

    const formatDate = (date) => {
        if (!date) return '';
        const d = new Date(date);
        return d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' });
    };

    const handleCheckboxClick = (e) => {
        e.stopPropagation();
        onSelect(!selected);
    };

    return (
        <div className={`job-card-employer ${selected ? 'selected' : ''} ${viewMode}`}>
            {/* Checkbox */}
            <div className="job-card-checkbox">
                <input
                    type="checkbox"
                    checked={selected}
                    onChange={handleCheckboxClick}
                    onClick={(e) => e.stopPropagation()}
                />
            </div>

            {/* Header */}
            <div className="job-card-header">
                <div className="job-card-title-section">
                    <h3 className="job-card-title">{job.title}</h3>
                    <div className="job-card-badges">
                        {getStatusBadge(job.status)}
                        {job.isUrgent && <span className="badge-employer badge-warning">🔥 Gấp</span>}
                        {job.isHot && <span className="badge-employer badge-error">⭐ Hot</span>}
                    </div>
                </div>
            </div>

            {/* Meta Info */}
            <div className="job-card-meta">
                <div className="job-card-meta-item">
                    <span className="meta-icon">📍</span>
                    <span>{job.location?.city || 'Chưa xác định'}</span>
                </div>
                <div className="job-card-meta-item">
                    <span className="meta-icon">💼</span>
                    <span>{getTypeBadge(job.type)}</span>
                </div>
                <div className="job-card-meta-item">
                    <span className="meta-icon">📊</span>
                    <span>{getLevelBadge(job.level)}</span>
                </div>
                <div className="job-card-meta-item">
                    <span className="meta-icon">💰</span>
                    <span>{formatSalary(job.salary)}</span>
                </div>
            </div>

            {/* Stats */}
            <div className="job-card-stats">
                <div className="job-stat-item">
                    <div className="job-stat-value">{job.views || 0}</div>
                    <div className="job-stat-label">Lượt xem</div>
                </div>
                <div className="job-stat-item">
                    <div className="job-stat-value">{job.applied || 0}</div>
                    <div className="job-stat-label">Ứng tuyển</div>
                </div>
                <div className="job-stat-item">
                    <div className="job-stat-value">{job.capacity || 0}</div>
                    <div className="job-stat-label">Cần tuyển</div>
                </div>
            </div>

            {/* Dates */}
            <div className="job-card-dates">
                <div className="job-date-item">
                    <span className="date-label">Tạo:</span>
                    <span className="date-value">{formatDate(job.createdAt)}</span>
                </div>
                {job.deadline && (
                    <div className="job-date-item">
                        <span className="date-label">Hạn:</span>
                        <span className="date-value">{formatDate(job.deadline)}</span>
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="job-card-actions">
                <button
                    className="btn-employer btn-employer-sm btn-employer-primary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onEdit(job);
                    }}
                >
                    ✏️ Sửa
                </button>
                
                {job.status === 'draft' && (
                    <button
                        className="btn-employer btn-employer-sm btn-employer-success"
                        onClick={(e) => {
                            e.stopPropagation();
                            onPublish(job._id);
                        }}
                    >
                        📤 Đăng
                    </button>
                )}
                
                <button
                    className="btn-employer btn-employer-sm btn-employer-secondary"
                    onClick={(e) => {
                        e.stopPropagation();
                        onClone(job._id);
                    }}
                >
                    📋 Sao chép
                </button>
                
                <button
                    className="btn-employer btn-employer-sm btn-employer-danger"
                    onClick={(e) => {
                        e.stopPropagation();
                        onDelete(job._id);
                    }}
                >
                    🗑️ Xóa
                </button>
            </div>
        </div>
    );
};

export default JobCard;

