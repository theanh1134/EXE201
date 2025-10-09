import React, { useState, useEffect } from 'react';
import Header from './Header';
import { useAuth } from '../contexts/AuthContext';
import { saveProfile } from '../services/authAPI';
import { fetchApplications } from '../services/jobsAPI';

const UserProfile = ({ onBackToHome, isLoggedIn = false, onRequireLogin, initialTab = 'profile' }) => {
    const { user, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab || 'profile');
    const [cvData, setCvData] = useState({
        objective: 'Mong muốn tìm công việc part-time phù hợp để học hỏi và phát triển tại Hòa Lạc, Hà Nội.',
        experiences: [
            { company: 'Công ty Công nghệ Hòa Lạc', role: 'Trợ lý Marketing', time: '2023 - Hiện tại', details: 'Quản lý nội dung mạng xã hội, hỗ trợ chạy chiến dịch.' }
        ],
        educations: [
            { school: 'Đại học Quốc gia Hà Nội', degree: 'Cử nhân Quản trị Kinh doanh', time: '2016 - 2020' }
        ],
        skills: ['Giao tiếp', 'Làm việc nhóm', 'Tin học văn phòng'],
        certifications: ['IELTS 6.5', 'Google Digital Garage'],
        contacts: { email: '', phone: '', location: '' }
    });

    // CV template selection
    const [selectedTemplate, setSelectedTemplate] = useState('classic');

    const [uploadedCv, setUploadedCv] = useState(null);
    const [cvFileName, setCvFileName] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleCvChange = (path, value) => {
        setCvData(prev => ({ ...prev, [path]: value }));
    };
    const [profileData, setProfileData] = useState({
        fullName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        skills: [],
        experience: [],
        education: [],
        cvUrl: '' // ✅ Thêm field để lưu CV URL
    });

    // Update profile data when user changes
    useEffect(() => {
        if (user) {
            setProfileData(prev => ({
                ...prev,
                fullName: user.fullName || '',
                email: user.email || '',
                phone: user.phone || '',
                location: user.location || '',
                bio: user.bio || '',
                skills: user.skills || [],
                experience: user.experience || [],
                education: user.education || [],
                cvUrl: user.profile?.cvUrl || '' // ✅ Load CV URL từ user profile
            }));

            // ✅ Nếu có CV URL, hiển thị CV đã upload
            if (user.profile?.cvUrl) {
                setCvFileName(user.profile.cvUrl.split('/').pop() || 'CV đã tải lên');
                // Note: uploadedCv sẽ là null vì chúng ta chỉ có URL, không có file object
            }

            // Update CV contacts with user info
            setCvData(prev => ({
                ...prev,
                contacts: {
                    email: user.email || '',
                    phone: user.phone || '',
                    location: user.location || ''
                },
                skills: user.skills || []
            }));
        }
    }, [user]);

    const [savedJobs, setSavedJobs] = useState([]);

    useEffect(() => {
        try {
            const data = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            setSavedJobs(Array.isArray(data) ? data : []);
        } catch (e) {
            setSavedJobs([]);
        }
    }, [isAuthenticated]);

    const removeSavedJob = (id) => {
        try {
            const next = savedJobs.filter(j => j.id !== id);
            setSavedJobs(next);
            localStorage.setItem('savedJobs', JSON.stringify(next));
        } catch (e) { /* noop */ }
    };

    const [applications, setApplications] = useState([]);
    const [selectedApplication, setSelectedApplication] = useState(null);

    useEffect(() => {
        (async () => {
            if (!isAuthenticated) return;
            try {
                const apps = await fetchApplications();
                const mapped = (Array.isArray(apps) ? apps : []).map(a => ({
                    id: a._id || a.id,
                    title: a.job?.title || 'Công việc',
                    company: a.job?.company?.name || a.company?.name || 'Công ty',
                    status: a.status || 'Applied',
                    appliedDate: a.appliedAt ? new Date(a.appliedAt).toLocaleDateString('vi-VN') : '',
                    hourlyRate: a.job?.salary ? `${a.job.salary.min?.toLocaleString()}-${a.job.salary.max?.toLocaleString()} VNĐ/giờ` : '',
                    location: a.job?.location?.address || '',
                    coverLetter: a.coverLetter || '',
                    cvUrl: a.cvUrl || '',
                    raw: a
                }));
                setApplications(mapped);
            } catch (e) {
                // giữ rỗng nếu lỗi
            }
        })();
    }, [isAuthenticated]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({
            ...prev,
            [name]: value
        }));

        // Sync to CV data
        if (name === 'email' || name === 'phone' || name === 'location') {
            setCvData(prev => ({
                ...prev,
                contacts: {
                    ...prev.contacts,
                    [name]: value
                }
            }));
        }

        // Auto-save after 2 seconds
        setTimeout(() => {
            autoSave();
        }, 2000);
    };

    const handleSkillAdd = (skill) => {
        if (skill && !profileData.skills.includes(skill)) {
            setProfileData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));

            // Sync skills to CV data
            setCvData(prev => ({
                ...prev,
                skills: [...prev.skills, skill]
            }));
        }
    };

    const handleSkillRemove = (skillToRemove) => {
        setProfileData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));

        // Sync skills to CV data
        setCvData(prev => ({
            ...prev,
            skills: prev.skills.filter(skill => skill !== skillToRemove)
        }));
    };

    // Save profile function
    const handleSaveProfile = async () => {
        if (!user?.id) {
            setSaveMessage('Lỗi: Không tìm thấy thông tin user');
            return;
        }

        try {
            setIsSaving(true);
            setSaveMessage('');

            const response = await saveProfile(user.id, profileData);
            console.log('Profile saved successfully:', response);

            setSaveMessage('Lưu thành công!');
            setTimeout(() => setSaveMessage(''), 3000);
        } catch (error) {
            console.error('Save profile error:', error);
            setSaveMessage('Lỗi khi lưu: ' + (error.message || 'Unknown error'));
        } finally {
            setIsSaving(false);
        }
    };

    // Auto-save function
    const autoSave = async () => {
        if (!user?.id || !profileData.fullName) return;

        try {
            await saveProfile(user.id, profileData);
            console.log('Auto-save completed');
        } catch (error) {
            console.error('Auto-save error:', error);
        }
    };

    // CV Upload/Download functions
    const handleCvUpload = async (event) => {
        const file = event.target.files[0];
        if (file) {
            // Check file type
            const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowedTypes.includes(file.type)) {
                alert('Chỉ chấp nhận file PDF, DOC hoặc DOCX');
                return;
            }

            // Check file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                alert('File quá lớn. Kích thước tối đa là 5MB');
                return;
            }

            try {
                setIsSaving(true);
                setSaveMessage('Đang tải CV...');

                // ✅ Upload file lên server
                const formData = new FormData();
                formData.append('file', file);

                const response = await fetch('http://localhost:5001/api/upload', {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    },
                    body: formData
                });

                if (!response.ok) {
                    throw new Error('Upload failed');
                }

                const result = await response.json();
                const cvUrl = result.path;

                // ✅ Cập nhật state
                setUploadedCv(file);
                setCvFileName(file.name);

                // ✅ Cập nhật profileData với CV URL
                setProfileData(prev => ({
                    ...prev,
                    cvUrl: cvUrl
                }));

                // ✅ Lưu vào database
                await saveProfile(user.id, { ...profileData, cvUrl: cvUrl });

                setSaveMessage('CV đã được tải lên thành công!');
                setTimeout(() => setSaveMessage(''), 3000);

                console.log('CV uploaded successfully:', cvUrl);
            } catch (error) {
                console.error('CV upload error:', error);
                setSaveMessage('Lỗi khi tải CV: ' + error.message);
                setTimeout(() => setSaveMessage(''), 3000);
            } finally {
                setIsSaving(false);
            }
        }
    };

    const handleCvDownload = () => {
        if (uploadedCv) {
            // ✅ Download file local (vừa upload)
            const url = URL.createObjectURL(uploadedCv);
            const link = document.createElement('a');
            link.href = url;
            link.download = cvFileName;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
        } else if (profileData.cvUrl) {
            // ✅ Download file từ server (đã lưu trước đó)
            const link = document.createElement('a');
            link.href = `http://localhost:5001${profileData.cvUrl}`;
            link.download = cvFileName || 'CV.pdf';
            link.target = '_blank';
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            alert('Chưa có CV để tải xuống');
        }
    };

    const handleCvDelete = () => {
        setUploadedCv(null);
        setCvFileName('');
        // Reset file input
        const fileInput = document.getElementById('cv-upload');
        if (fileInput) fileInput.value = '';
    };

    const generateCvPdf = () => {
        // Create a simple PDF content
        const cvContent = `
CV của ${profileData.fullName || 'Ứng viên'} (${selectedTemplate})

THÔNG TIN CÁ NHÂN
Email: ${profileData.email || ''}
Số điện thoại: ${profileData.phone || ''}
Địa điểm: ${profileData.location || ''}

MỤC TIÊU NGHỀ NGHIỆP
${cvData.objective}

KINH NGHIỆM LÀM VIỆC
${cvData.experiences.map(exp => `${exp.role} tại ${exp.company} (${exp.time})\n${exp.details}`).join('\n\n')}

HỌC VẤN
${cvData.educations.map(edu => `${edu.degree} - ${edu.school} (${edu.time})`).join('\n')}

KỸ NĂNG
${cvData.skills.join(', ')}

CHỨNG CHỈ
${cvData.certifications.join(', ')}
        `;

        // Create and download text file (simple version)
        const blob = new Blob([cvContent], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `CV_${profileData.fullName || 'UngVien'}_${new Date().toISOString().split('T')[0]}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    };

    // Show login required message if not authenticated
    if (!isAuthenticated) {
        return (
            <div>
                <link
                    href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                    rel="stylesheet"
                />
                <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                    <Header
                        onOpenCv={() => window.location.href = '/profile/cv'}
                        onOpenCompanyDashboard={() => window.location.href = '/company-dashboard'}
                        onShowLogin={() => { }}
                        onShowSignUp={() => { }}
                        onLogout={() => window.location.href = '/'}
                    />
                    <div className="container py-5">
                        <div className="row justify-content-center">
                            <div className="col-md-6 text-center">
                                <div className="bg-white p-5 rounded-3 shadow-sm">
                                    <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Vui lòng đăng nhập</h3>
                                    <p className="text-muted mb-4">Bạn cần đăng nhập để xem hồ sơ cá nhân</p>
                                    <button
                                        className="btn px-4 py-2"
                                        style={{
                                            backgroundColor: '#ff6b35',
                                            color: 'white',
                                            border: 'none',
                                            borderRadius: '8px',
                                            fontWeight: '500'
                                        }}
                                        onClick={() => window.location.href = '/'}
                                    >
                                        Về trang chủ
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {/* Header */}
                <Header
                    onOpenCv={() => window.location.href = '/profile/cv'}
                    onOpenCompanyDashboard={() => window.location.href = '/company-dashboard'}
                    onShowLogin={() => { }}
                    onShowSignUp={() => { }}
                    onLogout={() => window.location.href = '/'}
                />

                {/* Main Content */}
                <div className="container py-4">
                    {/* Page Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Hồ sơ của tôi</h1>
                            <p className="text-muted mb-0">Quản lý hồ sơ và đơn ứng tuyển của bạn</p>
                        </div>
                        <div className="d-flex gap-2">
                            <button
                                className="btn px-4 py-2"
                                style={{
                                    backgroundColor: '#ff6b35',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500'
                                }}
                                onClick={handleSaveProfile}
                                disabled={isSaving}
                            >
                                {isSaving ? 'Đang lưu...' : 'Lưu hồ sơ'}
                            </button>
                            <button
                                className="btn px-4 py-2"
                                style={{
                                    backgroundColor: '#6c757d',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '8px',
                                    fontWeight: '500'
                                }}
                            >
                                Chỉnh sửa hồ sơ
                            </button>
                        </div>
                    </div>

                    {/* Save Message */}
                    {saveMessage && (
                        <div className={`alert ${saveMessage.includes('Lỗi') ? 'alert-danger' : 'alert-success'} mb-4`} role="alert">
                            {saveMessage}
                        </div>
                    )}

                    {/* Profile Header */}
                    <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                        <div className="row align-items-center">
                            <div className="col-md-2">
                                <div
                                    className="d-flex align-items-center justify-content-center rounded-circle mx-auto"
                                    style={{
                                        width: '100px',
                                        height: '100px',
                                        backgroundColor: '#ff6b35',
                                        fontSize: '2.5rem',
                                        color: 'white'
                                    }}
                                >
                                    👤
                                </div>
                            </div>
                            <div className="col-md-6">
                                <h3 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
                                    {profileData.fullName}
                                </h3>
                                <p className="text-muted mb-2">{profileData.email}</p>
                                <p className="text-muted mb-0">{profileData.location}</p>
                            </div>
                            <div className="col-md-4 text-md-end">
                                <div className="d-flex flex-column gap-2">
                                    <span className="badge px-3 py-2" style={{
                                        backgroundColor: '#e8f5e8',
                                        color: '#2e7d32',
                                        borderRadius: '20px',
                                        fontSize: '14px'
                                    }}>
                                        Hồ sơ đã hoàn thiện
                                    </span>
                                    <small className="text-muted">Thành viên từ 2023</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Tabs */}
                    <div className="mb-4">
                        <ul className="nav nav-tabs border-0">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'profile' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('profile')}
                                    style={{
                                        border: 'none',
                                        backgroundColor: activeTab === 'profile' ? '#ff6b35' : 'transparent',
                                        color: activeTab === 'profile' ? 'white' : '#6c757d',
                                        borderRadius: '8px 8px 0 0',
                                        marginRight: '4px'
                                    }}
                                >
                                    Hồ sơ
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'applications' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('applications')}
                                    style={{
                                        border: 'none',
                                        backgroundColor: activeTab === 'applications' ? '#ff6b35' : 'transparent',
                                        color: activeTab === 'applications' ? 'white' : '#6c757d',
                                        borderRadius: '8px 8px 0 0',
                                        marginRight: '4px'
                                    }}
                                >
                                    Đơn ứng tuyển
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'saved' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('saved')}
                                    style={{
                                        border: 'none',
                                        backgroundColor: activeTab === 'saved' ? '#ff6b35' : 'transparent',
                                        color: activeTab === 'saved' ? 'white' : '#6c757d',
                                        borderRadius: '8px 8px 0 0'
                                    }}
                                >
                                    Việc làm đã lưu
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${activeTab === 'cv' ? 'active' : ''}`}
                                    onClick={() => setActiveTab('cv')}
                                    style={{
                                        border: 'none',
                                        backgroundColor: activeTab === 'cv' ? '#ff6b35' : 'transparent',
                                        color: activeTab === 'cv' ? 'white' : '#6c757d',
                                        borderRadius: '8px 8px 0 0'
                                    }}
                                >
                                    Tạo CV
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Tab Content */}
                    {activeTab === 'profile' && (
                        <div className="row">
                            {/* Profile Information */}
                            <div className="col-lg-8">
                                <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Thông tin cá nhân</h5>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Họ và tên</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={profileData.fullName}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={profileData.email}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="row">
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Số điện thoại</label>
                                            <input
                                                type="tel"
                                                className="form-control"
                                                name="phone"
                                                value={profileData.phone}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                        <div className="col-md-6 mb-3">
                                            <label className="form-label fw-medium">Địa điểm</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="location"
                                                value={profileData.location}
                                                onChange={handleInputChange}
                                            />
                                        </div>
                                    </div>

                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Giới thiệu</label>
                                        <textarea
                                            className="form-control"
                                            name="bio"
                                            value={profileData.bio}
                                            onChange={handleInputChange}
                                            rows="4"
                                        ></textarea>
                                    </div>
                                </div>

                                {/* Skills */}
                                <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Kỹ năng</h5>
                                    <div className="d-flex flex-wrap gap-2 mb-3">
                                        {profileData.skills.map((skill, index) => (
                                            <span
                                                key={index}
                                                className="badge px-3 py-2 d-flex align-items-center gap-2"
                                                style={{
                                                    backgroundColor: '#e3f2fd',
                                                    color: '#1976d2',
                                                    borderRadius: '20px',
                                                    fontSize: '14px'
                                                }}
                                            >
                                                {skill}
                                                <button
                                                    type="button"
                                                    className="btn-close btn-close-white"
                                                    style={{ fontSize: '10px' }}
                                                    onClick={() => handleSkillRemove(skill)}
                                                ></button>
                                            </span>
                                        ))}
                                    </div>
                                    <div className="d-flex gap-2">
                                        <input
                                            type="text"
                                            className="form-control"
                                            placeholder="Thêm kỹ năng"
                                            onKeyPress={(e) => {
                                                if (e.key === 'Enter') {
                                                    handleSkillAdd(e.target.value);
                                                    e.target.value = '';
                                                }
                                            }}
                                        />
                                        <button
                                            className="btn btn-outline-primary"
                                            onClick={(e) => {
                                                const input = e.target.previousElementSibling;
                                                handleSkillAdd(input.value);
                                                input.value = '';
                                            }}
                                        >
                                            Thêm
                                        </button>
                                    </div>
                                </div>

                                {/* Experience */}
                                <div className="bg-white p-4 rounded-3 shadow-sm">
                                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Kinh nghiệm làm việc</h5>
                                    {profileData.experience.map((exp, index) => (
                                        <div key={index} className="border-start border-3 border-primary ps-3 mb-4">
                                            <h6 className="fw-bold mb-1">{exp.title}</h6>
                                            <p className="text-muted mb-1">{exp.company} • {exp.duration}</p>
                                            <p className="text-muted small">{exp.description}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Sidebar */}
                            <div className="col-lg-4">
                                {/* Quick Stats */}
                                <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Thống kê nhanh</h6>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Đơn ứng tuyển</span>
                                        <span className="fw-medium">{applications.length}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Việc làm đã lưu</span>
                                        <span className="fw-medium">{savedJobs.length}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Lượt xem hồ sơ</span>
                                        <span className="fw-medium">24</span>
                                    </div>
                                </div>

                                {/* CV Upload */}
                                <div className="bg-white p-4 rounded-3 shadow-sm">
                                    <h6 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Sơ yếu lý lịch (CV)</h6>

                                    {!uploadedCv && !profileData.cvUrl ? (
                                        <div
                                            className="border border-dashed p-3 text-center rounded"
                                            style={{ borderColor: '#ff6b35' }}
                                        >
                                            <span style={{ color: '#ff6b35', fontSize: '1.5rem' }}>📄</span>
                                            <p className="text-muted small mb-2">Tải lên CV của bạn</p>
                                            <p className="text-muted small mb-2">Hỗ trợ: PDF, DOC, DOCX (tối đa 5MB)</p>
                                            <input
                                                type="file"
                                                id="cv-upload"
                                                accept=".pdf,.doc,.docx"
                                                onChange={handleCvUpload}
                                                style={{ display: 'none' }}
                                            />
                                            <button
                                                className="btn btn-sm"
                                                style={{
                                                    backgroundColor: '#ff6b35',
                                                    color: 'white',
                                                    border: 'none'
                                                }}
                                                onClick={() => document.getElementById('cv-upload').click()}
                                            >
                                                Chọn tệp
                                            </button>
                                        </div>
                                    ) : (
                                        <div className="border rounded p-3" style={{ borderColor: '#28a745' }}>
                                            <div className="d-flex align-items-center justify-content-between">
                                                <div>
                                                    <span style={{ color: '#28a745', fontSize: '1.2rem' }}>✅</span>
                                                    <span className="ms-2 fw-medium">{cvFileName}</span>
                                                </div>
                                                <div className="d-flex gap-2">
                                                    <button
                                                        className="btn btn-sm btn-outline-success"
                                                        onClick={handleCvDownload}
                                                    >
                                                        Tải xuống
                                                    </button>
                                                    <button
                                                        className="btn btn-sm btn-outline-danger"
                                                        onClick={handleCvDelete}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="mt-3">
                                        <button
                                            className="btn btn-sm btn-outline-primary w-100"
                                            onClick={generateCvPdf}
                                        >
                                            Tạo CV từ thông tin
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'applications' && (
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Đơn ứng tuyển của tôi</h5>
                            <div className="table-responsive">
                                <table className="table table-hover">
                                    <thead>
                                        <tr>
                                            <th>Chức danh</th>
                                            <th>Công ty</th>
                                            <th>Lương theo giờ</th>
                                            <th>Ngày ứng tuyển</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {applications.map((app) => (
                                            <tr key={app.id}>
                                                <td className="fw-medium">{app.title}</td>
                                                <td>{app.company}</td>
                                                <td>{app.hourlyRate}</td>
                                                <td>{app.appliedDate}</td>
                                                <td>
                                                    <span
                                                        className="badge px-3 py-2"
                                                        style={{
                                                            backgroundColor: app.status === 'Applied' ? '#e3f2fd' :
                                                                app.status === 'Under Review' ? '#fff3e0' : '#e8f5e8',
                                                            color: app.status === 'Applied' ? '#1976d2' :
                                                                app.status === 'Under Review' ? '#f57c00' : '#388e3c',
                                                            borderRadius: '20px'
                                                        }}
                                                    >
                                                        {app.status === 'Applied' ? 'Đã nộp' : app.status === 'Under Review' ? 'Đang xét duyệt' : 'Phỏng vấn đã lên lịch'}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button className="btn btn-sm btn-outline-primary" onClick={() => setSelectedApplication(app)}>
                                                        Xem
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {selectedApplication && (
                        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                            <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '640px' }}>
                                <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
                                    <div className="modal-header border-0">
                                        <h5 className="modal-title fw-bold">Chi tiết đơn ứng tuyển</h5>
                                        <button type="button" className="btn-close" onClick={() => setSelectedApplication(null)}></button>
                                    </div>
                                    <div className="modal-body">
                                        <div className="mb-2"><strong>Công việc:</strong> {selectedApplication.title}</div>
                                        <div className="mb-2"><strong>Công ty:</strong> {selectedApplication.company}</div>
                                        <div className="mb-2"><strong>Địa điểm:</strong> {selectedApplication.location}</div>
                                        <div className="mb-2"><strong>Trạng thái:</strong> {selectedApplication.status}</div>
                                        <div className="mb-2"><strong>Ngày ứng tuyển:</strong> {selectedApplication.appliedDate}</div>
                                        {selectedApplication.hourlyRate && <div className="mb-2"><strong>Lương theo giờ:</strong> {selectedApplication.hourlyRate}</div>}
                                        {selectedApplication.coverLetter && (
                                            <div className="mb-2">
                                                <strong>Thư ứng tuyển:</strong>
                                                <div className="border rounded p-2 mt-1" style={{ whiteSpace: 'pre-wrap' }}>{selectedApplication.coverLetter}</div>
                                            </div>
                                        )}
                                        {selectedApplication.cvUrl && (
                                            <a href={selectedApplication.cvUrl} target="_blank" rel="noreferrer" className="btn btn-sm btn-outline-success">Xem CV</a>
                                        )}
                                    </div>
                                    <div className="modal-footer border-0">
                                        <button className="btn btn-secondary" onClick={() => setSelectedApplication(null)}>Đóng</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'saved' && (
                        <div className="bg-white p-4 rounded-3 shadow-sm">
                            <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Việc làm đã lưu</h5>
                            <div className="row">
                                {savedJobs.map((job) => (
                                    <div key={job.id} className="col-md-6 mb-3">
                                        <div className="border rounded-3 p-3 h-100">
                                            <h6 className="fw-bold mb-2">{job.title}</h6>
                                            <p className="text-muted mb-2">{job.company} • {job.location}</p>
                                            <p className="fw-medium mb-2" style={{ color: '#ff6b35' }}>{job.hourlyRate}</p>
                                            <div className="d-flex justify-content-between align-items-center">
                                                <small className="text-muted">Đã lưu {job.savedDate}</small>
                                                <div>
                                                    <button className="btn btn-sm btn-outline-primary me-2">
                                                        Ứng tuyển
                                                    </button>
                                                    <button className="btn btn-sm btn-outline-danger" onClick={() => removeSavedJob(job.id)}>Xóa</button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'cv' && (
                        <div className="row">
                            {/* CV Form */}
                            <div className="col-lg-6">
                                <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                    <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Thông tin CV</h5>

                                    {/* Template selector */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Chọn mẫu CV</label>
                                        <div className="d-flex flex-wrap gap-2">
                                            {[
                                                { id: 'classic', name: 'Classic' },
                                                { id: 'modern', name: 'Modern' },
                                                { id: 'minimal', name: 'Minimal' },
                                                { id: 'creative', name: 'Creative' }
                                            ].map(t => (
                                                <button
                                                    key={t.id}
                                                    type="button"
                                                    className={`btn btn-sm ${selectedTemplate === t.id ? 'btn-primary' : 'btn-outline-secondary'}`}
                                                    onClick={() => setSelectedTemplate(t.id)}
                                                    style={{ borderRadius: '20px' }}
                                                >
                                                    {t.name}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Objective */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Mục tiêu nghề nghiệp</label>
                                        <textarea
                                            className="form-control"
                                            rows="3"
                                            value={cvData.objective}
                                            onChange={(e) => handleCvChange('objective', e.target.value)}
                                        />
                                    </div>

                                    {/* Experiences */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Kinh nghiệm</label>
                                        {cvData.experiences.map((exp, idx) => (
                                            <div key={idx} className="border rounded p-3 mb-2">
                                                <div className="row g-2">
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={exp.company} onChange={(e) => {
                                                            const arr = [...cvData.experiences];
                                                            arr[idx] = { ...arr[idx], company: e.target.value };
                                                            handleCvChange('experiences', arr);
                                                        }} placeholder="Công ty" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={exp.role} onChange={(e) => {
                                                            const arr = [...cvData.experiences];
                                                            arr[idx] = { ...arr[idx], role: e.target.value };
                                                            handleCvChange('experiences', arr);
                                                        }} placeholder="Vị trí" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={exp.time} onChange={(e) => {
                                                            const arr = [...cvData.experiences];
                                                            arr[idx] = { ...arr[idx], time: e.target.value };
                                                            handleCvChange('experiences', arr);
                                                        }} placeholder="Thời gian" />
                                                    </div>
                                                    <div className="col-12">
                                                        <textarea className="form-control" rows="2" value={exp.details} onChange={(e) => {
                                                            const arr = [...cvData.experiences];
                                                            arr[idx] = { ...arr[idx], details: e.target.value };
                                                            handleCvChange('experiences', arr);
                                                        }} placeholder="Mô tả" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleCvChange('experiences', [...cvData.experiences, { company: '', role: '', time: '', details: '' }])}>+ Thêm kinh nghiệm</button>
                                    </div>

                                    {/* Education */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Học vấn</label>
                                        {cvData.educations.map((edu, idx) => (
                                            <div key={idx} className="border rounded p-3 mb-2">
                                                <div className="row g-2">
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={edu.school} onChange={(e) => {
                                                            const arr = [...cvData.educations];
                                                            arr[idx] = { ...arr[idx], school: e.target.value };
                                                            handleCvChange('educations', arr);
                                                        }} placeholder="Trường" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={edu.degree} onChange={(e) => {
                                                            const arr = [...cvData.educations];
                                                            arr[idx] = { ...arr[idx], degree: e.target.value };
                                                            handleCvChange('educations', arr);
                                                        }} placeholder="Bằng cấp" />
                                                    </div>
                                                    <div className="col-md-6">
                                                        <input className="form-control" value={edu.time} onChange={(e) => {
                                                            const arr = [...cvData.educations];
                                                            arr[idx] = { ...arr[idx], time: e.target.value };
                                                            handleCvChange('educations', arr);
                                                        }} placeholder="Thời gian" />
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                        <button className="btn btn-sm btn-outline-primary" onClick={() => handleCvChange('educations', [...cvData.educations, { school: '', degree: '', time: '' }])}>+ Thêm học vấn</button>
                                    </div>

                                    {/* Skills */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Kỹ năng</label>
                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            {cvData.skills.map((s, i) => (
                                                <span key={i} className="badge bg-light text-dark border">{s}</span>
                                            ))}
                                        </div>
                                        <div className="d-flex gap-2">
                                            <input className="form-control" placeholder="Thêm kỹ năng" onKeyDown={(e) => {
                                                if (e.key === 'Enter' && e.target.value.trim()) {
                                                    handleCvChange('skills', [...cvData.skills, e.target.value.trim()]);
                                                    e.target.value = '';
                                                }
                                            }} />
                                        </div>
                                    </div>

                                    {/* Certifications */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Chứng chỉ</label>
                                        <div className="d-flex flex-wrap gap-2 mb-2">
                                            {cvData.certifications.map((c, i) => (
                                                <span key={i} className="badge bg-light text-dark border">{c}</span>
                                            ))}
                                        </div>
                                        <input className="form-control" placeholder="Thêm chứng chỉ" onKeyDown={(e) => {
                                            if (e.key === 'Enter' && e.target.value.trim()) {
                                                handleCvChange('certifications', [...cvData.certifications, e.target.value.trim()]);
                                                e.target.value = '';
                                            }
                                        }} />
                                    </div>

                                    {/* Contacts */}
                                    <div className="mb-2">
                                        <label className="form-label fw-medium">Liên hệ</label>
                                        <div className="row g-2">
                                            <div className="col-md-4"><input className="form-control" value={cvData.contacts.email} onChange={(e) => handleCvChange('contacts', { ...cvData.contacts, email: e.target.value })} placeholder="Email" /></div>
                                            <div className="col-md-4"><input className="form-control" value={cvData.contacts.phone} onChange={(e) => handleCvChange('contacts', { ...cvData.contacts, phone: e.target.value })} placeholder="Điện thoại" /></div>
                                            <div className="col-md-4"><input className="form-control" value={cvData.contacts.location} onChange={(e) => handleCvChange('contacts', { ...cvData.contacts, location: e.target.value })} placeholder="Địa điểm" /></div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* CV Preview */}
                            <div className="col-lg-6">
                                {(() => {
                                    const stylesByTemplate = {
                                        classic: { headerBg: '#ffffff', headerColor: '#2c3e50', accent: '#2c3e50', borderTop: '#2c3e50' },
                                        modern: { headerBg: '#1f2937', headerColor: '#ffffff', accent: '#ff6b35', borderTop: '#ff6b35' },
                                        minimal: { headerBg: '#ffffff', headerColor: '#111827', accent: '#6b7280', borderTop: '#e5e7eb' },
                                        creative: { headerBg: '#fff7ed', headerColor: '#9a3412', accent: '#ef4444', borderTop: '#f97316' }
                                    };
                                    const s = stylesByTemplate[selectedTemplate] || stylesByTemplate.classic;
                                    return (
                                        <div className="p-4 rounded-3 shadow-sm mb-3" id="cv-preview" style={{ backgroundColor: '#ffffff', borderTop: `4px solid ${s.borderTop}` }}>
                                            <div className="d-flex justify-content-between align-items-center mb-3" style={{ backgroundColor: s.headerBg, padding: '8px 12px', borderRadius: '6px' }}>
                                                <h4 className="fw-bold mb-0" style={{ color: s.headerColor }}>{profileData.fullName || user?.fullName || 'Họ và tên'}</h4>
                                                <div className="text-end small" style={{ color: s.accent }}>
                                                    <div>{cvData.contacts.email}</div>
                                                    <div>{cvData.contacts.phone}</div>
                                                    <div>{cvData.contacts.location}</div>
                                                </div>
                                            </div>
                                            <hr />
                                            <h6 className="fw-bold" style={{ color: s.accent }}>Mục tiêu nghề nghiệp</h6>
                                            <p className="text-muted" style={{ lineHeight: '1.6' }}>{cvData.objective}</p>

                                            <h6 className="fw-bold" style={{ color: s.accent }}>Kinh nghiệm</h6>
                                            {cvData.experiences.map((exp, i) => (
                                                <div key={i} className="mb-2">
                                                    <div className="fw-medium" style={{ color: '#2c3e50' }}>{exp.role} • {exp.company}</div>
                                                    <small className="text-muted">{exp.time}</small>
                                                    <div className="text-muted">{exp.details}</div>
                                                </div>
                                            ))}

                                            <h6 className="fw-bold mt-3" style={{ color: s.accent }}>Học vấn</h6>
                                            {cvData.educations.map((edu, i) => (
                                                <div key={i} className="mb-2">
                                                    <div className="fw-medium" style={{ color: '#2c3e50' }}>{edu.degree} • {edu.school}</div>
                                                    <small className="text-muted">{edu.time}</small>
                                                </div>
                                            ))}

                                            <h6 className="fw-bold mt-3" style={{ color: s.accent }}>Kỹ năng</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {cvData.skills.map((skill, i) => (
                                                    <span key={i} className="badge bg-light text-dark border">{skill}</span>
                                                ))}
                                            </div>

                                            <h6 className="fw-bold mt-3" style={{ color: s.accent }}>Chứng chỉ</h6>
                                            <div className="d-flex flex-wrap gap-2">
                                                {cvData.certifications.map((c, i) => (
                                                    <span key={i} className="badge bg-light text-dark border">{c}</span>
                                                ))}
                                            </div>
                                        </div>
                                    );
                                })()}

                                <div className="text-end">
                                    <button
                                        className="btn"
                                        onClick={() => window.print()}
                                        style={{ backgroundColor: '#ff6b35', color: 'white' }}
                                    >
                                        Xuất/In CV
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default UserProfile;
