import React, { useState } from 'react';

const PartGOFooter = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle newsletter subscription here
        console.log('Subscribe email:', email);
        setEmail('');
    };

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            {/* Font Awesome for social icons */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
                rel="stylesheet"
            />

            <footer style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                <div className="container py-5">
                    <div className="row">
                        {/* Brand and Description */}
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
                                <span
                                    className="fw-bold"
                                    style={{
                                        fontSize: '24px',
                                        color: '#ffffff'
                                    }}
                                >
                                    Part GO
                                </span>
                            </div>
                            <p style={{ color: '#bdc3c7', lineHeight: '1.6', fontSize: '14px' }}>
                                Nền tảng tuyệt vời cho những người tìm việc làm part time tại Hòa Lạc, Hà Nội. Tìm kiếm công việc mơ ước dễ dàng hơn.
                            </p>
                        </div>

                        {/* About Column */}
                        <div className="col-lg-2 col-md-3 col-6 mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Về chúng tôi</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Công ty
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Bảng giá
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Điều khoản
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Tư vấn
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Chính sách bảo mật
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Resources Column */}
                        <div className="col-lg-2 col-md-3 col-6 mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Tài nguyên</h6>
                            <ul className="list-unstyled">
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Tài liệu hỗ trợ
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Hướng dẫn
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Cập nhật
                                    </a>
                                </li>
                                <li className="mb-2">
                                    <a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>
                                        Liên hệ
                                    </a>
                                </li>
                            </ul>
                        </div>

                        {/* Newsletter Subscription */}
                        <div className="col-lg-4 col-md-12 mb-4">
                            <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Nhận thông báo việc làm</h6>
                            <p style={{ color: '#bdc3c7', fontSize: '14px', marginBottom: '20px' }}>
                                Tin tức việc làm mới nhất, bài viết được gửi đến hộp thư của bạn hàng tuần.
                            </p>
                            <div onSubmit={handleSubscribe}>
                                <div className="d-flex">
                                    <input
                                        type="email"
                                        className="form-control me-2"
                                        placeholder="Địa chỉ email"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: 'none',
                                            borderRadius: '6px 0 0 6px',
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        className="btn px-4"
                                        onClick={handleSubscribe}
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
                    </div>

                    {/* Bottom Section */}
                    <hr style={{ borderColor: '#4a5c6b', margin: '2rem 0 1.5rem 0' }} />
                    <div className="row align-items-center">
                        <div className="col-md-6">
                            <p className="mb-0" style={{ color: '#7f8c8d', fontSize: '14px' }}>
                                2024 © Part GO. Tất cả quyền được bảo lưu.
                            </p>
                        </div>
                        <div className="col-md-6">
                            <div className="d-flex justify-content-md-end justify-content-start mt-3 mt-md-0">
                                <a href="#" className="text-decoration-none me-3" style={{ color: '#7f8c8d' }}>
                                    <i className="fab fa-facebook-f" style={{ fontSize: '16px' }}></i>
                                </a>
                                <a href="#" className="text-decoration-none me-3" style={{ color: '#7f8c8d' }}>
                                    <i className="fab fa-instagram" style={{ fontSize: '16px' }}></i>
                                </a>
                                <a href="#" className="text-decoration-none me-3" style={{ color: '#7f8c8d' }}>
                                    <i className="fab fa-dribbble" style={{ fontSize: '16px' }}></i>
                                </a>
                                <a href="#" className="text-decoration-none me-3" style={{ color: '#7f8c8d' }}>
                                    <i className="fab fa-linkedin-in" style={{ fontSize: '16px' }}></i>
                                </a>
                                <a href="#" className="text-decoration-none" style={{ color: '#7f8c8d' }}>
                                    <i className="fab fa-twitter" style={{ fontSize: '16px' }}></i>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </footer>
        </div>
    );
};

export default PartGOFooter;