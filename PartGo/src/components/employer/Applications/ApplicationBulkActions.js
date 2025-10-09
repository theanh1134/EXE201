import React, { useState } from 'react';
import { applicationStatuses } from '../../../services/applicationAPI';
import './ApplicationBulkActions.css';

const ApplicationBulkActions = ({ 
    selectedCount, 
    onBulkStatusUpdate, 
    onClearSelection 
}) => {
    const [showActions, setShowActions] = useState(false);

    const handleStatusUpdate = (status) => {
        onBulkStatusUpdate(status);
        setShowActions(false);
    };

    return (
        <div className="application-bulk-actions">
            <div className="bulk-actions-header">
                <div className="selection-info">
                    <span className="selection-count">
                        Đã chọn {selectedCount} ứng viên
                    </span>
                    <button 
                        className="clear-selection-btn"
                        onClick={onClearSelection}
                    >
                        ✕ Bỏ chọn
                    </button>
                </div>
                
                <div className="bulk-actions-controls">
                    <button 
                        className="toggle-actions-btn"
                        onClick={() => setShowActions(!showActions)}
                    >
                        ⚙️ Thao tác hàng loạt
                        <span className={`arrow ${showActions ? 'up' : 'down'}`}>▼</span>
                    </button>
                </div>
            </div>

            {showActions && (
                <div className="bulk-actions-content">
                    <div className="action-group">
                        <h4>Cập nhật trạng thái</h4>
                        <div className="status-buttons">
                            {applicationStatuses.map(status => (
                                <button
                                    key={status.value}
                                    className="status-action-btn"
                                    style={{ 
                                        backgroundColor: status.color,
                                        color: 'white'
                                    }}
                                    onClick={() => handleStatusUpdate(status.value)}
                                >
                                    {status.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="action-group">
                        <h4>Thao tác khác</h4>
                        <div className="other-actions">
                            <button 
                                className="action-btn export-btn"
                                onClick={() => {
                                    // TODO: Implement export functionality
                                    alert('Tính năng xuất dữ liệu sẽ được bổ sung');
                                }}
                            >
                                📊 Xuất danh sách
                            </button>
                            
                            <button 
                                className="action-btn email-btn"
                                onClick={() => {
                                    // TODO: Implement bulk email functionality
                                    alert('Tính năng gửi email hàng loạt sẽ được bổ sung');
                                }}
                            >
                                ✉️ Gửi email
                            </button>
                            
                            <button 
                                className="action-btn archive-btn"
                                onClick={() => {
                                    // TODO: Implement archive functionality
                                    alert('Tính năng lưu trữ sẽ được bổ sung');
                                }}
                            >
                                📁 Lưu trữ
                            </button>
                        </div>
                    </div>

                    <div className="action-group danger-zone">
                        <h4>Vùng nguy hiểm</h4>
                        <div className="danger-actions">
                            <button 
                                className="action-btn delete-btn"
                                onClick={() => {
                                    if (window.confirm(`Bạn có chắc chắn muốn xóa ${selectedCount} ứng viên đã chọn? Thao tác này không thể hoàn tác.`)) {
                                        // TODO: Implement bulk delete functionality
                                        alert('Tính năng xóa hàng loạt sẽ được bổ sung');
                                    }
                                }}
                            >
                                🗑️ Xóa đã chọn
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ApplicationBulkActions;
