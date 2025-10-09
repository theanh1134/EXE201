import React, { useState } from 'react';
import './TopJobsTable.css';

const TopJobsTable = ({ data }) => {
    const [sortBy, setSortBy] = useState('applications');
    const [sortOrder, setSortOrder] = useState('desc');

    const handleSort = (field) => {
        if (sortBy === field) {
            setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
        } else {
            setSortBy(field);
            setSortOrder('desc');
        }
    };

    const sortedData = [...data].sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        if (typeof aValue === 'string') {
            aValue = aValue.toLowerCase();
            bValue = bValue.toLowerCase();
        }
        
        if (sortOrder === 'asc') {
            return aValue > bValue ? 1 : -1;
        } else {
            return aValue < bValue ? 1 : -1;
        }
    });

    const getSortIcon = (field) => {
        if (sortBy !== field) return '↕️';
        return sortOrder === 'asc' ? '↗️' : '↘️';
    };

    const getStatusColor = (accepted, rejected, total) => {
        const acceptanceRate = total > 0 ? (accepted / total) * 100 : 0;
        
        if (acceptanceRate >= 20) return '#10b981'; // Green
        if (acceptanceRate >= 10) return '#f59e0b'; // Orange
        return '#ef4444'; // Red
    };

    const calculateAcceptanceRate = (accepted, total) => {
        if (total === 0) return '0%';
        return `${((accepted / total) * 100).toFixed(1)}%`;
    };

    if (!data || data.length === 0) {
        return (
            <div className="top-jobs-table">
                <div className="table-header">
                    <h3>Top tin tuyển dụng</h3>
                    <p>Không có dữ liệu để hiển thị</p>
                </div>
            </div>
        );
    }

    return (
        <div className="top-jobs-table">
            <div className="table-header">
                <h3>Top tin tuyển dụng</h3>
                <p>Hiệu quả của các tin tuyển dụng hàng đầu</p>
            </div>

            <div className="table-container">
                <table className="jobs-table">
                    <thead>
                        <tr>
                            <th className="rank-col">#</th>
                            <th 
                                className="sortable"
                                onClick={() => handleSort('title')}
                            >
                                Vị trí {getSortIcon('title')}
                            </th>
                            <th 
                                className="sortable number-col"
                                onClick={() => handleSort('applications')}
                            >
                                Ứng tuyển {getSortIcon('applications')}
                            </th>
                            <th className="number-col">Đang xử lý</th>
                            <th className="number-col">Đã nhận</th>
                            <th className="number-col">Bị từ chối</th>
                            <th className="number-col">Tỷ lệ nhận</th>
                            <th className="status-col">Trạng thái</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedData.map((job, index) => {
                            const acceptanceRate = calculateAcceptanceRate(job.accepted || 0, job.applications);
                            const statusColor = getStatusColor(job.accepted || 0, job.rejected || 0, job.applications);
                            
                            return (
                                <tr key={job.jobId} className="job-row">
                                    <td className="rank-cell">
                                        <span className="rank-number">#{index + 1}</span>
                                    </td>
                                    
                                    <td className="title-cell">
                                        <div className="job-title-container">
                                            <h4 className="job-title">{job.title}</h4>
                                        </div>
                                    </td>
                                    
                                    <td className="number-cell">
                                        <span className="number-value">{job.applications}</span>
                                    </td>
                                    
                                    <td className="number-cell">
                                        <span className="number-value">
                                            {job.pending || 0}
                                        </span>
                                    </td>
                                    
                                    <td className="number-cell">
                                        <span className="number-value accepted">
                                            {job.accepted || 0}
                                        </span>
                                    </td>
                                    
                                    <td className="number-cell">
                                        <span className="number-value rejected">
                                            {job.rejected || 0}
                                        </span>
                                    </td>
                                    
                                    <td className="number-cell">
                                        <span 
                                            className="acceptance-rate"
                                            style={{ color: statusColor }}
                                        >
                                            {acceptanceRate}
                                        </span>
                                    </td>
                                    
                                    <td className="status-cell">
                                        <div className="status-indicator">
                                            <div 
                                                className="status-dot"
                                                style={{ backgroundColor: statusColor }}
                                            ></div>
                                            <span className="status-text">
                                                {(() => {
                                                    const rate = parseFloat(acceptanceRate);
                                                    if (rate >= 20) return 'Xuất sắc';
                                                    if (rate >= 10) return 'Tốt';
                                                    if (rate > 0) return 'Cần cải thiện';
                                                    return 'Chưa có kết quả';
                                                })()}
                                            </span>
                                        </div>
                                    </td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            <div className="table-summary">
                <div className="summary-stats">
                    <div className="summary-item">
                        <span className="summary-label">Tổng tin:</span>
                        <span className="summary-value">{data.length}</span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Tổng ứng tuyển:</span>
                        <span className="summary-value">
                            {data.reduce((sum, job) => sum + job.applications, 0)}
                        </span>
                    </div>
                    <div className="summary-item">
                        <span className="summary-label">Tỷ lệ nhận trung bình:</span>
                        <span className="summary-value">
                            {(() => {
                                const totalApplications = data.reduce((sum, job) => sum + job.applications, 0);
                                const totalAccepted = data.reduce((sum, job) => sum + (job.accepted || 0), 0);
                                return totalApplications > 0 ? 
                                    `${((totalAccepted / totalApplications) * 100).toFixed(1)}%` : '0%';
                            })()}
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TopJobsTable;
