import React, { useState } from 'react';
import './ApplicationTrendsChart.css';

const ApplicationTrendsChart = ({ data }) => {
    const [viewType, setViewType] = useState('line'); // line, bar

    if (!data || data.length === 0) {
        return (
            <div className="application-trends-chart">
                <div className="chart-header">
                    <h3>Xu hướng ứng tuyển</h3>
                    <p>Không có dữ liệu để hiển thị</p>
                </div>
            </div>
        );
    }

    const maxValue = Math.max(...data.map(item => item.applications));
    const minValue = Math.min(...data.map(item => item.applications));
    const avgValue = data.reduce((sum, item) => sum + item.applications, 0) / data.length;

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('vi-VN', { 
            month: 'short', 
            day: 'numeric' 
        });
    };

    const calculateHeight = (value) => {
        if (maxValue === 0) return 0;
        return Math.max((value / maxValue) * 100, 2);
    };

    const generatePath = () => {
        if (data.length === 0) return '';
        
        const width = 100; // percentage
        const height = 100; // percentage
        const stepX = width / (data.length - 1);
        
        let path = '';
        
        data.forEach((item, index) => {
            const x = index * stepX;
            const y = height - calculateHeight(item.applications);
            
            if (index === 0) {
                path += `M ${x} ${y}`;
            } else {
                path += ` L ${x} ${y}`;
            }
        });
        
        return path;
    };

    const getTrendDirection = () => {
        if (data.length < 2) return 'stable';
        
        const firstHalf = data.slice(0, Math.floor(data.length / 2));
        const secondHalf = data.slice(Math.floor(data.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, item) => sum + item.applications, 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, item) => sum + item.applications, 0) / secondHalf.length;
        
        if (secondAvg > firstAvg * 1.1) return 'up';
        if (secondAvg < firstAvg * 0.9) return 'down';
        return 'stable';
    };

    const trendDirection = getTrendDirection();
    const trendIcons = {
        up: '📈',
        down: '📉',
        stable: '➡️'
    };
    
    const trendColors = {
        up: '#10b981',
        down: '#ef4444',
        stable: '#64748b'
    };

    return (
        <div className="application-trends-chart">
            <div className="chart-header">
                <div className="header-content">
                    <h3>Xu hướng ứng tuyển</h3>
                    <div className="trend-indicator">
                        <span 
                            className="trend-icon"
                            style={{ color: trendColors[trendDirection] }}
                        >
                            {trendIcons[trendDirection]}
                        </span>
                        <span className="trend-text">
                            {trendDirection === 'up' && 'Tăng'}
                            {trendDirection === 'down' && 'Giảm'}
                            {trendDirection === 'stable' && 'Ổn định'}
                        </span>
                    </div>
                </div>
                
                <div className="chart-controls">
                    <button
                        className={`view-btn ${viewType === 'line' ? 'active' : ''}`}
                        onClick={() => setViewType('line')}
                    >
                        📈 Đường
                    </button>
                    <button
                        className={`view-btn ${viewType === 'bar' ? 'active' : ''}`}
                        onClick={() => setViewType('bar')}
                    >
                        📊 Cột
                    </button>
                </div>
            </div>

            <div className="chart-container">
                {viewType === 'line' ? (
                    <div className="line-chart">
                        <svg viewBox="0 0 100 100" className="chart-svg">
                            {/* Grid lines */}
                            <defs>
                                <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
                                    <path d="M 10 0 L 0 0 0 10" fill="none" stroke="#f1f5f9" strokeWidth="0.5"/>
                                </pattern>
                            </defs>
                            <rect width="100" height="100" fill="url(#grid)" />
                            
                            {/* Average line */}
                            <line
                                x1="0"
                                y1={100 - calculateHeight(avgValue)}
                                x2="100"
                                y2={100 - calculateHeight(avgValue)}
                                stroke="#94a3b8"
                                strokeWidth="0.5"
                                strokeDasharray="2,2"
                            />
                            
                            {/* Area under curve */}
                            <path
                                d={`${generatePath()} L 100 100 L 0 100 Z`}
                                fill="url(#gradient)"
                                opacity="0.3"
                            />
                            
                            {/* Main line */}
                            <path
                                d={generatePath()}
                                fill="none"
                                stroke="#3b82f6"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            
                            {/* Data points */}
                            {data.map((item, index) => {
                                const x = (index / (data.length - 1)) * 100;
                                const y = 100 - calculateHeight(item.applications);
                                
                                return (
                                    <circle
                                        key={index}
                                        cx={x}
                                        cy={y}
                                        r="2"
                                        fill="#3b82f6"
                                        stroke="white"
                                        strokeWidth="1"
                                    />
                                );
                            })}
                            
                            {/* Gradient definition */}
                            <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="0%" y2="100%">
                                    <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.8"/>
                                    <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.1"/>
                                </linearGradient>
                            </defs>
                        </svg>
                    </div>
                ) : (
                    <div className="bar-chart">
                        <div className="bars-container">
                            {data.map((item, index) => (
                                <div key={index} className="bar-item">
                                    <div 
                                        className="bar"
                                        style={{ 
                                            height: `${calculateHeight(item.applications)}%`,
                                            backgroundColor: item.applications > avgValue ? '#10b981' : '#3b82f6'
                                        }}
                                    >
                                        <div className="bar-value">{item.applications}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
                
                {/* X-axis labels */}
                <div className="x-axis">
                    {data.map((item, index) => {
                        // Show every 3rd label to avoid crowding
                        if (index % Math.ceil(data.length / 7) === 0 || index === data.length - 1) {
                            return (
                                <span key={index} className="x-label">
                                    {formatDate(item.date)}
                                </span>
                            );
                        }
                        return null;
                    })}
                </div>
            </div>

            <div className="chart-stats">
                <div className="stat-item">
                    <span className="stat-label">Cao nhất</span>
                    <span className="stat-value">{maxValue}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Trung bình</span>
                    <span className="stat-value">{avgValue.toFixed(1)}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Thấp nhất</span>
                    <span className="stat-value">{minValue}</span>
                </div>
                <div className="stat-item">
                    <span className="stat-label">Tổng cộng</span>
                    <span className="stat-value">
                        {data.reduce((sum, item) => sum + item.applications, 0)}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default ApplicationTrendsChart;
