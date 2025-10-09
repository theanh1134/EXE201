import React from 'react';
import './RecentActivity.css';

const RecentActivity = ({ activities = [] }) => {
    const formatTimeAgo = (timestamp) => {
        const now = new Date();
        const time = new Date(timestamp);
        const diffInSeconds = Math.floor((now - time) / 1000);
        
        if (diffInSeconds < 60) {
            return 'Vừa xong';
        } else if (diffInSeconds < 3600) {
            const minutes = Math.floor(diffInSeconds / 60);
            return `${minutes} phút trước`;
        } else if (diffInSeconds < 86400) {
            const hours = Math.floor(diffInSeconds / 3600);
            return `${hours} giờ trước`;
        } else {
            const days = Math.floor(diffInSeconds / 86400);
            return `${days} ngày trước`;
        }
    };

    const getActivityColorClass = (color) => {
        const colorMap = {
            green: 'activity-green',
            blue: 'activity-blue',
            orange: 'activity-orange',
            purple: 'activity-purple',
            red: 'activity-red'
        };
        return colorMap[color] || 'activity-blue';
    };

    if (activities.length === 0) {
        return (
            <div className="recent-activity">
                <div className="activity-header">
                    <h3>Hoạt động gần đây</h3>
                    <p>Theo dõi các thay đổi mới nhất</p>
                </div>
                <div className="empty-activity">
                    <div className="empty-icon">📝</div>
                    <div className="empty-text">
                        <h4>Chưa có hoạt động nào</h4>
                        <p>Các hoạt động mới sẽ hiển thị ở đây</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="recent-activity">
            <div className="activity-header">
                <h3>Hoạt động gần đây</h3>
                <p>Theo dõi các thay đổi mới nhất</p>
            </div>

            <div className="activity-list">
                {activities.map(activity => (
                    <div key={activity.id} className={`activity-item ${getActivityColorClass(activity.color)}`}>
                        <div className="activity-icon">
                            {activity.icon}
                        </div>
                        <div className="activity-content">
                            <div className="activity-title">{activity.title}</div>
                            <div className="activity-description">{activity.description}</div>
                            <div className="activity-time">{formatTimeAgo(activity.timestamp)}</div>
                        </div>
                        <div className="activity-indicator"></div>
                    </div>
                ))}
            </div>

            <div className="activity-footer">
                <button 
                    className="view-all-btn"
                    onClick={() => window.location.href = '/company-dashboard/activity'}
                >
                    Xem tất cả hoạt động →
                </button>
            </div>
        </div>
    );
};

export default RecentActivity;
