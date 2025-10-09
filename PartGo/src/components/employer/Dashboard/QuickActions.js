import React from 'react';
import './QuickActions.css';

const QuickActions = () => {
    const actions = [
        {
            id: 'create-job',
            title: 'Đăng tin tuyển dụng',
            description: 'Tạo tin tuyển dụng mới',
            icon: '➕',
            color: 'blue',
            path: '/company-dashboard/jobs/create',
            primary: true
        },
        {
            id: 'view-applications',
            title: 'Xem ứng viên',
            description: 'Quản lý hồ sơ ứng tuyển',
            icon: '👥',
            color: 'green',
            path: '/company-dashboard/applications'
        },
        {
            id: 'manage-jobs',
            title: 'Quản lý tin đăng',
            description: 'Chỉnh sửa tin hiện có',
            icon: '📝',
            color: 'purple',
            path: '/company-dashboard/jobs'
        },
        {
            id: 'view-analytics',
            title: 'Xem báo cáo',
            description: 'Phân tích hiệu quả',
            icon: '📊',
            color: 'orange',
            path: '/company-dashboard/analytics'
        },
        {
            id: 'company-profile',
            title: 'Hồ sơ công ty',
            description: 'Cập nhật thông tin',
            icon: '🏢',
            color: 'indigo',
            path: '/company-dashboard/company'
        },
        {
            id: 'job-templates',
            title: 'Mẫu tin tuyển dụng',
            description: 'Sử dụng mẫu có sẵn',
            icon: '📋',
            color: 'teal',
            path: '/company-dashboard/templates'
        }
    ];

    const handleActionClick = (path) => {
        window.location.href = path;
    };

    const getColorClass = (color) => {
        const colorMap = {
            blue: 'action-blue',
            green: 'action-green',
            purple: 'action-purple',
            orange: 'action-orange',
            indigo: 'action-indigo',
            teal: 'action-teal'
        };
        return colorMap[color] || 'action-blue';
    };

    return (
        <div className="quick-actions">
            <div className="quick-actions-header">
                <h3>Thao tác nhanh</h3>
                <p>Các tác vụ thường dùng</p>
            </div>

            <div className="actions-grid">
                {actions.map(action => (
                    <button
                        key={action.id}
                        className={`action-card ${getColorClass(action.color)} ${action.primary ? 'primary' : ''}`}
                        onClick={() => handleActionClick(action.path)}
                    >
                        <div className="action-icon">
                            {action.icon}
                        </div>
                        <div className="action-content">
                            <div className="action-title">{action.title}</div>
                            <div className="action-description">{action.description}</div>
                        </div>
                        <div className="action-arrow">
                            →
                        </div>
                    </button>
                ))}
            </div>

            <div className="quick-actions-footer">
                <div className="help-section">
                    <div className="help-icon">💡</div>
                    <div className="help-content">
                        <div className="help-title">Cần hỗ trợ?</div>
                        <div className="help-description">
                            Xem hướng dẫn sử dụng hoặc liên hệ support
                        </div>
                    </div>
                    <button className="help-button">
                        Trợ giúp
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuickActions;
