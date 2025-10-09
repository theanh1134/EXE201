import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import EmailVerification from './EmailVerification';

const SignUp = ({ isOpen, onClose, onSwitchToLogin }) => {
    const { register, registerCompany, pendingVerification, verifyEmail, error, clearError } = useAuth();
    const { success, error: showError, info } = useNotification();
    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');
    const [userType, setUserType] = useState('jobseeker'); // 'jobseeker' or 'company'
    const [showEmailVerification, setShowEmailVerification] = useState(false);

    // Only show email verification if this modal is open AND there's pending verification
    const shouldShowEmailVerification = showEmailVerification && pendingVerification && isOpen;

    // Auto-show email verification if there's pending verification when modal opens
    useEffect(() => {
        if (isOpen && pendingVerification && !showEmailVerification) {
            setShowEmailVerification(true);
        }
    }, [isOpen, pendingVerification, showEmailVerification]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear errors when user starts typing
        if (localError) setLocalError('');
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!signupData.fullName || !signupData.email || !signupData.password) {
            setLocalError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        if (signupData.password !== signupData.confirmPassword) {
            setLocalError('Mật khẩu xác nhận không khớp');
            return;
        }

        if (signupData.password.length < 6) {
            setLocalError('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        try {
            setIsLoading(true);
            setLocalError('');

            if (userType === 'company') {
                // Register company using register-company endpoint
                const companyData = {
                    name: signupData.fullName,
                    email: signupData.email,
                    password: signupData.password,
                    description: '', // You can add description field later
                    address: '' // You can add address field later
                };

                await registerCompany(companyData);
            } else {
                // Register job seeker using regular register endpoint
                const userData = {
                    fullName: signupData.fullName,
                    email: signupData.email,
                    password: signupData.password,
                    role: 'jobseeker'
                };

                await register(userData);
            }

            // Registration successful - show email verification
            info('Vui lòng kiểm tra email để xác thực tài khoản', 'Đăng ký thành công');
            setShowEmailVerification(true);
        } catch (error) {
            const errorMessage = error.message || 'Đăng ký thất bại';
            setLocalError(errorMessage);
            showError(errorMessage, 'Lỗi đăng ký');
        } finally {
            setIsLoading(false);
        }
    };

    const handleVerificationSuccess = (response) => {
        setShowEmailVerification(false);
        onClose();
        // Show success message
        success('Đăng ký thành công! Chào mừng bạn đến với PartGO!', 'Hoàn thành');
    };

    const handleCloseVerification = () => {
        setShowEmailVerification(false);
        onClose();
    };

    return (
        <div>
            {/* Email Verification Modal */}
            {shouldShowEmailVerification && (
                <EmailVerification
                    userId={pendingVerification.userId}
                    email={pendingVerification.email}
                    onVerificationSuccess={handleVerificationSuccess}
                    onClose={handleCloseVerification}
                />
            )}

            {/* Only show signup modal if isOpen is true */}
            {isOpen && (
                <>
                    {/* Bootstrap CSS */}
                    <link
                        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                        rel="stylesheet"
                    />

                    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: showEmailVerification ? 1000 : 1050 }}>
                        <div className="modal-dialog modal-xl" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                            <div className="modal-content" style={{ borderRadius: '0', border: 'none', minHeight: '100vh' }}>
                                <div className="row g-0 h-100">
                                    {/* Left Side - Illustration */}
                                    <div className="col-lg-7" style={{ backgroundColor: '#f8f9fa', position: 'relative' }}>
                                        <button
                                            type="button"
                                            className="btn-close position-absolute top-0 end-0 m-3"
                                            onClick={onClose}
                                            style={{ zIndex: 10 }}
                                        ></button>

                                        <div className="d-flex flex-column h-100 p-5">
                                            {/* Logo */}
                                            <div className="mb-4">
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#fff',
                                                            border: '2px solid #e9ecef'
                                                        }}
                                                    >
                                                        <span style={{ fontSize: '18px', color: '#6c757d' }}>👤</span>
                                                    </div>
                                                    <span className="fw-bold" style={{ fontSize: '24px', color: '#333' }}>
                                                        Part GO
                                                    </span>
                                                </div>
                                            </div>

                                            {/* Stats */}
                                            <div className="mb-5">
                                                <div className="d-flex align-items-center mb-2">
                                                    <div style={{
                                                        width: '40px',
                                                        height: '30px',
                                                        background: 'linear-gradient(45deg, #ff6b35, #ff8a65)',
                                                        borderRadius: '4px',
                                                        marginRight: '12px'
                                                    }}></div>
                                                </div>
                                                <h3 className="fw-bold mb-1" style={{ color: '#333' }}>100K+</h3>
                                                <p className="text-muted">People got hired</p>
                                            </div>

                                            {/* Illustration area */}
                                            <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ position: 'relative' }}>
                                                <div style={{ position: 'relative', width: '400px', height: '300px' }}>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '20px',
                                                        left: '50px',
                                                        width: '200px',
                                                        height: '150px',
                                                        background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                                                        borderRadius: '20px',
                                                        transform: 'rotate(-10deg)',
                                                        opacity: 0.7
                                                    }}></div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '80px',
                                                        left: '150px',
                                                        width: '180px',
                                                        height: '120px',
                                                        background: 'linear-gradient(135deg, #fff3e0, #ffcc80)',
                                                        borderRadius: '15px',
                                                        transform: 'rotate(10deg)',
                                                        opacity: 0.8
                                                    }}></div>
                                                    <div style={{
                                                        position: 'absolute',
                                                        top: '140px',
                                                        left: '20px',
                                                        width: '160px',
                                                        height: '100px',
                                                        background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                                        borderRadius: '12px',
                                                        transform: 'rotate(-5deg)',
                                                        opacity: 0.6
                                                    }}></div>
                                                </div>
                                            </div>

                                            {/* Testimonial */}
                                            <div className="mt-auto">
                                                <div className="d-flex align-items-start">
                                                    <div className="me-3">
                                                        <span style={{ fontSize: '24px', color: '#ff6b35' }}>❝</span>
                                                    </div>
                                                    <div>
                                                        <p className="mb-2" style={{ fontStyle: 'italic', color: '#666' }}>
                                                            "Great platform for the job seeker that searching for new career heights."
                                                        </p>
                                                        <div className="d-flex align-items-center">
                                                            <div
                                                                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                                style={{
                                                                    width: '40px',
                                                                    height: '40px',
                                                                    backgroundColor: '#ff6b35',
                                                                    fontSize: '1.2rem'
                                                                }}
                                                            >
                                                                <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>👨</span>
                                                            </div>
                                                            <div>
                                                                <div className="fw-medium" style={{ fontSize: '14px' }}>Adam Sandler</div>
                                                                <div className="text-muted" style={{ fontSize: '12px' }}>Lead Engineer at Canva</div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Side - Sign Up Form */}
                                    <div className="col-lg-5 d-flex align-items-center">
                                        <div className="w-100 p-5">
                                            {/* Job Seeker / Company Toggle */}
                                            <div className="d-flex mb-4 justify-content-center">
                                                <div className="d-flex" style={{ backgroundColor: '#f8f9fa', borderRadius: '25px', padding: '4px' }}>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm px-4"
                                                        style={{
                                                            backgroundColor: userType === 'jobseeker' ? '#ff6b35' : 'transparent',
                                                            color: userType === 'jobseeker' ? 'white' : '#6c757d',
                                                            borderRadius: '20px',
                                                            border: 'none',
                                                            fontWeight: '500'
                                                        }}
                                                        onClick={() => setUserType('jobseeker')}
                                                        disabled={isLoading}
                                                    >
                                                        Job Seeker
                                                    </button>
                                                    <button
                                                        type="button"
                                                        className="btn btn-sm px-4"
                                                        style={{
                                                            backgroundColor: userType === 'company' ? '#ff6b35' : 'transparent',
                                                            color: userType === 'company' ? 'white' : '#6c757d',
                                                            borderRadius: '20px',
                                                            border: 'none',
                                                            fontWeight: '500'
                                                        }}
                                                        onClick={() => setUserType('company')}
                                                        disabled={isLoading}
                                                    >
                                                        Company
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="text-center mb-4">
                                                <h2 className="fw-bold mb-2" style={{ color: '#333' }}>Nhận thêm</h2>
                                                <h2 className="fw-bold" style={{ color: '#333' }}>cơ hội việc làm</h2>
                                            </div>

                                            {/* Google Sign Up */}
                                            <button className="btn w-100 mb-3 py-3 d-flex align-items-center justify-content-center" style={{
                                                border: '1px solid #e9ecef',
                                                borderRadius: '8px',
                                                backgroundColor: 'white'
                                            }}>
                                                <span style={{ fontSize: '18px', marginRight: '12px' }}>🌐</span>
                                                <span style={{ color: '#333', fontWeight: '500' }}>Đăng ký với Google</span>
                                            </button>

                                            <div className="text-center mb-3">
                                                <span className="text-muted">Hoặc đăng ký bằng email</span>
                                            </div>

                                            <form onSubmit={handleSubmit}>
                                                {/* Error Message */}
                                                {(localError || error) && (
                                                    <div className="alert alert-danger mb-3" role="alert">
                                                        {localError || error}
                                                    </div>
                                                )}

                                                {/* Full Name */}
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium" style={{ color: '#333' }}>
                                                        {userType === 'company' ? 'Tên công ty' : 'Họ và tên'}
                                                    </label>
                                                    <input
                                                        type="text"
                                                        className="form-control"
                                                        name="fullName"
                                                        value={signupData.fullName}
                                                        onChange={handleInputChange}
                                                        placeholder={userType === 'company' ? 'Nhập tên công ty' : 'Nhập họ và tên của bạn'}
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #e9ecef',
                                                            padding: '12px',
                                                            fontSize: '16px'
                                                        }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Email */}
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium" style={{ color: '#333' }}>Địa chỉ Email</label>
                                                    <input
                                                        type="email"
                                                        className="form-control"
                                                        name="email"
                                                        value={signupData.email}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập địa chỉ email"
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #e9ecef',
                                                            padding: '12px',
                                                            fontSize: '16px'
                                                        }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Password */}
                                                <div className="mb-3">
                                                    <label className="form-label fw-medium" style={{ color: '#333' }}>Mật khẩu</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        name="password"
                                                        value={signupData.password}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #e9ecef',
                                                            padding: '12px',
                                                            fontSize: '16px'
                                                        }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Confirm Password */}
                                                <div className="mb-4">
                                                    <label className="form-label fw-medium" style={{ color: '#333' }}>Xác nhận mật khẩu</label>
                                                    <input
                                                        type="password"
                                                        className="form-control"
                                                        name="confirmPassword"
                                                        value={signupData.confirmPassword}
                                                        onChange={handleInputChange}
                                                        placeholder="Nhập lại mật khẩu"
                                                        style={{
                                                            borderRadius: '8px',
                                                            border: '1px solid #e9ecef',
                                                            padding: '12px',
                                                            fontSize: '16px'
                                                        }}
                                                        required
                                                        disabled={isLoading}
                                                    />
                                                </div>

                                                {/* Submit Button */}
                                                <button
                                                    type="submit"
                                                    className="btn w-100 py-3 fw-bold mb-4"
                                                    style={{
                                                        backgroundColor: isLoading ? '#ccc' : '#ff6b35',
                                                        color: 'white',
                                                        borderRadius: '8px',
                                                        border: 'none',
                                                        fontSize: '16px'
                                                    }}
                                                    disabled={isLoading}
                                                >
                                                    {isLoading ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                                                            Đang đăng ký...
                                                        </>
                                                    ) : (
                                                        'Tiếp tục'
                                                    )}
                                                </button>
                                            </form>

                                            {/* Login Link */}
                                            <p className="text-center mb-3">
                                                <span className="text-muted">Đã có tài khoản? </span>
                                                <button
                                                    className="btn btn-link p-0 text-decoration-none fw-medium"
                                                    style={{ color: '#ff6b35' }}
                                                    onClick={onSwitchToLogin}
                                                >
                                                    Đăng nhập
                                                </button>
                                            </p>

                                            {/* Terms */}
                                            <p className="text-center text-muted" style={{ fontSize: '12px' }}>
                                                Bằng cách nhấp Tiếp tục, bạn xác nhận rằng đã đọc
                                                và chấp nhận{' '}
                                                <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                                    Điều khoản dịch vụ
                                                </a>{' '}
                                                và{' '}
                                                <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                                    Chính sách bảo mật
                                                </a>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
};

export default SignUp;