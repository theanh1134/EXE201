import React from 'react';
import { applicationStatuses } from '../../../services/applicationAPI';
import './ApplicationFilters.css';

const ApplicationFilters = ({ 
    filters, 
    onFilterChange, 
    jobs, 
    applicationCount, 
    totalCount 
}) => {
    const handleFilterChange = (key, value) => {
        onFilterChange({ [key]: value });
    };

    const clearFilters = () => {
        onFilterChange({
            jobId: 'all',
            status: 'all',
            search: '',
            dateRange: 'all',
            sortBy: 'newest'
        });
    };

    const hasActiveFilters = filters.jobId !== 'all' || 
                           filters.status !== 'all' || 
                           filters.search !== '' || 
                           filters.dateRange !== 'all';

    return (
        <div className="application-filters">
            <div className="filters-header">
                <div className="filters-title">
                    <h3>Bộ lọc ứng viên</h3>
                    <span className="result-count">
                        Hiển thị {applicationCount} / {totalCount} ứng viên
                    </span>
                </div>
                {hasActiveFilters && (
                    <button 
                        className="clear-filters-btn"
                        onClick={clearFilters}
                    >
                        ✕ Xóa bộ lọc
                    </button>
                )}
            </div>

            <div className="filters-content">
                {/* Search */}
                <div className="filter-group">
                    <label>Tìm kiếm</label>
                    <div className="search-input">
                        <span className="search-icon">🔍</span>
                        <input
                            type="text"
                            placeholder="Tên ứng viên, email, vị trí..."
                            value={filters.search}
                            onChange={(e) => handleFilterChange('search', e.target.value)}
                        />
                    </div>
                </div>

                {/* Job Filter */}
                <div className="filter-group">
                    <label>Vị trí tuyển dụng</label>
                    <select
                        value={filters.jobId}
                        onChange={(e) => handleFilterChange('jobId', e.target.value)}
                    >
                        <option value="all">Tất cả vị trí</option>
                        {jobs.map(job => (
                            <option key={job._id} value={job._id}>
                                {job.title}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                    <label>Trạng thái</label>
                    <select
                        value={filters.status}
                        onChange={(e) => handleFilterChange('status', e.target.value)}
                    >
                        <option value="all">Tất cả trạng thái</option>
                        {applicationStatuses.map(status => (
                            <option key={status.value} value={status.value}>
                                {status.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Date Range Filter */}
                <div className="filter-group">
                    <label>Thời gian ứng tuyển</label>
                    <select
                        value={filters.dateRange}
                        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
                    >
                        <option value="all">Tất cả thời gian</option>
                        <option value="today">Hôm nay</option>
                        <option value="week">7 ngày qua</option>
                        <option value="month">30 ngày qua</option>
                    </select>
                </div>

                {/* Sort By */}
                <div className="filter-group">
                    <label>Sắp xếp theo</label>
                    <select
                        value={filters.sortBy}
                        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="name">Tên A-Z</option>
                        <option value="status">Trạng thái</option>
                    </select>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="quick-filters">
                <span className="quick-filters-label">Lọc nhanh:</span>
                <div className="quick-filter-buttons">
                    <button 
                        className={`quick-filter-btn ${filters.status === 'pending' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('status', filters.status === 'pending' ? 'all' : 'pending')}
                    >
                        🔄 Chờ xem xét
                    </button>
                    <button 
                        className={`quick-filter-btn ${filters.status === 'shortlisted' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('status', filters.status === 'shortlisted' ? 'all' : 'shortlisted')}
                    >
                        ⭐ Sơ tuyển
                    </button>
                    <button 
                        className={`quick-filter-btn ${filters.status === 'interviewed' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('status', filters.status === 'interviewed' ? 'all' : 'interviewed')}
                    >
                        🎤 Đã phỏng vấn
                    </button>
                    <button 
                        className={`quick-filter-btn ${filters.dateRange === 'today' ? 'active' : ''}`}
                        onClick={() => handleFilterChange('dateRange', filters.dateRange === 'today' ? 'all' : 'today')}
                    >
                        📅 Hôm nay
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ApplicationFilters;
