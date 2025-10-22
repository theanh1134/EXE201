import React, { useState } from 'react';
import Header from './Header';
import hero1 from '../assets/image/a9d9db7d678459301c73b7cd47eee4e5.jpg';
import PartGOFooter from './PartGOFooter ';
import { useAuth } from '../contexts/AuthContext';
const PartGOHomepage = ({ onShowAllJobs, onOpenCv, onOpenCompanyDashboard, onViewJobDetail, onShowLogin, onShowSignUp }) => {
    const { isAuthenticated } = useAuth();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [location, setLocation] = useState('');

    const handleShowAllJobs = () => {
        if (!isAuthenticated) {
            onShowLogin();
        } else {
            onShowAllJobs();
        }
    };

    const categories = [
        { name: 'Bán hàng', jobs: '156 việc làm', icon: '🛒', color: '#f8f9fa' },
        { name: 'Phục vụ', jobs: '89 việc làm', icon: '🍽️', color: '#f8f9fa' },
        { name: 'Gia sư', jobs: '67 việc làm', icon: '📚', color: '#ff6b35', featured: true },
        { name: 'Văn phòng', jobs: '134 việc làm', icon: '💼', color: '#f8f9fa' },
        { name: 'Công nghệ', jobs: '45 việc làm', icon: '💻', color: '#f8f9fa' },
        { name: 'Marketing', jobs: '78 việc làm', icon: '📢', color: '#f8f9fa' },
        { name: 'Dịch vụ', jobs: '92 việc làm', icon: '🔧', color: '#f8f9fa' },
        { name: 'Giáo dục', jobs: '56 việc làm', icon: '👨‍🏫', color: '#f8f9fa' }
    ];

    const featuredJobs = [
        {
            title: 'Nhân viên bán hàng',
            company: 'Siêu thị Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tìm kiếm nhân viên bán hàng part time tại siêu thị Hòa Lạc.',
            logo: '🛒'
        },
        {
            title: 'Gia sư Toán',
            company: 'Trung tâm Gia sư Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển gia sư dạy Toán cho học sinh cấp 2, cấp 3.',
            logo: '📚'
        },
        {
            title: 'Nhân viên phục vụ',
            company: 'Quán cà phê Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên phục vụ part time tại quán cà phê.',
            logo: '☕'
        },
        {
            title: 'Nhân viên văn phòng',
            company: 'Công ty TNHH Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên văn phòng part time làm việc linh hoạt.',
            logo: '💼'
        },
        {
            title: 'Nhân viên giao hàng',
            company: 'Shopee Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên giao hàng part time cho khu vực Hòa Lạc.',
            logo: '🚚'
        },
        {
            title: 'Nhân viên bảo vệ',
            company: 'Khu công nghiệp Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên bảo vệ part time ca đêm.',
            logo: '🛡️'
        },
        {
            title: 'Nhân viên marketing',
            company: 'Công ty Du lịch Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên marketing part time cho công ty du lịch.',
            logo: '📢'
        },
        {
            title: 'Nhân viên IT',
            company: 'Công ty Công nghệ Hòa Lạc',
            location: 'Hòa Lạc, Hà Nội',
            tags: ['PART TIME'],
            description: 'Tuyển nhân viên IT part time hỗ trợ kỹ thuật.',
            logo: '💻'
        }
    ];

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
                    onOpenCv={onOpenCv}
                    onOpenCompanyDashboard={onOpenCompanyDashboard}
                    onShowLogin={onShowLogin}
                    onShowSignUp={onShowSignUp}
                />
                {/* Hero Section */}
                <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4" style={{ color: '#2c3e50' }}>
                                Khám phá<br />
                                hơn<br />
                                <span style={{ color: '#ff6b35' }}>1000+</span><br />
                                <span style={{ color: '#ff6b35' }}>Việc làm Part Time</span>
                            </h1>
                            <div style={{ width: '100px', height: '4px', backgroundColor: '#ff6b35', marginBottom: '2rem' }}></div>
                            <p className="lead mb-4" style={{ color: '#6c757d' }}>
                                Nền tảng tuyệt vời cho những người tìm việc làm part time tại Hòa Lạc, Hà Nội. Tìm kiếm cơ hội việc làm linh hoạt phù hợp với lịch trình của bạn.
                            </p>

                            {/* Search Form */}
                            <div
                                className="bg-white p-4 rounded-3 mb-4"
                                style={{
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                            >
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-5">
                                        <div className="d-flex align-items-center px-4 py-3" style={{ borderRight: '1px solid #f1f3f4' }}>
                                            <div className="me-3" style={{ color: '#6c757d', fontSize: '18px' }}>
                                                🔍
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium mb-1" style={{ fontSize: '14px', color: '#2c3e50' }}>
                                                    Tìm gì
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control border-0 p-0"
                                                    placeholder="Chức danh, từ khóa..."
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    style={{
                                                        fontSize: '16px',
                                                        color: '#495057',
                                                        backgroundColor: 'transparent',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="d-flex align-items-center px-4 py-3">
                                            <div className="me-3" style={{ color: '#6c757d', fontSize: '18px' }}>
                                                📍
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium mb-1" style={{ fontSize: '14px', color: '#2c3e50' }}>
                                                    Ở đâu
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control border-0 p-0"
                                                    placeholder="Hòa Lạc, Hà Nội"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    style={{
                                                        fontSize: '16px',
                                                        color: '#495057',
                                                        backgroundColor: 'transparent',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="px-2">
                                            <button
                                                className="btn w-100 d-flex align-items-center justify-content-center"
                                                style={{
                                                    backgroundColor: '#ff6b35',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    borderRadius: '12px',
                                                    padding: '14px 20px',
                                                    fontSize: '18px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#e55a2b';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                    e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#ff6b35';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                                                }}
                                            >
                                                🔍
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted small">
                                Phổ biến: Nhân viên bán hàng, Nhân viên phục vụ, Gia sư, Nhân viên văn phòng
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <div className="rounded-4 overflow-hidden shadow" style={{ height: '400px' }}>
                                    <img src={hero1} alt="Hòa Lạc Part Time" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <h2 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                Khám phá theo <span style={{ color: '#ff6b35' }}>danh mục</span>
                            </h2>
                        </div>
                        <div className="col-auto">
                            <button
                                onClick={handleShowAllJobs}
                                className="btn btn-link text-decoration-none p-0"
                                style={{ color: '#ff6b35' }}
                            >
                                Xem tất cả việc làm →
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {categories.map((category, index) => (
                            <div key={index} className="col-lg-3 col-md-6">
                                <div
                                    className="p-4 rounded shadow-sm h-100 d-flex flex-column"
                                    style={{
                                        backgroundColor: category.featured ? '#ff6b35' : '#ffffff',
                                        color: category.featured ? '#ffffff' : '#2c3e50',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease'
                                    }}
                                >
                                    <div className="mb-3" style={{ fontSize: '2rem' }}>
                                        {category.icon}
                                    </div>
                                    <h5 className="fw-bold mb-2">{category.name}</h5>
                                    <p className="mb-0 small" style={{ opacity: 0.8 }}>
                                        {category.jobs} →
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start Posting Section */}
                <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="p-5 rounded" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                                <h2 className="fw-bold mb-4">
                                    Bắt đầu<br />
                                    đăng tuyển<br />
                                    việc làm<br />
                                    ngay hôm nay
                                </h2>
                                <p className="mb-4">
                                    Đăng tuyển việc làm part time tại Hòa Lạc miễn phí.
                                </p>
                                <button className="btn btn-light px-4 py-2" style={{ fontWeight: '500' }}>
                                    Đăng ký miễn phí
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-white p-4 rounded shadow">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="me-3">
                                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}></div>
                                    </div>
                                    <div>
                                        <h6 className="mb-0">Chào buổi sáng, Admin</h6>
                                        <small className="text-muted">Tình trạng việc làm của bạn</small>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#2c3e50' }}>1,247</div>
                                        <small className="text-muted">Việc làm đang tuyển</small>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#ff6b35' }}>89</div>
                                        <small className="text-muted">Công ty</small>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#2c3e50' }}>156</div>
                                        <small className="text-muted">Ứng viên mới</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Employer Benefits Section */}
                <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <h2 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                Lợi ích dành cho <span style={{ color: '#ff6b35' }}>nhà tuyển dụng</span>
                            </h2>
                            <p className="text-muted mt-2 mb-0">Tiếp cận nhanh ứng viên part-time tại Hòa Lạc, tối ưu hoá tuyển dụng theo ca phù hợp.</p>
                        </div>
                        <div className="col-auto">
                            <button
                                className="btn px-4 py-2"
                                style={{ backgroundColor: '#ff6b35', color: 'white', border: 'none', borderRadius: '8px', fontWeight: 500 }}
                                onClick={onOpenCompanyDashboard}
                            >
                                Mở bảng điều khiển
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded shadow-sm h-100 bg-white">
                                <div className="mb-3" style={{ fontSize: '2rem' }}>🎯</div>
                                <h6 className="fw-bold mb-2">Tiếp cận đúng đối tượng</h6>
                                <p className="text-muted mb-0 small">Mạng lưới ứng viên tại Hòa Lạc, phù hợp sinh viên và ca linh hoạt.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded shadow-sm h-100 bg-white">
                                <div className="mb-3" style={{ fontSize: '2rem' }}>⚡</div>
                                <h6 className="fw-bold mb-2">Đăng tin trong 1 phút</h6>
                                <p className="text-muted mb-0 small">Biểu mẫu đơn giản, hỗ trợ mức lương theo giờ và lịch làm việc.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded shadow-sm h-100 bg-white">
                                <div className="mb-3" style={{ fontSize: '2rem' }}>🧭</div>
                                <h6 className="fw-bold mb-2">Lọc theo khoảng cách</h6>
                                <p className="text-muted mb-0 small">Ứng viên có thể xem khoảng cách và chỉ đường đến nơi làm việc.</p>
                            </div>
                        </div>
                        <div className="col-lg-3 col-md-6">
                            <div className="p-4 rounded shadow-sm h-100 bg-white">
                                <div className="mb-3" style={{ fontSize: '2rem' }}>📋</div>
                                <h6 className="fw-bold mb-2">Quản lý ứng viên</h6>
                                <p className="text-muted mb-0 small">Theo dõi số lượng ứng tuyển và xử lý nhanh ngay trên bảng điều khiển.</p>
                            </div>
                        </div>
                    </div>

                    <div className="text-center mt-4">
                        <button
                            className="btn btn-outline-secondary px-4"
                            onClick={onOpenCompanyDashboard}
                        >
                            Khám phá bảng điều khiển công ty →
                        </button>
                    </div>
                </div>

                {/* Featured Jobs Section */}
                <div className="container" style={{ paddingTop: '60px', paddingBottom: '60px' }}>
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <h2 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                Việc làm <span style={{ color: '#ff6b35' }}>nổi bật</span>
                            </h2>
                        </div>
                        <div className="col-auto">
                            <button
                                onClick={handleShowAllJobs}
                                className="btn btn-link text-decoration-none p-0"
                                style={{ color: '#ff6b35' }}
                            >
                                Xem tất cả việc làm →
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {featuredJobs.map((job, index) => (
                            <div key={index} className="col-lg-6">
                                <div
                                    className="bg-white p-4 rounded shadow-sm"
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => onViewJobDetail && onViewJobDetail(1)}
                                >
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded"
                                                    style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', fontSize: '1.5rem' }}
                                                >
                                                    {job.logo}
                                                </div>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1">{job.title}</h6>
                                                <p className="text-muted mb-1 small">{job.company} • {job.location}</p>
                                            </div>
                                        </div>
                                        <span
                                            className="badge px-2 py-1 small"
                                            style={{
                                                backgroundColor: job.tags[0] === 'PART TIME' ? '#e8f5e8' : '#fff3cd',
                                                color: job.tags[0] === 'PART TIME' ? '#28a745' : '#856404',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {job.tags[0] === 'PART TIME' ? 'PART TIME' : job.tags[0]}
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-0">{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div
                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#34495e',
                                            border: '2px solid #4a5c6b'
                                        }}
                                    >
                                        <span style={{ fontSize: '18px', color: '#ffffff' }}>👤</span>
                                    </div>
                                    <span className="fw-bold" style={{ fontSize: '24px', color: '#ffffff' }}>
                                        Part GO
                                    </span>
                                </div>
                                <p style={{ color: '#bdc3c7', lineHeight: '1.6', fontSize: '14px' }}>
                                    Nền tảng tuyệt vời cho những người tìm việc làm part time tại Hòa Lạc, Hà Nội. Tìm kiếm công việc mơ ước dễ dàng hơn.
                                </p>
                            </div>

                            <div className="col-lg-2 col-md-3 col-6 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Về chúng tôi</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Công ty</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Bảng giá</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Điều khoản</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Tư vấn</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Chính sách bảo mật</a></li>
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-3 col-6 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Tài nguyên</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Tài liệu hỗ trợ</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Hướng dẫn</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Cập nhật</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Liên hệ</a></li>
                                </ul>
                            </div>

                            <div className="col-lg-4 col-md-12 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Nhận thông báo việc làm</h6>
                                <p style={{ color: '#bdc3c7', fontSize: '14px', marginBottom: '20px' }}>
                                    Tin tức việc làm mới nhất, bài viết được gửi đến hộp thư của bạn hàng tuần.
                                </p>
                                <div className="d-flex">
                                    <input
                                        type="email"
                                        className="form-control me-2"
                                        placeholder="Địa chỉ email"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: 'none',
                                            borderRadius: '6px 0 0 6px',
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        className="btn px-4"
                                        style={{
                                            backgroundColor: '#e74c3c',
                                            borderColor: '#e74c3c',
                                            color: 'white',
                                            fontWeight: '500',
                                            borderRadius: '0 6px 6px 0',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Đăng ký
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr style={{ borderColor: '#4a5c6b', margin: '2rem 0 1.5rem 0' }} />
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <p className="mb-0" style={{ color: '#7f8c8d', fontSize: '14px' }}>
                                    2024 © Part GO. Tất cả quyền được bảo lưu.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PartGOHomepage;