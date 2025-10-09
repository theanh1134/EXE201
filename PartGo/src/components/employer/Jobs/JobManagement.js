import React, { useState, useEffect } from 'react';
import { useEmployerData } from '../../../hooks/employer/useEmployerData';
import { useNotification } from '../../../contexts/NotificationContext';
import { jobOptions } from '../../../services/jobAPI';
import EmployerLayout from '../Layout/EmployerLayout';
import JobCard from './JobCard';
import JobFilters from './JobFilters';
import JobBulkActions from './JobBulkActions';
import CreateJobModal from '../../CreateJobModal';
import './JobManagement.css';

const JobManagement = () => {
    const { jobs, loading, loadJobs, deleteJob, publishJob, cloneJob } = useEmployerData();
    const { success, error: showError } = useNotification();
    
    const [filteredJobs, setFilteredJobs] = useState([]);
    const [selectedJobs, setSelectedJobs] = useState([]);
    const [filters, setFilters] = useState({
        status: 'all',
        category: 'all',
        type: 'all',
        search: '',
        sortBy: 'newest'
    });
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingJob, setEditingJob] = useState(null);
    const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'

    // Filter and sort jobs
    useEffect(() => {
        let filtered = [...jobs];

        // Apply filters
        if (filters.status !== 'all') {
            filtered = filtered.filter(job => job.status === filters.status);
        }
        
        if (filters.category !== 'all') {
            filtered = filtered.filter(job => job.category === filters.category);
        }
        
        if (filters.type !== 'all') {
            filtered = filtered.filter(job => job.type === filters.type);
        }
        
        if (filters.search) {
            const searchLower = filters.search.toLowerCase();
            filtered = filtered.filter(job => 
                job.title.toLowerCase().includes(searchLower) ||
                job.description.toLowerCase().includes(searchLower) ||
                job.location?.city?.toLowerCase().includes(searchLower)
            );
        }

        // Apply sorting
        switch (filters.sortBy) {
            case 'newest':
                filtered.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
                break;
            case 'oldest':
                filtered.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'title':
                filtered.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'applications':
                filtered.sort((a, b) => (b.applied || 0) - (a.applied || 0));
                break;
            case 'views':
                filtered.sort((a, b) => (b.views || 0) - (a.views || 0));
                break;
            default:
                break;
        }

        setFilteredJobs(filtered);
    }, [jobs, filters]);

    const handleFilterChange = (newFilters) => {
        setFilters(prev => ({ ...prev, ...newFilters }));
        setSelectedJobs([]); // Clear selection when filters change
    };

    const handleJobSelect = (jobId, selected) => {
        if (selected) {
            setSelectedJobs(prev => [...prev, jobId]);
        } else {
            setSelectedJobs(prev => prev.filter(id => id !== jobId));
        }
    };

    const handleSelectAll = (selected) => {
        if (selected) {
            setSelectedJobs(filteredJobs.map(job => job._id));
        } else {
            setSelectedJobs([]);
        }
    };

    const handleCreateJob = () => {
        setEditingJob(null);
        setShowCreateModal(true);
    };

    const handleEditJob = (job) => {
        setEditingJob(job);
        setShowCreateModal(true);
    };

    const handleJobCreated = (job) => {
        setShowCreateModal(false);
        setEditingJob(null);
        loadJobs(); // Refresh jobs list
        success(editingJob ? 'Đã cập nhật công việc thành công!' : 'Đã tạo công việc thành công!');
    };

    const handleDeleteJob = async (jobId) => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa công việc này?')) {
            return;
        }

        try {
            await deleteJob(jobId);
            success('Đã xóa công việc thành công!');
            setSelectedJobs(prev => prev.filter(id => id !== jobId));
        } catch (error) {
            // Error handled in hook
        }
    };

    const handlePublishJob = async (jobId) => {
        try {
            await publishJob(jobId);
            success('Đã đăng tin tuyển dụng thành công!');
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleCloneJob = async (jobId) => {
        try {
            await cloneJob(jobId);
            success('Đã sao chép công việc thành công!');
        } catch (error) {
            // Error handled in hook
        }
    };

    const handleBulkAction = async (action) => {
        if (selectedJobs.length === 0) {
            showError('Vui lòng chọn ít nhất một công việc');
            return;
        }

        try {
            switch (action) {
                case 'delete':
                    if (!window.confirm(`Bạn có chắc chắn muốn xóa ${selectedJobs.length} công việc đã chọn?`)) {
                        return;
                    }
                    await Promise.all(selectedJobs.map(id => deleteJob(id)));
                    success(`Đã xóa ${selectedJobs.length} công việc thành công!`);
                    break;
                case 'publish':
                    await Promise.all(selectedJobs.map(id => publishJob(id)));
                    success(`Đã đăng ${selectedJobs.length} tin tuyển dụng thành công!`);
                    break;
                case 'draft':
                    // This would need to be implemented in the API
                    showError('Tính năng này chưa được hỗ trợ');
                    break;
                default:
                    break;
            }
            setSelectedJobs([]);
        } catch (error) {
            // Errors handled in hooks
        }
    };

    if (loading) {
        return (
            <EmployerLayout currentPage="jobs">
                <div className="job-management">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải danh sách công việc...</p>
                    </div>
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout currentPage="jobs">
            <div className="job-management">
                {/* Header */}
                <div className="job-management-header">
                    <div className="header-content">
                        <h1>Quản lý tin tuyển dụng</h1>
                        <p>Tạo, chỉnh sửa và quản lý các tin tuyển dụng của bạn</p>
                    </div>
                    <div className="header-actions">
                        <button 
                            className="btn-create-job"
                            onClick={handleCreateJob}
                        >
                            ➕ Tạo tin mới
                        </button>
                    </div>
                </div>

                {/* Filters */}
                <JobFilters 
                    filters={filters}
                    onFilterChange={handleFilterChange}
                    jobCount={filteredJobs.length}
                    totalCount={jobs.length}
                />

                {/* Bulk Actions */}
                {selectedJobs.length > 0 && (
                    <JobBulkActions 
                        selectedCount={selectedJobs.length}
                        onBulkAction={handleBulkAction}
                        onClearSelection={() => setSelectedJobs([])}
                    />
                )}

                {/* View Controls */}
                <div className="view-controls">
                    <div className="view-mode">
                        <button 
                            className={`view-btn ${viewMode === 'grid' ? 'active' : ''}`}
                            onClick={() => setViewMode('grid')}
                        >
                            ⊞ Grid
                        </button>
                        <button 
                            className={`view-btn ${viewMode === 'list' ? 'active' : ''}`}
                            onClick={() => setViewMode('list')}
                        >
                            ☰ List
                        </button>
                    </div>
                    
                    <div className="select-all">
                        <label>
                            <input
                                type="checkbox"
                                checked={selectedJobs.length === filteredJobs.length && filteredJobs.length > 0}
                                onChange={(e) => handleSelectAll(e.target.checked)}
                            />
                            Chọn tất cả ({filteredJobs.length})
                        </label>
                    </div>
                </div>

                {/* Jobs List */}
                <div className={`jobs-container ${viewMode}`}>
                    {filteredJobs.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📝</div>
                            <h3>Không tìm thấy công việc nào</h3>
                            <p>
                                {jobs.length === 0 
                                    ? 'Bạn chưa có tin tuyển dụng nào. Tạo tin đầu tiên để bắt đầu!'
                                    : 'Thử thay đổi bộ lọc để xem thêm kết quả'
                                }
                            </p>
                            {jobs.length === 0 && (
                                <button 
                                    className="btn-primary"
                                    onClick={handleCreateJob}
                                >
                                    Tạo tin tuyển dụng đầu tiên
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="jobs-grid">
                            {filteredJobs.map(job => (
                                <JobCard
                                    key={job._id}
                                    job={job}
                                    selected={selectedJobs.includes(job._id)}
                                    onSelect={(selected) => handleJobSelect(job._id, selected)}
                                    onEdit={() => handleEditJob(job)}
                                    onDelete={() => handleDeleteJob(job._id)}
                                    onPublish={() => handlePublishJob(job._id)}
                                    onClone={() => handleCloneJob(job._id)}
                                    viewMode={viewMode}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {/* Create/Edit Modal */}
                <CreateJobModal
                    isOpen={showCreateModal}
                    onClose={() => {
                        setShowCreateModal(false);
                        setEditingJob(null);
                    }}
                    onJobCreated={handleJobCreated}
                    editJob={editingJob}
                />
            </div>
        </EmployerLayout>
    );
};

export default JobManagement;
