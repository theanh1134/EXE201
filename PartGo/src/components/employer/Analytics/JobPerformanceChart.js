import React from 'react';
import './JobPerformanceChart.css';

const JobPerformanceChart = ({ data, selectedMetric, onMetricChange }) => {
    const metrics = [
        { id: 'applications', label: 'Số ứng tuyển', color: '#3b82f6' },
        { id: 'views', label: 'Lượt xem', color: '#10b981' },
        { id: 'conversionRate', label: 'Tỷ lệ chuyển đổi (%)', color: '#f59e0b' }
    ];

    const sortedData = [...data].sort((a, b) => {
        if (selectedMetric === 'conversionRate') {
            return parseFloat(b[selectedMetric]) - parseFloat(a[selectedMetric]);
        }
        return b[selectedMetric] - a[selectedMetric];
    });

    const maxValue = Math.max(...sortedData.map(item => {
        if (selectedMetric === 'conversionRate') {
            return parseFloat(item[selectedMetric]);
        }
        return item[selectedMetric];
    }));

    const calculateWidth = (value) => {
        if (maxValue === 0) return 0;
        const numValue = selectedMetric === 'conversionRate' ? parseFloat(value) : value;
        return Math.max((numValue / maxValue) * 100, 2);
    };

    const formatValue = (value) => {
        if (selectedMetric === 'conversionRate') {
            return `${value}%`;
        }
        if (value >= 1000) {
            return `${(value / 1000).toFixed(1)}K`;
        }
        return value.toString();
    };

    const getMetricColor = () => {
        return metrics.find(m => m.id === selectedMetric)?.color || '#3b82f6';
    };

    if (!data || data.length === 0) {
        return (
            <div className="job-performance-chart">
                <div className="chart-header">
                    <h3>Hiệu quả tin tuyển dụng</h3>
                    <p>Không có dữ liệu để hiển thị</p>
                </div>
            </div>
        );
    }

    return (
        <div className="job-performance-chart">
            <div className="chart-header">
                <div className="header-content">
                    <h3>Hiệu quả tin tuyển dụng</h3>
                    <p>So sánh hiệu quả của các tin tuyển dụng</p>
                </div>
                
                <div className="metric-selector">
                    {metrics.map(metric => (
                        <button
                            key={metric.id}
                            className={`metric-btn ${selectedMetric === metric.id ? 'active' : ''}`}
                            onClick={() => onMetricChange(metric.id)}
                            style={{
                                borderColor: selectedMetric === metric.id ? metric.color : '#e2e8f0',
                                color: selectedMetric === metric.id ? metric.color : '#64748b'
                            }}
                        >
                            {metric.label}
                        </button>
                    ))}
                </div>
            </div>

            <div className="chart-content">
                <div className="performance-bars">
                    {sortedData.slice(0, 10).map((job, index) => {
                        const value = selectedMetric === 'conversionRate' ? 
                            parseFloat(job[selectedMetric]) : job[selectedMetric];
                        const width = calculateWidth(value);
                        
                        return (
                            <div key={job.jobId} className="performance-bar-item">
                                <div className="job-info">
                                    <div className="job-rank">#{index + 1}</div>
                                    <div className="job-details">
                                        <h4 className="job-title">{job.title}</h4>
                                        <div className="job-stats">
                                            <span className="stat">
                                                👁️ {job.views} lượt xem
                                            </span>
                                            <span className="stat">
                                                📝 {job.applications} ứng tuyển
                                            </span>
                                            <span className="stat">
                                                📊 {job.conversionRate}% chuyển đổi
                                            </span>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="bar-container">
                                    <div 
                                        className="performance-bar"
                                        style={{ 
                                            width: `${width}%`,
                                            backgroundColor: getMetricColor()
                                        }}
                                    >
                                        <div className="bar-gradient"></div>
                                    </div>
                                    <span className="bar-value">
                                        {formatValue(value)}
                                    </span>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {sortedData.length === 0 && (
                    <div className="no-data">
                        <span className="no-data-icon">📊</span>
                        <p>Chưa có dữ liệu hiệu quả tin tuyển dụng</p>
                    </div>
                )}
            </div>

            <div className="chart-insights">
                <div className="insight-grid">
                    <div className="insight-card">
                        <h4>Tin tốt nhất</h4>
                        <p>
                            {sortedData.length > 0 ? sortedData[0].title : 'N/A'}
                        </p>
                        <span className="insight-value">
                            {sortedData.length > 0 ? formatValue(
                                selectedMetric === 'conversionRate' ? 
                                parseFloat(sortedData[0][selectedMetric]) : 
                                sortedData[0][selectedMetric]
                            ) : '0'}
                        </span>
                    </div>
                    
                    <div className="insight-card">
                        <h4>Trung bình</h4>
                        <p>Giá trị trung bình của tất cả tin</p>
                        <span className="insight-value">
                            {(() => {
                                if (sortedData.length === 0) return '0';
                                const avg = sortedData.reduce((sum, job) => {
                                    const value = selectedMetric === 'conversionRate' ? 
                                        parseFloat(job[selectedMetric]) : job[selectedMetric];
                                    return sum + value;
                                }, 0) / sortedData.length;
                                return formatValue(avg.toFixed(1));
                            })()}
                        </span>
                    </div>
                    
                    <div className="insight-card">
                        <h4>Cần cải thiện</h4>
                        <p>
                            {sortedData.length > 0 ? 
                                sortedData[sortedData.length - 1].title : 'N/A'}
                        </p>
                        <span className="insight-value">
                            {sortedData.length > 0 ? formatValue(
                                selectedMetric === 'conversionRate' ? 
                                parseFloat(sortedData[sortedData.length - 1][selectedMetric]) : 
                                sortedData[sortedData.length - 1][selectedMetric]
                            ) : '0'}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default JobPerformanceChart;
