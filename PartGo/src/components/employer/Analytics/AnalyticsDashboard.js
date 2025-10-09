import React, { useState, useEffect } from 'react';
import { useEmployerData } from '../../../hooks/employer/useEmployerData';
import { applicationAPI } from '../../../services/applicationAPI';
import EmployerLayout from '../Layout/EmployerLayout';
import OverviewMetrics from './OverviewMetrics';
import JobPerformanceChart from './JobPerformanceChart';
import HiringFunnelChart from './HiringFunnelChart';
import ApplicationTrendsChart from './ApplicationTrendsChart';
import TopJobsTable from './TopJobsTable';
import RecruitmentInsights from './RecruitmentInsights';
import './AnalyticsDashboard.css';

const AnalyticsDashboard = () => {
    const { jobs, loading: jobsLoading } = useEmployerData();
    const [analyticsData, setAnalyticsData] = useState({
        overview: {
            totalJobs: 0,
            activeJobs: 0,
            totalApplications: 0,
            totalViews: 0,
            avgTimeToHire: 0,
            conversionRate: 0
        },
        jobPerformance: [],
        hiringFunnel: {
            applied: 0,
            reviewed: 0,
            shortlisted: 0,
            interviewed: 0,
            accepted: 0
        },
        applicationTrends: [],
        topJobs: [],
        insights: []
    });
    const [loading, setLoading] = useState(true);
    const [dateRange, setDateRange] = useState('30'); // days
    const [selectedMetric, setSelectedMetric] = useState('applications');

    useEffect(() => {
        if (jobs.length > 0) {
            loadAnalyticsData();
        }
    }, [jobs, dateRange]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            
            // Calculate overview metrics
            const overview = calculateOverviewMetrics();
            
            // Load application data for all jobs
            const allApplications = await loadAllApplications();
            
            // Calculate analytics
            const jobPerformance = calculateJobPerformance(allApplications);
            const hiringFunnel = calculateHiringFunnel(allApplications);
            const applicationTrends = calculateApplicationTrends(allApplications);
            const topJobs = calculateTopJobs(allApplications);
            const insights = generateInsights(overview, allApplications);

            setAnalyticsData({
                overview,
                jobPerformance,
                hiringFunnel,
                applicationTrends,
                topJobs,
                insights
            });
        } catch (error) {
            console.error('Error loading analytics data:', error);
        } finally {
            setLoading(false);
        }
    };

    const calculateOverviewMetrics = () => {
        const totalJobs = jobs.length;
        const activeJobs = jobs.filter(job => job.status === 'published').length;
        const totalApplications = jobs.reduce((sum, job) => sum + (job.applied || 0), 0);
        const totalViews = jobs.reduce((sum, job) => sum + (job.views || 0), 0);
        const conversionRate = totalViews > 0 ? ((totalApplications / totalViews) * 100).toFixed(1) : 0;

        return {
            totalJobs,
            activeJobs,
            totalApplications,
            totalViews,
            avgTimeToHire: 14, // Mock data - would calculate from actual hiring data
            conversionRate: parseFloat(conversionRate)
        };
    };

    const loadAllApplications = async () => {
        const allApplications = [];
        
        for (const job of jobs) {
            try {
                const applications = await applicationAPI.getJobApplications(job._id);
                const applicationsWithJobInfo = applications.map(app => ({
                    ...app,
                    jobTitle: job.title,
                    jobType: job.type,
                    jobCategory: job.category
                }));
                allApplications.push(...applicationsWithJobInfo);
            } catch (error) {
                console.warn(`Failed to load applications for job ${job._id}`);
            }
        }
        
        return allApplications;
    };

    const calculateJobPerformance = (applications) => {
        const jobStats = {};
        
        // Initialize job stats
        jobs.forEach(job => {
            jobStats[job._id] = {
                jobId: job._id,
                title: job.title,
                views: job.views || 0,
                applications: 0,
                conversionRate: 0,
                avgTimeToRespond: 0
            };
        });
        
        // Calculate application stats
        applications.forEach(app => {
            if (jobStats[app.job]) {
                jobStats[app.job].applications++;
            }
        });
        
        // Calculate conversion rates
        Object.values(jobStats).forEach(stat => {
            stat.conversionRate = stat.views > 0 ? 
                ((stat.applications / stat.views) * 100).toFixed(1) : 0;
        });
        
        return Object.values(jobStats).sort((a, b) => b.applications - a.applications);
    };

    const calculateHiringFunnel = (applications) => {
        const funnel = {
            applied: applications.length,
            reviewed: applications.filter(app => ['reviewed', 'shortlisted', 'interviewed', 'accepted'].includes(app.status)).length,
            shortlisted: applications.filter(app => ['shortlisted', 'interviewed', 'accepted'].includes(app.status)).length,
            interviewed: applications.filter(app => ['interviewed', 'accepted'].includes(app.status)).length,
            accepted: applications.filter(app => app.status === 'accepted').length
        };
        
        return funnel;
    };

    const calculateApplicationTrends = (applications) => {
        const trends = {};
        const cutoffDate = new Date();
        cutoffDate.setDate(cutoffDate.getDate() - parseInt(dateRange));
        
        applications
            .filter(app => new Date(app.appliedAt) >= cutoffDate)
            .forEach(app => {
                const date = new Date(app.appliedAt).toISOString().split('T')[0];
                trends[date] = (trends[date] || 0) + 1;
            });
        
        // Fill missing dates with 0
        const result = [];
        for (let i = parseInt(dateRange) - 1; i >= 0; i--) {
            const date = new Date();
            date.setDate(date.getDate() - i);
            const dateStr = date.toISOString().split('T')[0];
            result.push({
                date: dateStr,
                applications: trends[dateStr] || 0
            });
        }
        
        return result;
    };

    const calculateTopJobs = (applications) => {
        const jobStats = {};
        
        applications.forEach(app => {
            const jobId = app.job;
            if (!jobStats[jobId]) {
                jobStats[jobId] = {
                    jobId,
                    title: app.jobTitle || 'Unknown',
                    applications: 0,
                    pending: 0,
                    accepted: 0,
                    rejected: 0
                };
            }
            
            jobStats[jobId].applications++;
            jobStats[jobId][app.status] = (jobStats[jobId][app.status] || 0) + 1;
        });
        
        return Object.values(jobStats)
            .sort((a, b) => b.applications - a.applications)
            .slice(0, 10);
    };

    const generateInsights = (overview, applications) => {
        const insights = [];
        
        // Conversion rate insight
        if (overview.conversionRate < 2) {
            insights.push({
                type: 'warning',
                title: 'Tỷ lệ chuyển đổi thấp',
                description: `Tỷ lệ chuyển đổi từ lượt xem sang ứng tuyển chỉ ${overview.conversionRate}%. Hãy xem xét cải thiện mô tả công việc.`,
                action: 'Cải thiện JD'
            });
        }
        
        // Application volume insight
        const recentApps = applications.filter(app => {
            const appDate = new Date(app.appliedAt);
            const weekAgo = new Date();
            weekAgo.setDate(weekAgo.getDate() - 7);
            return appDate >= weekAgo;
        }).length;
        
        if (recentApps === 0 && overview.activeJobs > 0) {
            insights.push({
                type: 'alert',
                title: 'Không có ứng tuyển mới',
                description: 'Không có ứng tuyển nào trong 7 ngày qua. Hãy xem xét quảng bá tin tuyển dụng.',
                action: 'Quảng bá tin'
            });
        }
        
        // Response time insight
        const pendingApps = applications.filter(app => app.status === 'pending');
        if (pendingApps.length > 10) {
            insights.push({
                type: 'info',
                title: 'Nhiều đơn chờ xử lý',
                description: `Có ${pendingApps.length} đơn ứng tuyển đang chờ xem xét. Hãy xử lý để cải thiện trải nghiệm ứng viên.`,
                action: 'Xem xét đơn'
            });
        }
        
        return insights;
    };

    if (jobsLoading || loading) {
        return (
            <EmployerLayout currentPage="analytics">
                <div className="analytics-dashboard">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải dữ liệu phân tích...</p>
                    </div>
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout currentPage="analytics">
            <div className="analytics-dashboard">
                {/* Header */}
                <div className="analytics-header">
                    <div className="header-content">
                        <h1>Báo cáo & Phân tích</h1>
                        <p>Theo dõi hiệu quả tuyển dụng và tối ưu hóa quy trình</p>
                    </div>
                    
                    <div className="header-controls">
                        <select
                            value={dateRange}
                            onChange={(e) => setDateRange(e.target.value)}
                            className="date-range-select"
                        >
                            <option value="7">7 ngày qua</option>
                            <option value="30">30 ngày qua</option>
                            <option value="90">90 ngày qua</option>
                            <option value="365">1 năm qua</option>
                        </select>
                        
                        <button 
                            className="export-btn"
                            onClick={() => alert('Tính năng xuất báo cáo sẽ được bổ sung')}
                        >
                            📊 Xuất báo cáo
                        </button>
                    </div>
                </div>

                {/* Overview Metrics */}
                <OverviewMetrics data={analyticsData.overview} />

                {/* Charts Grid */}
                <div className="charts-grid">
                    <div className="chart-container">
                        <HiringFunnelChart data={analyticsData.hiringFunnel} />
                    </div>
                    
                    <div className="chart-container">
                        <ApplicationTrendsChart data={analyticsData.applicationTrends} />
                    </div>
                </div>

                {/* Job Performance */}
                <div className="performance-section">
                    <JobPerformanceChart 
                        data={analyticsData.jobPerformance}
                        selectedMetric={selectedMetric}
                        onMetricChange={setSelectedMetric}
                    />
                </div>

                {/* Bottom Grid */}
                <div className="bottom-grid">
                    <div className="table-container">
                        <TopJobsTable data={analyticsData.topJobs} />
                    </div>
                    
                    <div className="insights-container">
                        <RecruitmentInsights data={analyticsData.insights} />
                    </div>
                </div>
            </div>
        </EmployerLayout>
    );
};

export default AnalyticsDashboard;
