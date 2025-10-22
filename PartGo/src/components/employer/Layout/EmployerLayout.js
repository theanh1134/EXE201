import React, { useState } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import Header from '../../Header';
import PartGOFooter from '../../PartGOFooter ';
import './EmployerLayout.css';

const EmployerLayout = ({ children, currentPage = 'dashboard' }) => {
    const { user, logout } = useAuth();
    const { success } = useNotification();
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

    const menuItems = [
        {
            id: 'dashboard',
            label: 'Dashboard',
            icon: '📊',
            path: '/company-dashboard',
            description: 'Tổng quan và thống kê'
        },
        {
            id: 'jobs',
            label: 'Quản lý tin tuyển dụng',
            icon: '💼',
            path: '/company-dashboard/jobs',
            description: 'Tạo và quản lý tin đăng'
        },
        {
            id: 'applications',
            label: 'Quản lý ứng viên',
            icon: '👥',
            path: '/company-dashboard/applications',
            description: 'Xem và xử lý hồ sơ'
        },
        {
            id: 'analytics',
            label: 'Báo cáo & Phân tích',
            icon: '📈',
            path: '/company-dashboard/analytics',
            description: 'Hiệu quả tuyển dụng'
        },
        {
            id: 'company',
            label: 'Thông tin công ty',
            icon: '🏢',
            path: '/company-dashboard/company',
            description: 'Hồ sơ và cài đặt'
        },
        {
            id: 'templates',
            label: 'Mẫu tin tuyển dụng',
            icon: '📝',
            path: '/company-dashboard/templates',
            description: 'Tạo và quản lý mẫu'
        }
    ];

    const handleMenuClick = (path) => {
        window.location.href = path;
    };

    const toggleSidebar = () => {
        setSidebarCollapsed(!sidebarCollapsed);
    };

    return (
        <div className="employer-layout">
            <Header />
            
            <div className="employer-main">
                {/* Sidebar */}
                <aside className={`employer-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                    <div className="sidebar-header">
                        <div className="company-info">
                            {!sidebarCollapsed && (
                                <>
                                    <div className="company-avatar">
                                        {user?.companyName?.charAt(0) || 'C'}
                                    </div>
                                    <div className="company-details">
                                        <h3>{user?.companyName || 'Công ty'}</h3>
                                        <p>{user?.fullName}</p>
                                    </div>
                                </>
                            )}
                        </div>
                        <button 
                            className="sidebar-toggle"
                            onClick={toggleSidebar}
                            title={sidebarCollapsed ? 'Mở rộng' : 'Thu gọn'}
                        >
                            {sidebarCollapsed ? '→' : '←'}
                        </button>
                    </div>

                    <nav className="sidebar-nav">
                        {menuItems.map(item => (
                            <button
                                key={item.id}
                                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                                onClick={() => handleMenuClick(item.path)}
                                title={sidebarCollapsed ? item.label : ''}
                            >
                                <span className="nav-icon">{item.icon}</span>
                                {!sidebarCollapsed && (
                                    <div className="nav-content">
                                        <span className="nav-label">{item.label}</span>
                                        <span className="nav-description">{item.description}</span>
                                    </div>
                                )}
                            </button>
                        ))}
                    </nav>

                    <div className="sidebar-footer">
                        {!sidebarCollapsed && (
                            <div className="quick-actions">
                                <button 
                                    className="quick-action-btn primary"
                                    onClick={() => handleMenuClick('/company-dashboard/jobs/create')}
                                >
                                    <span>➕</span>
                                    Đăng tin mới
                                </button>
                                <button 
                                    className="quick-action-btn secondary"
                                    onClick={() => handleMenuClick('/company-dashboard/applications')}
                                >
                                    <span>👁️</span>
                                    Xem ứng viên
                                </button>
                            </div>
                        )}
                    </div>
                </aside>

                {/* Main Content */}
                <main className={`employer-content ${sidebarCollapsed ? 'expanded' : ''}`}>
                    <div className="content-wrapper">
                        {children}
                    </div>
                </main>
            </div>

            
        </div>
    );
};

export default EmployerLayout;
