import React, { useState, useEffect } from 'react';

const CompanySettings = ({ data, onSave, loading }) => {
    const [formData, setFormData] = useState({
        visibility: 'public',
        allowApplications: true,
        autoReply: true,
        notifications: {
            newApplications: true,
            applicationUpdates: true,
            systemUpdates: false
        }
    });

    useEffect(() => {
        if (data) {
            setFormData({
                visibility: data.visibility || 'public',
                allowApplications: data.allowApplications !== false,
                autoReply: data.autoReply !== false,
                notifications: {
                    newApplications: data.notifications?.newApplications !== false,
                    applicationUpdates: data.notifications?.applicationUpdates !== false,
                    systemUpdates: data.notifications?.systemUpdates === true
                }
            });
        }
    }, [data]);

    const handleInputChange = (field, value) => {
        if (field.startsWith('notifications.')) {
            const notificationKey = field.split('.')[1];
            setFormData(prev => ({
                ...prev,
                notifications: {
                    ...prev.notifications,
                    [notificationKey]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="company-settings">
            <div className="section-header">
                <h2>Cài đặt</h2>
                <p>Quản lý cài đặt hiển thị và thông báo</p>
            </div>

            <form onSubmit={handleSubmit} className="settings-form">
                {/* Privacy Settings */}
                <div className="form-section">
                    <h3>Cài đặt hiển thị</h3>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Hiển thị công ty</h4>
                            <p>Cho phép ứng viên tìm thấy công ty của bạn</p>
                        </div>
                        <div className="setting-control">
                            <select
                                value={formData.visibility}
                                onChange={(e) => handleInputChange('visibility', e.target.value)}
                            >
                                <option value="public">Công khai</option>
                                <option value="private">Riêng tư</option>
                                <option value="limited">Hạn chế</option>
                            </select>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Cho phép ứng tuyển</h4>
                            <p>Ứng viên có thể gửi đơn ứng tuyển</p>
                        </div>
                        <div className="setting-control">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.allowApplications}
                                    onChange={(e) => handleInputChange('allowApplications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Tự động trả lời</h4>
                            <p>Gửi email xác nhận khi nhận được đơn ứng tuyển</p>
                        </div>
                        <div className="setting-control">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.autoReply}
                                    onChange={(e) => handleInputChange('autoReply', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Notification Settings */}
                <div className="form-section">
                    <h3>Cài đặt thông báo</h3>
                    
                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Đơn ứng tuyển mới</h4>
                            <p>Nhận thông báo khi có đơn ứng tuyển mới</p>
                        </div>
                        <div className="setting-control">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.newApplications}
                                    onChange={(e) => handleInputChange('notifications.newApplications', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Cập nhật đơn ứng tuyển</h4>
                            <p>Nhận thông báo khi có thay đổi trạng thái đơn</p>
                        </div>
                        <div className="setting-control">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.applicationUpdates}
                                    onChange={(e) => handleInputChange('notifications.applicationUpdates', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>

                    <div className="setting-item">
                        <div className="setting-info">
                            <h4>Cập nhật hệ thống</h4>
                            <p>Nhận thông báo về tính năng mới và bảo trì</p>
                        </div>
                        <div className="setting-control">
                            <label className="toggle-switch">
                                <input
                                    type="checkbox"
                                    checked={formData.notifications.systemUpdates}
                                    onChange={(e) => handleInputChange('notifications.systemUpdates', e.target.checked)}
                                />
                                <span className="toggle-slider"></span>
                            </label>
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="save-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner small"></span>
                                Đang lưu...
                            </>
                        ) : (
                            '⚙️ Lưu cài đặt'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanySettings;
