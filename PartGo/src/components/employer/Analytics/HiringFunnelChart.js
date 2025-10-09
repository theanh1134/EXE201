import React from 'react';
import './HiringFunnelChart.css';

const HiringFunnelChart = ({ data }) => {
    const funnelSteps = [
        {
            id: 'applied',
            label: 'Ứng tuyển',
            value: data.applied,
            color: '#3b82f6',
            icon: '📝'
        },
        {
            id: 'reviewed',
            label: 'Đã xem xét',
            value: data.reviewed,
            color: '#8b5cf6',
            icon: '👀'
        },
        {
            id: 'shortlisted',
            label: 'Lọt vòng trong',
            value: data.shortlisted,
            color: '#10b981',
            icon: '✅'
        },
        {
            id: 'interviewed',
            label: 'Phỏng vấn',
            value: data.interviewed,
            color: '#f59e0b',
            icon: '🎤'
        },
        {
            id: 'accepted',
            label: 'Được nhận',
            value: data.accepted,
            color: '#ef4444',
            icon: '🎉'
        }
    ];

    const maxValue = Math.max(...funnelSteps.map(step => step.value));

    const calculateWidth = (value) => {
        if (maxValue === 0) return 0;
        return Math.max((value / maxValue) * 100, 5); // Minimum 5% width for visibility
    };

    const calculateConversionRate = (current, previous) => {
        if (previous === 0) return 0;
        return ((current / previous) * 100).toFixed(1);
    };

    return (
        <div className="hiring-funnel-chart">
            <div className="chart-header">
                <h3>Phễu tuyển dụng</h3>
                <p>Theo dõi quy trình tuyển dụng từ ứng tuyển đến nhận việc</p>
            </div>

            <div className="funnel-container">
                {funnelSteps.map((step, index) => {
                    const width = calculateWidth(step.value);
                    const conversionRate = index > 0 ? 
                        calculateConversionRate(step.value, funnelSteps[index - 1].value) : 100;

                    return (
                        <div key={step.id} className="funnel-step">
                            <div className="step-info">
                                <div className="step-header">
                                    <span className="step-icon">{step.icon}</span>
                                    <span className="step-label">{step.label}</span>
                                </div>
                                <div className="step-metrics">
                                    <span className="step-value">{step.value}</span>
                                    {index > 0 && (
                                        <span className="conversion-rate">
                                            {conversionRate}%
                                        </span>
                                    )}
                                </div>
                            </div>
                            
                            <div className="step-bar-container">
                                <div 
                                    className="step-bar"
                                    style={{ 
                                        width: `${width}%`,
                                        backgroundColor: step.color
                                    }}
                                >
                                    <div className="bar-gradient"></div>
                                </div>
                            </div>
                            
                            {index < funnelSteps.length - 1 && (
                                <div className="funnel-arrow">
                                    <svg width="20" height="40" viewBox="0 0 20 40">
                                        <path
                                            d="M0 0 L20 20 L0 40"
                                            fill="none"
                                            stroke="#e2e8f0"
                                            strokeWidth="2"
                                        />
                                    </svg>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>

            <div className="funnel-insights">
                <div className="insight-grid">
                    <div className="insight-item">
                        <span className="insight-label">Tỷ lệ chuyển đổi tổng</span>
                        <span className="insight-value">
                            {data.applied > 0 ? ((data.accepted / data.applied) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Giai đoạn rớt nhiều nhất</span>
                        <span className="insight-value">
                            {(() => {
                                let maxDrop = 0;
                                let maxDropStage = 'N/A';
                                
                                for (let i = 1; i < funnelSteps.length; i++) {
                                    const drop = funnelSteps[i - 1].value - funnelSteps[i].value;
                                    if (drop > maxDrop) {
                                        maxDrop = drop;
                                        maxDropStage = funnelSteps[i - 1].label;
                                    }
                                }
                                
                                return maxDropStage;
                            })()}
                        </span>
                    </div>
                    <div className="insight-item">
                        <span className="insight-label">Hiệu quả phỏng vấn</span>
                        <span className="insight-value">
                            {data.interviewed > 0 ? ((data.accepted / data.interviewed) * 100).toFixed(1) : 0}%
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default HiringFunnelChart;
