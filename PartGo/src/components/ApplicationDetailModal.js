import React, { useState } from 'react';
import { useNotification } from '../contexts/NotificationContext';
import { applicationAPI, applicationStatuses } from '../services/applicationAPI';
import './ApplicationDetailModal.css';

const ApplicationDetailModal = ({
    isOpen,
    onClose,
    application,
    onStatusChange,
    onRefresh
}) => {
    const { success, error: showError } = useNotification();
    const [newNote, setNewNote] = useState('');

    if (!isOpen || !application) return null;

    const handleAddNote = async () => {
        if (!newNote.trim()) return;

        try {
            await applicationAPI.addNoteToApplication(application._id, newNote);
            success('Đã thêm ghi chú', 'Thành công');
            setNewNote('');
            onRefresh();
        } catch (error) {
            showError('Lỗi khi thêm ghi chú: ' + (error.message || 'Unknown error'), 'Lỗi');
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getStatusConfig = (status) => {
        return applicationStatuses.find(s => s.value === status) ||
            { label: status, color: '#64748b' };
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                <div className="modal-header">
                    <div className="applicant-header">
                        <div className="applicant-avatar">
                            {application.applicant?.fullName?.charAt(0) || 'A'}
                        </div>
                        <div className="applicant-info">
                            <h2>{application.applicant?.fullName || 'Chưa có tên'}</h2>
                            <p>{application.applicant?.email}</p>
                            <div
                                className="status-badge"
                                style={{ backgroundColor: getStatusConfig(application.status).color }}
                            >
                                {getStatusConfig(application.status).label}
                            </div>
                        </div>
                    </div>

                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="tabs">
                        <div className="tab active">Thông tin ứng viên</div>
                    </div>

                    <div className="tab-content">
                        <div className="info-grid">
                            <div className="info-section">
                                <h3>Thông tin cá nhân</h3>
                                <div className="info-item">
                                    <label>Họ tên:</label>
                                    <span>{application.applicant?.fullName || 'Chưa cung cấp'}</span>
                                </div>
                                <div className="info-item">
                                    <label>Email:</label>
                                    <span>{application.applicant?.email}</span>
                                </div>
                                <div className="info-item">
                                    <label>Số điện thoại:</label>
                                    <span>{application.applicant?.phone || 'Chưa cung cấp'}</span>
                                </div>
                            </div>

                            <div className="info-section">
                                <h3>Thông tin ứng tuyển</h3>
                                <div className="info-item">
                                    <label>Ngày nộp đơn:</label>
                                    <span>{formatDate(application.appliedAt)}</span>
                                </div>
                                <div className="info-item">
                                    <label>Trạng thái:</label>
                                    <span>{getStatusConfig(application.status).label}</span>
                                </div>
                                <div className="info-item">
                                    <label>Công việc:</label>
                                    <span>{application.job?.title}</span>
                                </div>
                            </div>
                        </div>

                        {application.coverLetter && (
                            <div className="cover-letter-section">
                                <h3>Thư xin việc</h3>
                                <div className="cover-letter-content">
                                    {application.coverLetter}
                                </div>
                            </div>
                        )}

                        {application.cvUrl && (
                            <div className="cv-section">
                                <h3>CV/Resume</h3>
                                <div className="cv-actions">
                                    <a
                                        href={application.cvUrl}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn-primary"
                                    >
                                        📄 Xem CV
                                    </a>
                                    <a
                                        href={application.cvUrl}
                                        download
                                        className="btn-secondary"
                                    >
                                        💾 Tải xuống
                                    </a>
                                </div>
                            </div>
                        )}

                        <div className="status-update-section">
                            <h3>Cập nhật trạng thái</h3>
                            <div className="status-controls">
                                <select
                                    className="status-select"
                                    value={application.status}
                                    onChange={(e) => onStatusChange(application._id, e.target.value)}
                                >
                                    {applicationStatuses.map(status => (
                                        <option key={status.value} value={status.value}>
                                            {status.label}
                                        </option>
                                    ))}
                                </select>
                                <span className="status-description">
                                    {getStatusConfig(application.status).description}
                                </span>
                            </div>
                        </div>

                        <div className="notes-section">
                            <h3>Ghi chú</h3>
                            <div className="add-note">
                                <textarea
                                    value={newNote}
                                    onChange={(e) => setNewNote(e.target.value)}
                                    placeholder="Thêm ghi chú về ứng viên này..."
                                    rows="3"
                                />
                                <button
                                    className="btn-primary"
                                    onClick={handleAddNote}
                                    disabled={!newNote.trim()}
                                >
                                    Thêm ghi chú
                                </button>
                            </div>

                            {application.notes && application.notes.length > 0 && (
                                <div className="notes-list">
                                    <h4>Ghi chú trước đó ({application.notes.length})</h4>
                                    {application.notes.map((note, index) => (
                                        <div key={index} className="note-item">
                                            <div className="note-header">
                                                <span className="note-author">
                                                    {note.addedBy === 'employer' ? 'Nhà tuyển dụng' : 'Ứng viên'}
                                                </span>
                                                <span className="note-date">
                                                    {formatDate(note.addedAt)}
                                                </span>
                                            </div>
                                            <div className="note-content">{note.text}</div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ApplicationDetailModal;


