import React from 'react';
import './OverviewMetrics.css';

const OverviewMetrics = ({ data }) => {
    const metrics = [
        {
            id: 'totalJobs',
            title: 'Tổng số tin',
            value: data.totalJobs,
            icon: '📊',
            color: '#3b82f6',
            change: '+12%',
            changeType: 'positive'
        },
        {
            id: 'activeJobs',
            title: 'Tin đang hoạt động',
            value: data.activeJobs,
            icon: '✅',
            color: '#10b981',
            change: '+5%',
            changeType: 'positive'
        },
        {
            id: 'totalApplications',
            title: 'Tổng ứng tuyển',
            value: data.totalApplications,
            icon: '👥',
            color: '#8b5cf6',
            change: '+23%',
            changeType: 'positive'
        },
        {
            id: 'totalViews',
            title: 'Lượt xem',
            value: data.totalViews,
            icon: '👁️',
            color: '#f59e0b',
            change: '+8%',
            changeType: 'positive'
        },
        {
            id: 'conversionRate',
            title: 'Tỷ lệ chuyển đổi',
            value: `${data.conversionRate}%`,
            icon: '📈',
            color: '#ef4444',
            change: data.conversionRate > 3 ? '+2%' : '-1%',
            changeType: data.conversionRate > 3 ? 'positive' : 'negative'
        },
        {
            id: 'avgTimeToHire',
            title: 'Thời gian tuyển dụng',
            value: `${data.avgTimeToHire} ngày`,
            icon: '⏱️',
            color: '#06b6d4',
            change: '-3 ngày',
            changeType: 'positive'
        }
    ];

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
        <div className="overview-metrics">
            <div className="metrics-grid">
                {metrics.map((metric) => (
                    <div key={metric.id} className="metric-card">
                        <div className="metric-header">
                            <div className="metric-icon" style={{ backgroundColor: metric.color }}>
                                {metric.icon}
                            </div>
                            <div className="metric-change">
                                <span className={`change-value ${metric.changeType}`}>
                                    {metric.change}
                                </span>
                            </div>
                        </div>
                        
                        <div className="metric-content">
                            <h3 className="metric-value">
                                {typeof metric.value === 'number' ? formatNumber(metric.value) : metric.value}
                            </h3>
                            <p className="metric-title">{metric.title}</p>
                        </div>
                        
                        <div className="metric-footer">
                            <div className="metric-trend">
                                <span className={`trend-indicator ${metric.changeType}`}>
                                    {metric.changeType === 'positive' ? '↗️' : '↘️'}
                                </span>
                                <span className="trend-text">
                                    {metric.changeType === 'positive' ? 'Tăng' : 'Giảm'} so với tháng trước
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default OverviewMetrics;
