import React, { useState } from 'react';
import { useNotification } from '../../../contexts/NotificationContext';
import './InterviewScheduleModal.css';

const InterviewScheduleModal = ({ 
    isOpen, 
    onClose, 
    application, 
    onScheduled 
}) => {
    const { success, error: showError } = useNotification();
    
    const [formData, setFormData] = useState({
        date: '',
        time: '',
        duration: '60',
        type: 'online',
        location: '',
        meetingLink: '',
        notes: '',
        interviewers: [''],
        agenda: ['Giới thiệu bản thân', 'Kinh nghiệm làm việc', 'Kỹ năng chuyên môn', 'Câu hỏi từ ứng viên']
    });
    
    const [errors, setErrors] = useState({});

    if (!isOpen || !application) return null;

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value
        }));
        
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const handleInterviewerChange = (index, value) => {
        const newInterviewers = [...formData.interviewers];
        newInterviewers[index] = value;
        setFormData(prev => ({
            ...prev,
            interviewers: newInterviewers
        }));
    };

    const addInterviewer = () => {
        setFormData(prev => ({
            ...prev,
            interviewers: [...prev.interviewers, '']
        }));
    };

    const removeInterviewer = (index) => {
        if (formData.interviewers.length > 1) {
            const newInterviewers = formData.interviewers.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                interviewers: newInterviewers
            }));
        }
    };

    const handleAgendaChange = (index, value) => {
        const newAgenda = [...formData.agenda];
        newAgenda[index] = value;
        setFormData(prev => ({
            ...prev,
            agenda: newAgenda
        }));
    };

    const addAgendaItem = () => {
        setFormData(prev => ({
            ...prev,
            agenda: [...prev.agenda, '']
        }));
    };

    const removeAgendaItem = (index) => {
        if (formData.agenda.length > 1) {
            const newAgenda = formData.agenda.filter((_, i) => i !== index);
            setFormData(prev => ({
                ...prev,
                agenda: newAgenda
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};
        
        if (!formData.date) {
            newErrors.date = 'Vui lòng chọn ngày phỏng vấn';
        }
        
        if (!formData.time) {
            newErrors.time = 'Vui lòng chọn giờ phỏng vấn';
        }
        
        if (formData.type === 'online' && !formData.meetingLink) {
            newErrors.meetingLink = 'Vui lòng nhập link cuộc họp';
        }
        
        if (formData.type === 'offline' && !formData.location) {
            newErrors.location = 'Vui lòng nhập địa điểm phỏng vấn';
        }
        
        if (formData.interviewers.some(interviewer => !interviewer.trim())) {
            newErrors.interviewers = 'Vui lòng nhập tên tất cả người phỏng vấn';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        try {
            // TODO: Implement API call to schedule interview
            console.log('Scheduling interview:', {
                applicationId: application._id,
                ...formData
            });
            
            success('Đã lên lịch phỏng vấn thành công!');
            onScheduled();
        } catch (error) {
            showError('Lỗi khi lên lịch phỏng vấn: ' + (error.message || 'Unknown error'));
        }
    };

    const getMinDate = () => {
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        return tomorrow.toISOString().split('T')[0];
    };

    const getMinTime = () => {
        const selectedDate = new Date(formData.date);
        const today = new Date();
        
        if (selectedDate.toDateString() === today.toDateString()) {
            const currentHour = today.getHours();
            const currentMinute = today.getMinutes();
            return `${String(currentHour + 1).padStart(2, '0')}:${String(Math.ceil(currentMinute / 30) * 30).padStart(2, '0')}`;
        }
        
        return '08:00';
    };

    return (
        <div className="interview-schedule-modal-overlay" onClick={onClose}>
            <div className="interview-schedule-modal" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="modal-header">
                    <div className="header-content">
                        <h2>Lên lịch phỏng vấn</h2>
                        <p>Ứng viên: <strong>{application.applicant?.fullName}</strong></p>
                        <p>Vị trí: <strong>{application.jobInfo?.title}</strong></p>
                    </div>
                    <button className="close-btn" onClick={onClose}>✕</button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="interview-form">
                    <div className="form-content">
                        {/* Basic Info */}
                        <div className="form-section">
                            <h3>Thông tin cơ bản</h3>
                            <div className="form-grid">
                                <div className="form-group">
                                    <label>Ngày phỏng vấn *</label>
                                    <input
                                        type="date"
                                        value={formData.date}
                                        onChange={(e) => handleInputChange('date', e.target.value)}
                                        min={getMinDate()}
                                        className={errors.date ? 'error' : ''}
                                    />
                                    {errors.date && <span className="error-text">{errors.date}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Giờ phỏng vấn *</label>
                                    <input
                                        type="time"
                                        value={formData.time}
                                        onChange={(e) => handleInputChange('time', e.target.value)}
                                        min={getMinTime()}
                                        className={errors.time ? 'error' : ''}
                                    />
                                    {errors.time && <span className="error-text">{errors.time}</span>}
                                </div>

                                <div className="form-group">
                                    <label>Thời lượng (phút)</label>
                                    <select
                                        value={formData.duration}
                                        onChange={(e) => handleInputChange('duration', e.target.value)}
                                    >
                                        <option value="30">30 phút</option>
                                        <option value="45">45 phút</option>
                                        <option value="60">60 phút</option>
                                        <option value="90">90 phút</option>
                                        <option value="120">120 phút</option>
                                    </select>
                                </div>

                                <div className="form-group">
                                    <label>Hình thức phỏng vấn</label>
                                    <select
                                        value={formData.type}
                                        onChange={(e) => handleInputChange('type', e.target.value)}
                                    >
                                        <option value="online">Trực tuyến</option>
                                        <option value="offline">Trực tiếp</option>
                                        <option value="phone">Điện thoại</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        {/* Location/Meeting Info */}
                        <div className="form-section">
                            <h3>
                                {formData.type === 'online' ? 'Thông tin cuộc họp' : 
                                 formData.type === 'offline' ? 'Địa điểm phỏng vấn' : 
                                 'Thông tin liên hệ'}
                            </h3>
                            
                            {formData.type === 'online' && (
                                <div className="form-group">
                                    <label>Link cuộc họp *</label>
                                    <input
                                        type="url"
                                        value={formData.meetingLink}
                                        onChange={(e) => handleInputChange('meetingLink', e.target.value)}
                                        placeholder="https://meet.google.com/xxx-xxxx-xxx"
                                        className={errors.meetingLink ? 'error' : ''}
                                    />
                                    {errors.meetingLink && <span className="error-text">{errors.meetingLink}</span>}
                                </div>
                            )}
                            
                            {formData.type === 'offline' && (
                                <div className="form-group">
                                    <label>Địa chỉ phỏng vấn *</label>
                                    <textarea
                                        value={formData.location}
                                        onChange={(e) => handleInputChange('location', e.target.value)}
                                        placeholder="Nhập địa chỉ chi tiết..."
                                        rows={3}
                                        className={errors.location ? 'error' : ''}
                                    />
                                    {errors.location && <span className="error-text">{errors.location}</span>}
                                </div>
                            )}
                        </div>

                        {/* Interviewers */}
                        <div className="form-section">
                            <h3>Người phỏng vấn</h3>
                            <div className="interviewers-list">
                                {formData.interviewers.map((interviewer, index) => (
                                    <div key={index} className="interviewer-item">
                                        <input
                                            type="text"
                                            value={interviewer}
                                            onChange={(e) => handleInterviewerChange(index, e.target.value)}
                                            placeholder="Tên người phỏng vấn"
                                            className={errors.interviewers ? 'error' : ''}
                                        />
                                        {formData.interviewers.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeInterviewer(index)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={addInterviewer}
                                >
                                    ➕ Thêm người phỏng vấn
                                </button>
                                {errors.interviewers && <span className="error-text">{errors.interviewers}</span>}
                            </div>
                        </div>

                        {/* Agenda */}
                        <div className="form-section">
                            <h3>Nội dung phỏng vấn</h3>
                            <div className="agenda-list">
                                {formData.agenda.map((item, index) => (
                                    <div key={index} className="agenda-item">
                                        <span className="agenda-number">{index + 1}.</span>
                                        <input
                                            type="text"
                                            value={item}
                                            onChange={(e) => handleAgendaChange(index, e.target.value)}
                                            placeholder="Nội dung phỏng vấn"
                                        />
                                        {formData.agenda.length > 1 && (
                                            <button
                                                type="button"
                                                className="remove-btn"
                                                onClick={() => removeAgendaItem(index)}
                                            >
                                                ✕
                                            </button>
                                        )}
                                    </div>
                                ))}
                                <button
                                    type="button"
                                    className="add-btn"
                                    onClick={addAgendaItem}
                                >
                                    ➕ Thêm nội dung
                                </button>
                            </div>
                        </div>

                        {/* Notes */}
                        <div className="form-section">
                            <h3>Ghi chú</h3>
                            <div className="form-group">
                                <textarea
                                    value={formData.notes}
                                    onChange={(e) => handleInputChange('notes', e.target.value)}
                                    placeholder="Ghi chú thêm cho buổi phỏng vấn..."
                                    rows={4}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Footer */}
                    <div className="modal-footer">
                        <button type="button" className="btn-secondary" onClick={onClose}>
                            Hủy
                        </button>
                        <button type="submit" className="btn-primary">
                            📅 Lên lịch phỏng vấn
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default InterviewScheduleModal;
