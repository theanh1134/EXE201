import React from 'react';
import './StatsCards.css';

const StatsCards = ({ stats }) => {
    // Generate mock trend data for demo purposes
    const generateTrend = () => Math.floor(Math.random() * 20) - 10; // -10 to +10

    const statsConfig = [
        {
            id: 'totalJobs',
            title: 'Tổng tin đăng',
            value: stats.totalJobs || 0,
            icon: '📊',
            color: 'blue',
            description: 'Tất cả tin tuyển dụng',
            trend: generateTrend(),
            subtitle: 'Tháng này'
        },
        {
            id: 'activeJobs',
            title: 'Tin đang hoạt động',
            value: stats.activeJobs || 0,
            icon: '✅',
            color: 'green',
            description: 'Đang tuyển dụng',
            trend: generateTrend(),
            subtitle: 'Hiện tại'
        },
        {
            id: 'draftJobs',
            title: 'Tin nháp',
            value: stats.draftJobs || 0,
            icon: '📝',
            color: 'orange',
            description: 'Chưa đăng',
            trend: generateTrend(),
            subtitle: 'Cần xử lý'
        },
        {
            id: 'totalApplications',
            title: 'Tổng ứng tuyển',
            value: stats.totalApplications || 0,
            icon: '👥',
            color: 'purple',
            description: 'Hồ sơ nhận được',
            trend: generateTrend(),
            subtitle: 'Tất cả thời gian'
        },
        {
            id: 'pendingApplications',
            title: 'Chờ xử lý',
            value: stats.pendingApplications || 0,
            icon: '⏳',
            color: 'orange',
            description: 'Cần xem xét',
            trend: generateTrend(),
            subtitle: 'Ưu tiên cao'
        },
        {
            id: 'totalViews',
            title: 'Lượt xem',
            value: stats.totalViews || 0,
            icon: '👁️',
            color: 'indigo',
            description: 'Tổng lượt xem tin',
            trend: generateTrend(),
            subtitle: '30 ngày qua'
        },
        {
            id: 'conversionRate',
            title: 'Tỷ lệ chuyển đổi',
            value: `${stats.conversionRate || 0}%`,
            icon: '📈',
            color: 'teal',
            description: 'Ứng tuyển/Lượt xem',
            trend: generateTrend(),
            subtitle: 'Hiệu suất'
        }
    ];

    const getColorClass = (color) => {
        const colorMap = {
            blue: 'stat-blue',
            green: 'stat-green',
            purple: 'stat-purple',
            orange: 'stat-orange',
            indigo: 'stat-indigo',
            teal: 'stat-teal',
            red: 'stat-red'
        };
        return colorMap[color] || 'stat-blue';
    };

    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        }
        if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K';
        }
        return num.toString();
    };

    return (
        <div className="stats-cards">
            {statsConfig.map((stat, index) => (
                <div
                    key={stat.id}
                    className={`stat-card ${getColorClass(stat.color)}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                >
                    <div className="stat-header">
                        <div className="stat-icon">
                            {stat.icon}
                        </div>
                        {stat.trend !== null && (
                            <div className={`stat-trend ${stat.trend > 0 ? 'positive' : stat.trend < 0 ? 'negative' : 'neutral'}`}>
                                {stat.trend > 0 ? '↗️' : stat.trend < 0 ? '↘️' : '➡️'}
                                {Math.abs(stat.trend)}%
                            </div>
                        )}
                    </div>

                    <div className="stat-content">
                        <div className="stat-value">
                            {typeof stat.value === 'number' ? formatNumber(stat.value) : stat.value}
                        </div>
                        <div className="stat-title">{stat.title}</div>
                        <div className="stat-description">{stat.description}</div>
                        {stat.subtitle && (
                            <div className="stat-subtitle">{stat.subtitle}</div>
                        )}
                    </div>

                    <div className="stat-footer">
                        <button
                            className="stat-action"
                            onClick={() => {
                                // Navigate to relevant page based on stat type
                                switch (stat.id) {
                                    case 'totalJobs':
                                    case 'activeJobs':
                                    case 'draftJobs':
                                        window.location.href = '/company-dashboard/jobs';
                                        break;
                                    case 'totalApplications':
                                    case 'pendingApplications':
                                        window.location.href = '/company-dashboard/applications';
                                        break;
                                    case 'totalViews':
                                    case 'conversionRate':
                                        window.location.href = '/company-dashboard/analytics';
                                        break;
                                    default:
                                        break;
                                }
                            }}
                        >
                            <span>Xem chi tiết</span>
                            <span>→</span>
                        </button>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default StatsCards;
