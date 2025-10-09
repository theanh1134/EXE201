import React from 'react';
import { jobOptions } from '../../../services/jobAPI';
import './JobFilters.css';

const JobFilters = ({ filters, onFilterChange, jobCount }) => {
    const handleChange = (field, value) => {
        onFilterChange({ [field]: value });
    };

    return (
        <div className="job-filters">
            <div className="filters-header">
                <h3 className="filters-title">
                    <span className="filters-icon">🔍</span>
                    Bộ lọc & Tìm kiếm
                </h3>
                <span className="filters-count">{jobCount} công việc</span>
            </div>

            <div className="filters-grid">
                {/* Search */}
                <div className="filter-group filter-search">
                    <label className="filter-label">
                        <span className="label-icon">🔎</span>
                        Tìm kiếm
                    </label>
                    <input
                        type="text"
                        className="filter-input"
                        placeholder="Tìm theo tên, mô tả, địa điểm..."
                        value={filters.search}
                        onChange={(e) => handleChange('search', e.target.value)}
                    />
                </div>

                {/* Status Filter */}
                <div className="filter-group">
                    <label className="filter-label">
                        <span className="label-icon">📊</span>
                        Trạng thái
                    </label>
                    <select
                        className="filter-select"
                        value={filters.status}
                        onChange={(e) => handleChange('status', e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        <option value="published">Đã đăng</option>
                        <option value="draft">Nháp</option>
                        <option value="closed">Đã đóng</option>
                        <option value="paused">Tạm dừng</option>
                        <option value="expired">Hết hạn</option>
                    </select>
                </div>

                {/* Category Filter */}
                <div className="filter-group">
                    <label className="filter-label">
                        <span className="label-icon">📁</span>
                        Danh mục
                    </label>
                    <select
                        className="filter-select"
                        value={filters.category}
                        onChange={(e) => handleChange('category', e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        {jobOptions.categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Type Filter */}
                <div className="filter-group">
                    <label className="filter-label">
                        <span className="label-icon">💼</span>
                        Loại hình
                    </label>
                    <select
                        className="filter-select"
                        value={filters.type}
                        onChange={(e) => handleChange('type', e.target.value)}
                    >
                        <option value="all">Tất cả</option>
                        {jobOptions.types.map(type => (
                            <option key={type.value} value={type.value}>
                                {type.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Sort By */}
                <div className="filter-group">
                    <label className="filter-label">
                        <span className="label-icon">🔄</span>
                        Sắp xếp
                    </label>
                    <select
                        className="filter-select"
                        value={filters.sortBy}
                        onChange={(e) => handleChange('sortBy', e.target.value)}
                    >
                        <option value="newest">Mới nhất</option>
                        <option value="oldest">Cũ nhất</option>
                        <option value="title">Tên A-Z</option>
                        <option value="applications">Nhiều ứng tuyển nhất</option>
                        <option value="views">Nhiều lượt xem nhất</option>
                    </select>
                </div>
            </div>

            {/* Quick Filters */}
            <div className="quick-filters">
                <button
                    className={`quick-filter-btn ${filters.status === 'all' ? 'active' : ''}`}
                    onClick={() => handleChange('status', 'all')}
                >
                    Tất cả
                </button>
                <button
                    className={`quick-filter-btn ${filters.status === 'published' ? 'active' : ''}`}
                    onClick={() => handleChange('status', 'published')}
                >
                    ✅ Đã đăng
                </button>
                <button
                    className={`quick-filter-btn ${filters.status === 'draft' ? 'active' : ''}`}
                    onClick={() => handleChange('status', 'draft')}
                >
                    📝 Nháp
                </button>
                <button
                    className={`quick-filter-btn ${filters.status === 'closed' ? 'active' : ''}`}
                    onClick={() => handleChange('status', 'closed')}
                >
                    🔒 Đã đóng
                </button>
            </div>

            {/* Reset Button */}
            {(filters.search || filters.status !== 'all' || filters.category !== 'all' || filters.type !== 'all') && (
                <button
                    className="btn-employer btn-employer-secondary btn-reset-filters"
                    onClick={() => onFilterChange({
                        search: '',
                        status: 'all',
                        category: 'all',
                        type: 'all',
                        sortBy: 'newest'
                    })}
                >
                    🔄 Đặt lại bộ lọc
                </button>
            )}
        </div>
    );
};

export default JobFilters;

