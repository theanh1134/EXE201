import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';

const Login = ({ isOpen, onClose, onSwitchToSignUp, onShowForgotPassword }) => {
    const { login, error, clearError } = useAuth();
    const { success, error: showError } = useNotification();
    const [loginData, setLoginData] = useState({
        email: '',
        password: '',
        rememberMe: false
    });
    const [isLoading, setIsLoading] = useState(false);
    const [localError, setLocalError] = useState('');

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setLoginData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));

        // Clear errors when user starts typing
        if (localError) setLocalError('');
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validation
        if (!loginData.email || !loginData.password) {
            setLocalError('Vui lòng nhập đầy đủ thông tin');
            return;
        }

        try {
            setIsLoading(true);
            setLocalError('');

            await login({
                email: loginData.email,
                password: loginData.password
            });

            // Login successful - show success message and close modal
            success('Đăng nhập thành công!', 'Chào mừng bạn quay trở lại');
            onClose();
        } catch (error) {
            const errorMessage = error.message || 'Đăng nhập thất bại';
            setLocalError(errorMessage);
            showError(errorMessage, 'Lỗi đăng nhập');
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) return null;

    return (
        <>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div className="modal show d-block" style={{
                backgroundColor: 'rgba(0,0,0,0.5)',
                zIndex: 1060,
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
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
                                        {/* Abstract geometric shapes */}
                                        <div style={{ position: 'relative', width: '400px', height: '300px' }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '20px',
                                                left: '50px',
                                                width: '200px',
                                                height: '150px',
                                                background: 'linear-gradient(135deg, #e3f2fd, #bbdefb)',
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
                                                background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
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
                                                background: 'linear-gradient(135deg, #fff3e0, #ffcc02)',
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

                            {/* Right Side - Login Form */}
                            <div className="col-lg-5 d-flex align-items-center">
                                <div className="w-100 p-5">
                                    {/* Job Seeker / Company Toggle */}
                                    <div className="d-flex mb-4 justify-content-center">
                                        <div className="d-flex" style={{ backgroundColor: '#f8f9fa', borderRadius: '25px', padding: '4px' }}>
                                            <button className="btn btn-sm px-4" style={{
                                                backgroundColor: '#ff6b35',
                                                color: 'white',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontWeight: '500'
                                            }}>
                                                Job Seeker
                                            </button>
                                            <button className="btn btn-sm px-4 text-muted" style={{
                                                backgroundColor: 'transparent',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontWeight: '500'
                                            }}>
                                                Company
                                            </button>
                                        </div>
                                    </div>

                                    <h2 className="fw-bold mb-4 text-center" style={{ color: '#333' }}>Chào mừng trở lại</h2>

                                    {/* Google Sign In */}
                                    <button className="btn w-100 mb-3 py-3 d-flex align-items-center justify-content-center" style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        backgroundColor: 'white'
                                    }}>
                                        <span style={{ fontSize: '18px', marginRight: '12px' }}>🌐</span>
                                        <span style={{ color: '#333', fontWeight: '500' }}>Đăng nhập với Google</span>
                                    </button>

                                    <div className="text-center mb-3">
                                        <span className="text-muted">Hoặc đăng nhập bằng email</span>
                                    </div>

                                    <form onSubmit={handleSubmit}>
                                        {/* Error Message */}
                                        {(localError || error) && (
                                            <div className="alert alert-danger mb-3" role="alert">
                                                {localError || error}
                                            </div>
                                        )}

                                        {/* Email */}
                                        <div className="mb-3">
                                            <label className="form-label fw-medium" style={{ color: '#333' }}>Địa chỉ Email</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={loginData.email}
                                                onChange={handleInputChange}
                                                placeholder="Địa chỉ email của bạn"
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
                                                value={loginData.password}
                                                onChange={handleInputChange}
                                                placeholder="Nhập mật khẩu"
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

                                        {/* Remember Me */}
                                        <div className="form-check mb-4">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                name="rememberMe"
                                                checked={loginData.rememberMe}
                                                onChange={handleInputChange}
                                                id="rememberMe"
                                                style={{ backgroundColor: loginData.rememberMe ? '#ff6b35' : 'white' }}
                                                disabled={isLoading}
                                            />
                                            <label className="form-check-label text-muted" htmlFor="rememberMe">
                                                Ghi nhớ đăng nhập
                                            </label>
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
                                                    Đang đăng nhập...
                                                </>
                                            ) : (
                                                'Đăng nhập'
                                            )}
                                        </button>
                                    </form>

                                    {/* Sign Up Link */}
                                    <p className="text-center mb-0">
                                        <span className="text-muted">Chưa có tài khoản? </span>
                                        <button
                                            className="btn btn-link p-0 text-decoration-none fw-medium"
                                            style={{ color: '#ff6b35' }}
                                            onClick={onSwitchToSignUp}
                                        >
                                            Đăng ký
                                        </button>
                                    </p>

                                    {/* Forgot Password Link */}
                                    <p className="text-center mb-0 mt-2">
                                        <button
                                            className="btn btn-link p-0 text-decoration-none fw-medium"
                                            style={{ color: '#6c757d', fontSize: '14px' }}
                                            onClick={onShowForgotPassword}
                                        >
                                            Quên mật khẩu?
                                        </button>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
            @keyframes fadeIn {
                from {
                    opacity: 0;
                    transform: scale(0.95);
                }
                to {
                    opacity: 1;
                    transform: scale(1);
                }
            }
            
            .modal.show {
                animation: fadeIn 0.3s ease-out;
            }
        `}</style>
        </>
    );
};

export default Login;