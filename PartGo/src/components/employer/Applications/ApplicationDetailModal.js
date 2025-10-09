import React, { useState } from 'react';
import { applicationStatuses } from '../../../services/applicationAPI';
import './ApplicationDetailModal.css';

const ApplicationDetailModal = ({
    isOpen,
    onClose,
    application,
    onStatusUpdate
}) => {
    const [activeTab, setActiveTab] = useState('overview');
    const [notes, setNotes] = useState('');

    if (!isOpen || !application) return null;

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

    const statusInfo = getStatusInfo(application.status);

    const handleStatusChange = (newStatus) => {
        onStatusUpdate(application._id, newStatus);
    };

    const handleAddNote = () => {
        if (notes.trim()) {
            // TODO: Implement add note functionality
            alert('Tính năng thêm ghi chú sẽ được bổ sung');
            setNotes('');
        }
    };

    if (!isOpen || !application) {
        return null;
    }

    return (
        <div className="application-detail-modal-overlay" onClick={onClose}>
            <div className="application-detail-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="applicant-header">
                        <div className="applicant-avatar">
                            {application.applicant?.avatar ? (
                                <img src={application.applicant.avatar} alt="" />
                            ) : (
                                <span>{application.applicant?.fullName?.charAt(0) || '?'}</span>
                            )}
                        </div>
                        <div className="applicant-info">
                            <h2>{application.applicant?.fullName || 'N/A'}</h2>
                            <p>{application.applicant?.email || 'N/A'}</p>
                            {application.applicant?.phone && (
                                <p className="phone">📞 {application.applicant.phone}</p>
                            )}
                        </div>
                    </div>

                    <div className="header-actions">
                        <div className="status-update">
                            <label>Trạng thái:</label>
                            <select
                                value={application.status}
                                onChange={(e) => handleStatusChange(e.target.value)}
                            >
                                {applicationStatuses.map(status => (
                                    <option key={status.value} value={status.value}>
                                        {status.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button className="close-btn" onClick={onClose}>
                            ✕
                        </button>
                    </div>
                </div>

                {/* Job Info */}
                <div className="job-info-section">
                    <h3>Vị trí ứng tuyển</h3>
                    <div className="job-details">
                        <span className="job-title">{application.jobInfo?.title || 'N/A'}</span>
                        {application.jobInfo?.location && (
                            <span className="job-location">📍 {application.jobInfo.location.city}</span>
                        )}
                        <span className="job-type">{application.jobInfo?.type || 'N/A'}</span>
                    </div>
                </div>

                {/* Tabs */}
                <div className="modal-tabs">
                    <button
                        className={`tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
                        onClick={() => setActiveTab('overview')}
                    >
                        📋 Tổng quan
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'documents' ? 'active' : ''}`}
                        onClick={() => setActiveTab('documents')}
                    >
                        📄 Hồ sơ
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'timeline' ? 'active' : ''}`}
                        onClick={() => setActiveTab('timeline')}
                    >
                        ⏰ Lịch sử
                    </button>
                    <button
                        className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`}
                        onClick={() => setActiveTab('notes')}
                    >
                        📝 Ghi chú
                    </button>
                </div>

                {/* Tab Content */}
                <div className="modal-content">
                    {activeTab === 'overview' && (
                        <div className="overview-tab">
                            <div className="info-grid">
                                <div className="info-item">
                                    <label>Thời gian ứng tuyển:</label>
                                    <span>{formatDate(application.appliedAt)}</span>
                                </div>

                                <div className="info-item">
                                    <label>Trạng thái hiện tại:</label>
                                    <span
                                        className="status-badge"
                                        style={{ backgroundColor: statusInfo.color }}
                                    >
                                        {statusInfo.label}
                                    </span>
                                </div>

                                {application.reviewedAt && (
                                    <div className="info-item">
                                        <label>Thời gian xem xét:</label>
                                        <span>{formatDate(application.reviewedAt)}</span>
                                    </div>
                                )}

                                {application.interviewScheduled && (
                                    <div className="info-item">
                                        <label>Lịch phỏng vấn:</label>
                                        <span>{formatDate(application.interviewScheduled)}</span>
                                    </div>
                                )}
                            </div>

                            {application.coverLetter && (
                                <div className="cover-letter-section">
                                    <h4>Thư xin việc</h4>
                                    <div className="cover-letter-content">
                                        {application.coverLetter}
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'documents' && (
                        <div className="documents-tab">
                            <div className="documents-list">
                                {application.cvUrl ? (
                                    <div className="document-item">
                                        <div className="document-info">
                                            <span className="document-icon">📄</span>
                                            <div className="document-details">
                                                <h4>Curriculum Vitae (CV)</h4>
                                                <p>Hồ sơ xin việc của ứng viên</p>
                                                <small className="text-muted">
                                                    URL: {application.cvUrl}
                                                </small>
                                            </div>
                                        </div>
                                        <div className="document-actions">
                                            <a
                                                href={application.cvUrl.startsWith('http')
                                                    ? application.cvUrl
                                                    : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'}${application.cvUrl}`
                                                }
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="view-document-btn"
                                            >
                                                👁️ Xem
                                            </a>
                                            <a
                                                href={application.cvUrl.startsWith('http')
                                                    ? application.cvUrl
                                                    : `${process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001'}${application.cvUrl}`
                                                }
                                                download
                                                className="download-document-btn"
                                            >
                                                ⬇️ Tải về
                                            </a>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="no-documents">
                                        <span className="no-docs-icon">📄</span>
                                        <p>Ứng viên chưa tải lên CV</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'timeline' && (
                        <div className="timeline-tab">
                            <div className="timeline">
                                <div className="timeline-item">
                                    <div className="timeline-marker"></div>
                                    <div className="timeline-content">
                                        <h4>Ứng tuyển</h4>
                                        <p>{formatDate(application.appliedAt)}</p>
                                        <span>Ứng viên đã gửi đơn ứng tuyển</span>
                                    </div>
                                </div>

                                {application.reviewedAt && (
                                    <div className="timeline-item">
                                        <div className="timeline-marker reviewed"></div>
                                        <div className="timeline-content">
                                            <h4>Đã xem xét</h4>
                                            <p>{formatDate(application.reviewedAt)}</p>
                                            <span>Hồ sơ đã được xem xét</span>
                                        </div>
                                    </div>
                                )}

                                {application.interviewScheduled && (
                                    <div className="timeline-item">
                                        <div className="timeline-marker interview"></div>
                                        <div className="timeline-content">
                                            <h4>Lịch phỏng vấn</h4>
                                            <p>{formatDate(application.interviewScheduled)}</p>
                                            <span>Đã lên lịch phỏng vấn</span>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'notes' && (
                        <div className="notes-tab">
                            <div className="add-note-section">
                                <h4>Thêm ghi chú</h4>
                                <textarea
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    placeholder="Nhập ghi chú về ứng viên..."
                                    rows={4}
                                />
                                <button
                                    className="add-note-btn"
                                    onClick={handleAddNote}
                                    disabled={!notes.trim()}
                                >
                                    ➕ Thêm ghi chú
                                </button>
                            </div>

                            <div className="notes-list">
                                {application.notes && application.notes.length > 0 ? (
                                    application.notes.map((note, index) => (
                                        <div key={index} className="note-item">
                                            <div className="note-header">
                                                <span className="note-author">{note.addedBy}</span>
                                                <span className="note-date">{formatDate(note.addedAt)}</span>
                                            </div>
                                            <div className="note-content">{note.text}</div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="no-notes">
                                        <span className="no-notes-icon">📝</span>
                                        <p>Chưa có ghi chú nào</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="modal-footer">
                    <div className="footer-actions">
                        <button className="action-btn secondary" onClick={onClose}>
                            Đóng
                        </button>
                        <button
                            className="action-btn primary"
                            onClick={() => {
                                // TODO: Implement schedule interview
                                alert('Tính năng lên lịch phỏng vấn sẽ được bổ sung');
                            }}
                        >
                            📅 Lên lịch phỏng vấn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;
