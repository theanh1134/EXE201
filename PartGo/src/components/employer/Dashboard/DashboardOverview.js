import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useEmployerData } from '../../../hooks/employer/useEmployerData';
import StatsCards from './StatsCards';
import RecentActivity from './RecentActivity';
import QuickActions from './QuickActions';
import JobsOverview from './JobsOverview';
import './DashboardOverview.css';

const DashboardOverview = () => {
    const { user } = useAuth();
    const { loading, jobs, stats } = useEmployerData();

    const [recentActivity, setRecentActivity] = React.useState([]);

    // Generate recent activity when jobs change
    React.useEffect(() => {
        if (jobs.length > 0) {
            generateRecentActivity(jobs);
        }
    }, [jobs]);

    const generateRecentActivity = (jobs) => {
        const activities = [];

        // Add recent job activities
        jobs.slice(0, 3).forEach(job => {
            if (job.status === 'published') {
                activities.push({
                    id: `job-${job._id}`,
                    type: 'job_published',
                    title: 'Tin tuyển dụng được đăng',
                    description: `"${job.title}" đã được đăng thành công`,
                    timestamp: job.publishAt || job.createdAt,
                    icon: '📢',
                    color: 'green'
                });
            }

            if (job.applied > 0) {
                activities.push({
                    id: `app-${job._id}`,
                    type: 'new_application',
                    title: 'Có ứng viên mới',
                    description: `${job.applied} ứng viên đã ứng tuyển "${job.title}"`,
                    timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                    icon: '👤',
                    color: 'blue'
                });
            }
        });

        // Sort by timestamp
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

        setRecentActivity(activities.slice(0, 10));
    };

    if (loading) {
        return (
            <div className="dashboard-overview">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-overview">
            {/* Welcome Section */}
            <div className="welcome-section">
                <div className="welcome-content">
                    <h1>Chào mừng trở lại, {user?.fullName}!</h1>
                    <p>Đây là tổng quan về hoạt động tuyển dụng của bạn</p>
                </div>
                <div className="welcome-actions">
                    <button
                        className="btn-primary"
                        onClick={() => window.location.href = '/company-dashboard/jobs/create'}
                    >
                        ➕ Đăng tin mới
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <StatsCards stats={stats} />

            {/* Main Content Grid */}
            <div className="dashboard-grid">
                {/* Quick Actions */}
                <div className="dashboard-card">
                    <QuickActions />
                </div>

                {/* Recent Activity */}
                <div className="dashboard-card">
                    <RecentActivity activities={recentActivity} />
                </div>

                {/* Jobs Overview */}
                <div className="dashboard-card full-width">
                    <JobsOverview jobs={jobs.slice(0, 5)} />
                </div>
            </div>
        </div>
    );
};

export default DashboardOverview;
