import React from 'react';
import './RecruitmentInsights.css';

const RecruitmentInsights = ({ data }) => {
    const getInsightIcon = (type) => {
        switch (type) {
            case 'warning': return '⚠️';
            case 'alert': return '🚨';
            case 'info': return 'ℹ️';
            case 'success': return '✅';
            default: return '💡';
        }
    };

    const getInsightColor = (type) => {
        switch (type) {
            case 'warning': return '#f59e0b';
            case 'alert': return '#ef4444';
            case 'info': return '#3b82f6';
            case 'success': return '#10b981';
            default: return '#64748b';
        }
    };

    const getActionButtonStyle = (type) => {
        const color = getInsightColor(type);
        return {
            borderColor: color,
            color: color
        };
    };

    // Default insights if no data provided
    const defaultInsights = [
        {
            type: 'info',
            title: 'Tối ưu hóa tin tuyển dụng',
            description: 'Sử dụng từ khóa phù hợp và mô tả công việc chi tiết để thu hút ứng viên chất lượng.',
            action: 'Xem hướng dẫn'
        },
        {
            type: 'success',
            title: 'Phản hồi nhanh chóng',
            description: 'Phản hồi ứng viên trong vòng 24-48 giờ để tạo ấn tượng tích cực.',
            action: 'Thiết lập nhắc nhở'
        },
        {
            type: 'warning',
            title: 'Theo dõi xu hướng',
            description: 'Cập nhật thường xuyên về xu hướng thị trường để điều chỉnh chiến lược tuyển dụng.',
            action: 'Xem báo cáo'
        }
    ];

    const insights = data && data.length > 0 ? data : defaultInsights;

    return (
        <div className="recruitment-insights">
            <div className="insights-header">
                <h3>Gợi ý tuyển dụng</h3>
                <p>Những khuyến nghị để cải thiện hiệu quả tuyển dụng</p>
            </div>

            <div className="insights-list">
                {insights.map((insight, index) => (
                    <div 
                        key={index} 
                        className={`insight-card ${insight.type}`}
                    >
                        <div className="insight-header">
                            <div className="insight-icon-container">
                                <span 
                                    className="insight-icon"
                                    style={{ color: getInsightColor(insight.type) }}
                                >
                                    {getInsightIcon(insight.type)}
                                </span>
                            </div>
                            <h4 className="insight-title">{insight.title}</h4>
                        </div>
                        
                        <div className="insight-content">
                            <p className="insight-description">
                                {insight.description}
                            </p>
                        </div>
                        
                        <div className="insight-footer">
                            <button 
                                className="insight-action-btn"
                                style={getActionButtonStyle(insight.type)}
                                onClick={() => {
                                    // TODO: Implement specific actions based on insight type
                                    alert(`Thực hiện: ${insight.action}`);
                                }}
                            >
                                {insight.action}
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {insights.length === 0 && (
                <div className="no-insights">
                    <span className="no-insights-icon">💡</span>
                    <p>Chưa có gợi ý nào</p>
                    <span className="no-insights-subtitle">
                        Hệ thống sẽ phân tích dữ liệu và đưa ra gợi ý phù hợp
                    </span>
                </div>
            )}

            <div className="insights-footer">
                <div className="insights-summary">
                    <div className="summary-item">
                        <span className="summary-icon">📊</span>
                        <div className="summary-content">
                            <span className="summary-title">Phân tích tự động</span>
                            <span className="summary-desc">Cập nhật hàng ngày</span>
                        </div>
                    </div>
                    
                    <div className="summary-item">
                        <span className="summary-icon">🎯</span>
                        <div className="summary-content">
                            <span className="summary-title">Cá nhân hóa</span>
                            <span className="summary-desc">Dựa trên dữ liệu của bạn</span>
                        </div>
                    </div>
                    
                    <div className="summary-item">
                        <span className="summary-icon">📈</span>
                        <div className="summary-content">
                            <span className="summary-title">Cải thiện liên tục</span>
                            <span className="summary-desc">Theo dõi tiến độ</span>
                        </div>
                    </div>
                </div>
                
                <button 
                    className="view-all-insights-btn"
                    onClick={() => {
                        // TODO: Navigate to detailed insights page
                        alert('Tính năng xem tất cả gợi ý sẽ được bổ sung');
                    }}
                >
                    Xem tất cả gợi ý →
                </button>
            </div>
        </div>
    );
};

export default RecruitmentInsights;
