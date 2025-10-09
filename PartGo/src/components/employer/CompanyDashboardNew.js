import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EmployerLayout from './Layout/EmployerLayout';
import DashboardOverview from './Dashboard/DashboardOverview';

const CompanyDashboardNew = () => {
    const { user } = useAuth();

    // Redirect if not employer
    if (!user || user.role !== 'employer') {
        return (
            <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                alignItems: 'center', 
                minHeight: '100vh',
                flexDirection: 'column',
                gap: '16px'
            }}>
                <h2>Không có quyền truy cập</h2>
                <p>Bạn cần đăng nhập với tài khoản nhà tuyển dụng để truy cập trang này.</p>
                <button 
                    onClick={() => window.location.href = '/'}
                    style={{
                        padding: '12px 24px',
                        background: '#3b82f6',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: 'pointer'
                    }}
                >
                    Về trang chủ
                </button>
            </div>
        );
    }

    return (
        <EmployerLayout currentPage="dashboard">
            <DashboardOverview />
        </EmployerLayout>
    );
};

export default CompanyDashboardNew;
