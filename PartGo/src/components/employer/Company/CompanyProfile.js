import React, { useState, useEffect } from 'react';
import { useAuth } from '../../../contexts/AuthContext';
import { useNotification } from '../../../contexts/NotificationContext';
import EmployerLayout from '../Layout/EmployerLayout';
import CompanyBasicInfo from './CompanyBasicInfo';
import CompanyBranding from './CompanyBranding';
import CompanyTeam from './CompanyTeam';
import CompanyVerification from './CompanyVerification';
import CompanySettings from './CompanySettings';
import './CompanyProfile.css';

const CompanyProfile = () => {
    const { user } = useAuth();
    const { success, error: showError } = useNotification();
    
    const [activeTab, setActiveTab] = useState('basic');
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    
    const [companyData, setCompanyData] = useState({
        // Basic Info
        name: '',
        description: '',
        website: '',
        industry: '',
        size: '',
        founded: '',
        location: {
            address: '',
            city: '',
            country: 'Vietnam'
        },
        contact: {
            phone: '',
            email: '',
            socialMedia: {
                linkedin: '',
                facebook: '',
                twitter: ''
            }
        },
        
        // Branding
        logo: '',
        coverImage: '',
        brandColors: {
            primary: '#3b82f6',
            secondary: '#64748b'
        },
        
        // Team
        employees: [],
        departments: [],
        
        // Verification
        isVerified: false,
        verificationDocuments: [],
        
        // Settings
        visibility: 'public',
        allowApplications: true,
        autoReply: true,
        notifications: {
            newApplications: true,
            applicationUpdates: true,
            systemUpdates: false
        }
    });

    const tabs = [
        { id: 'basic', label: 'Thông tin cơ bản', icon: '🏢' },
        { id: 'branding', label: 'Thương hiệu', icon: '🎨' },
        { id: 'team', label: 'Đội ngũ', icon: '👥' },
        { id: 'verification', label: 'Xác thực', icon: '✅' },
        { id: 'settings', label: 'Cài đặt', icon: '⚙️' }
    ];

    useEffect(() => {
        loadCompanyData();
    }, []);

    const loadCompanyData = async () => {
        try {
            setLoading(true);
            
            // TODO: Replace with actual API call
            // const response = await companyAPI.getProfile();
            // setCompanyData(response.data);
            
            // Mock data for now
            setTimeout(() => {
                setCompanyData(prev => ({
                    ...prev,
                    name: user?.company?.name || 'Công ty của tôi',
                    email: user?.email || '',
                    description: 'Mô tả về công ty...',
                    industry: 'Công nghệ thông tin',
                    size: '50-100',
                    location: {
                        ...prev.location,
                        city: 'Hồ Chí Minh'
                    }
                }));
                setLoading(false);
            }, 1000);
            
        } catch (error) {
            showError('Lỗi khi tải thông tin công ty: ' + (error.message || 'Unknown error'));
            setLoading(false);
        }
    };

    const handleSave = async (tabData) => {
        try {
            setSaving(true);
            
            const updatedData = {
                ...companyData,
                ...tabData
            };
            
            // TODO: Replace with actual API call
            // await companyAPI.updateProfile(updatedData);
            
            // Mock API call
            await new Promise(resolve => setTimeout(resolve, 1000));
            
            setCompanyData(updatedData);
            success('Đã lưu thông tin thành công!');
            
        } catch (error) {
            showError('Lỗi khi lưu thông tin: ' + (error.message || 'Unknown error'));
        } finally {
            setSaving(false);
        }
    };

    const renderTabContent = () => {
        const commonProps = {
            data: companyData,
            onSave: handleSave,
            loading: saving
        };

        switch (activeTab) {
            case 'basic':
                return <CompanyBasicInfo {...commonProps} />;
            case 'branding':
                return <CompanyBranding {...commonProps} />;
            case 'team':
                return <CompanyTeam {...commonProps} />;
            case 'verification':
                return <CompanyVerification {...commonProps} />;
            case 'settings':
                return <CompanySettings {...commonProps} />;
            default:
                return <CompanyBasicInfo {...commonProps} />;
        }
    };

    if (loading) {
        return (
            <EmployerLayout currentPage="company">
                <div className="company-profile">
                    <div className="loading-container">
                        <div className="loading-spinner"></div>
                        <p>Đang tải thông tin công ty...</p>
                    </div>
                </div>
            </EmployerLayout>
        );
    }

    return (
        <EmployerLayout currentPage="company">
            <div className="company-profile">
                {/* Header */}
                <div className="profile-header">
                    <div className="header-content">
                        <div className="company-avatar">
                            {companyData.logo ? (
                                <img src={companyData.logo} alt={companyData.name} />
                            ) : (
                                <span>{companyData.name?.charAt(0) || 'C'}</span>
                            )}
                        </div>
                        <div className="company-info">
                            <h1>{companyData.name || 'Tên công ty'}</h1>
                            <p className="company-industry">{companyData.industry}</p>
                            <div className="company-meta">
                                <span className="meta-item">
                                    📍 {companyData.location.city}
                                </span>
                                <span className="meta-item">
                                    👥 {companyData.size} nhân viên
                                </span>
                                {companyData.isVerified && (
                                    <span className="meta-item verified">
                                        ✅ Đã xác thực
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                    
                    <div className="header-actions">
                        <button 
                            className="preview-btn"
                            onClick={() => {
                                // TODO: Open company preview
                                alert('Tính năng xem trước sẽ được bổ sung');
                            }}
                        >
                            👁️ Xem trước
                        </button>
                    </div>
                </div>

                {/* Tabs */}
                <div className="profile-tabs">
                    {tabs.map(tab => (
                        <button
                            key={tab.id}
                            className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <span className="tab-icon">{tab.icon}</span>
                            <span className="tab-label">{tab.label}</span>
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                <div className="profile-content">
                    {renderTabContent()}
                </div>
            </div>
        </EmployerLayout>
    );
};

export default CompanyProfile;
