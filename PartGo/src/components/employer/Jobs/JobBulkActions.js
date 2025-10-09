import React, { useState } from 'react';
import './JobBulkActions.css';

const JobBulkActions = ({ selectedCount, onAction, onSelectAll, allSelected }) => {
    const [showActions, setShowActions] = useState(false);

    if (selectedCount === 0) {
        return (
            <div className="job-bulk-actions">
                <button
                    className="btn-employer btn-employer-secondary btn-select-all"
                    onClick={() => onSelectAll(true)}
                >
                    ☑️ Chọn tất cả
                </button>
            </div>
        );
    }

    return (
        <div className="job-bulk-actions active">
            <div className="bulk-actions-info">
                <span className="selected-count">
                    <span className="count-badge">{selectedCount}</span>
                    công việc đã chọn
                </span>
                <button
                    className="btn-clear-selection"
                    onClick={() => onSelectAll(false)}
                >
                    ✕ Bỏ chọn
                </button>
            </div>

            <div className="bulk-actions-buttons">
                <button
                    className="btn-employer btn-employer-success btn-employer-sm"
                    onClick={() => {
                        if (window.confirm(`Đăng ${selectedCount} công việc đã chọn?`)) {
                            onAction('publish');
                        }
                    }}
                >
                    📤 Đăng
                </button>

                <button
                    className="btn-employer btn-employer-secondary btn-employer-sm"
                    onClick={() => {
                        if (window.confirm(`Tạm dừng ${selectedCount} công việc đã chọn?`)) {
                            onAction('pause');
                        }
                    }}
                >
                    ⏸ Tạm dừng
                </button>

                <button
                    className="btn-employer btn-employer-secondary btn-employer-sm"
                    onClick={() => {
                        if (window.confirm(`Đóng ${selectedCount} công việc đã chọn?`)) {
                            onAction('close');
                        }
                    }}
                >
                    🔒 Đóng
                </button>

                <button
                    className="btn-employer btn-employer-danger btn-employer-sm"
                    onClick={() => {
                        if (window.confirm(`XÓA ${selectedCount} công việc đã chọn? Hành động này không thể hoàn tác!`)) {
                            onAction('delete');
                        }
                    }}
                >
                    🗑️ Xóa
                </button>
            </div>
        </div>
    );
};

export default JobBulkActions;

