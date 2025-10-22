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

        if (localError) setLocalError('');
        if (error) clearError();
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

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
            {/* Apple San Francisco Font */}
            <link
                href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
                rel="stylesheet"
            />

            <div className="apple-modal-overlay" onClick={onClose}>
                <div className="apple-modal-container" onClick={(e) => e.stopPropagation()}>
                    {/* Close Button */}
                    <button
                        className="apple-close-btn"
                        onClick={onClose}
                        aria-label="Close"
                    >
                        <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                            <path d="M1 1L13 13M13 1L1 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                    </button>

                    <div className="apple-modal-content">
                        {/* Left Side - Visual */}
                        <div className="apple-visual-section">
                            {/* Logo */}
                            <div className="apple-logo">
                                <div className="logo-icon">
                                    <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
                                        <rect width="32" height="32" rx="8" fill="url(#gradient)"/>
                                        <path d="M16 8L20 16L16 24L12 16L16 8Z" fill="white" opacity="0.9"/>
                                        <defs>
                                            <linearGradient id="gradient" x1="0" y1="0" x2="32" y2="32">
                                                <stop offset="0%" stopColor="#667eea"/>
                                                <stop offset="100%" stopColor="#764ba2"/>
                                            </linearGradient>
                                        </defs>
                                    </svg>
                                </div>
                                <span className="logo-text">Part GO</span>
                            </div>

                            {/* Metrics Card */}
                            <div className="apple-metrics-card">
                                <div className="metric-badge">
                                    <div className="badge-icon"></div>
                                    <span>Trusted Platform</span>
                                </div>
                                <h1 className="metric-number">100K+</h1>
                                <p className="metric-description">People successfully hired</p>
                            </div>

                            {/* Abstract Illustration */}
                            <div className="apple-illustration">
                                <div className="float-shape shape-1"></div>
                                <div className="float-shape shape-2"></div>
                                <div className="float-shape shape-3"></div>
                                <div className="glass-card card-1">
                                    <div className="card-header"></div>
                                    <div className="card-lines">
                                        <div className="line"></div>
                                        <div className="line"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                                <div className="glass-card card-2">
                                    <div className="user-avatar"></div>
                                    <div className="card-lines">
                                        <div className="line"></div>
                                        <div className="line short"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Testimonial */}
                            <div className="apple-testimonial">
                                <div className="quote-icon">"</div>
                                <p className="testimonial-text">
                                    Great platform for job seekers searching for new career heights.
                                </p>
                                <div className="testimonial-author">
                                    <div className="author-avatar">
                                        <span>AS</span>
                                    </div>
                                    <div className="author-info">
                                        <div className="author-name">Adam Sandler</div>
                                        <div className="author-title">Lead Engineer at Canva</div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Side - Login Form */}
                        <div className="apple-form-section">
                            {/* Toggle Buttons */}
                            <div className="apple-segmented-control">
                                <button className="segment active">Job Seeker</button>
                                <button className="segment">Company</button>
                            </div>

                            <h2 className="apple-form-title">Chào mừng trở lại</h2>

                            {/* Social Login */}
                            <button className="apple-social-btn">
                                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                                    <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                                    <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                                    <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                                    <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                                </svg>
                                <span>Đăng nhập với Google</span>
                            </button>

                            <div className="apple-divider">
                                <span>hoặc</span>
                            </div>

                            {/* Login Form */}
                            <form onSubmit={handleSubmit} className="apple-form">
                                {(localError || error) && (
                                    <div className="apple-alert">
                                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                                            <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                                            <path d="M8 4V9M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                        </svg>
                                        <span>{localError || error}</span>
                                    </div>
                                )}

                                <div className="apple-form-group">
                                    <label className="apple-label">Email</label>
                                    <input
                                        type="email"
                                        className="apple-input"
                                        name="email"
                                        value={loginData.email}
                                        onChange={handleInputChange}
                                        placeholder="your@email.com"
                                        required
                                        disabled={isLoading}
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="apple-form-group">
                                    <label className="apple-label">Mật khẩu</label>
                                    <input
                                        type="password"
                                        className="apple-input"
                                        name="password"
                                        value={loginData.password}
                                        onChange={handleInputChange}
                                        placeholder="••••••••"
                                        required
                                        disabled={isLoading}
                                        autoComplete="current-password"
                                    />
                                </div>

                                <div className="apple-form-row">
                                    <label className="apple-checkbox">
                                        <input
                                            type="checkbox"
                                            name="rememberMe"
                                            checked={loginData.rememberMe}
                                            onChange={handleInputChange}
                                            disabled={isLoading}
                                        />
                                        <span className="checkbox-custom"></span>
                                        <span className="checkbox-label">Ghi nhớ đăng nhập</span>
                                    </label>

                                    <button
                                        type="button"
                                        className="apple-link-btn"
                                        onClick={onShowForgotPassword}
                                    >
                                        Quên mật khẩu?
                                    </button>
                                </div>

                                <button
                                    type="submit"
                                    className="apple-primary-btn"
                                    disabled={isLoading}
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="apple-spinner"></span>
                                            <span>Đang đăng nhập...</span>
                                        </>
                                    ) : (
                                        'Đăng nhập'
                                    )}
                                </button>
                            </form>

                            <div className="apple-form-footer">
                                <span>Chưa có tài khoản?</span>
                                <button
                                    className="apple-text-btn"
                                    onClick={onSwitchToSignUp}
                                >
                                    Đăng ký ngay
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <style>{`
                /* Apple Design System Variables */
                :root {
                    --apple-blue: #007AFF;
                    --apple-gray: #86868B;
                    --apple-light-gray: #F5F5F7;
                    --apple-dark: #1D1D1F;
                    --apple-red: #FF3B30;
                    --apple-radius: 12px;
                    --apple-shadow: 0 2px 16px rgba(0, 0, 0, 0.12);
                    --apple-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Font Family */
                * {
                    font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Modal Overlay */
                .apple-modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(20px);
                    -webkit-backdrop-filter: blur(20px);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 9999;
                    padding: 20px;
                    animation: fadeIn 0.3s ease-out;
                }

                /* Modal Container */
                .apple-modal-container {
                    background: #fff;
                    border-radius: 20px;
                    max-width: 1100px;
                    width: 100%;
                    max-height: 90vh;
                    overflow: hidden;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    animation: slideUp 0.4s cubic-bezier(0.4, 0, 0.2, 1);
                }

                /* Close Button */
                .apple-close-btn {
                    position: absolute;
                    top: 20px;
                    right: 20px;
                    width: 32px;
                    height: 32px;
                    border-radius: 50%;
                    background: rgba(0, 0, 0, 0.05);
                    border: none;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    cursor: pointer;
                    transition: var(--apple-transition);
                    z-index: 10;
                    color: var(--apple-gray);
                }

                .apple-close-btn:hover {
                    background: rgba(0, 0, 0, 0.1);
                    transform: scale(1.05);
                }

                /* Modal Content */
                .apple-modal-content {
                    display: grid;
                    grid-template-columns: 1.2fr 1fr;
                    min-height: 600px;
                }

                /* Visual Section */
                .apple-visual-section {
                    background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
                    padding: 60px 50px;
                    display: flex;
                    flex-direction: column;
                    position: relative;
                    overflow: hidden;
                }

                .apple-visual-section::before {
                    content: '';
                    position: absolute;
                    top: -50%;
                    right: -50%;
                    width: 100%;
                    height: 100%;
                    background: radial-gradient(circle, rgba(102, 126, 234, 0.1) 0%, transparent 70%);
                }

                /* Logo */
                .apple-logo {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    margin-bottom: 50px;
                    position: relative;
                    z-index: 2;
                }

                .logo-icon {
                    filter: drop-shadow(0 4px 12px rgba(102, 126, 234, 0.3));
                }

                .logo-text {
                    font-size: 24px;
                    font-weight: 700;
                    color: var(--apple-dark);
                    letter-spacing: -0.5px;
                }

                /* Metrics Card */
                .apple-metrics-card {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 24px;
                    margin-bottom: 40px;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    position: relative;
                    z-index: 2;
                }

                .metric-badge {
                    display: inline-flex;
                    align-items: center;
                    gap: 8px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    color: white;
                    padding: 6px 12px;
                    border-radius: 20px;
                    font-size: 12px;
                    font-weight: 600;
                    margin-bottom: 16px;
                }

                .badge-icon {
                    width: 16px;
                    height: 16px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 4px;
                }

                .metric-number {
                    font-size: 48px;
                    font-weight: 700;
                    color: var(--apple-dark);
                    margin: 0 0 8px 0;
                    letter-spacing: -2px;
                }

                .metric-description {
                    font-size: 15px;
                    color: var(--apple-gray);
                    margin: 0;
                    font-weight: 400;
                }

                /* Illustration */
                .apple-illustration {
                    flex: 1;
                    position: relative;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    margin: 20px 0;
                }

                .float-shape {
                    position: absolute;
                    border-radius: 12px;
                    opacity: 0.6;
                    animation: float 6s ease-in-out infinite;
                }

                .shape-1 {
                    width: 120px;
                    height: 120px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    top: 10%;
                    left: 10%;
                    animation-delay: 0s;
                }

                .shape-2 {
                    width: 80px;
                    height: 80px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    bottom: 20%;
                    right: 15%;
                    animation-delay: 2s;
                }

                .shape-3 {
                    width: 60px;
                    height: 60px;
                    background: linear-gradient(135deg, #4facfe 0%, #00f2fe 100%);
                    top: 50%;
                    right: 5%;
                    animation-delay: 4s;
                }

                .glass-card {
                    position: absolute;
                    background: rgba(255, 255, 255, 0.9);
                    backdrop-filter: blur(20px);
                    border-radius: 12px;
                    padding: 16px;
                    box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
                    border: 1px solid rgba(255, 255, 255, 0.5);
                }

                .card-1 {
                    width: 200px;
                    top: 30%;
                    left: 20%;
                    animation: float 5s ease-in-out infinite;
                }

                .card-2 {
                    width: 180px;
                    bottom: 25%;
                    right: 20%;
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    animation: float 5s ease-in-out infinite;
                    animation-delay: 2.5s;
                }

                .card-header {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 8px;
                    margin-bottom: 12px;
                }

                .card-lines {
                    flex: 1;
                }

                .card-lines .line {
                    height: 8px;
                    background: rgba(0, 0, 0, 0.1);
                    border-radius: 4px;
                    margin-bottom: 8px;
                }

                .card-lines .line.short {
                    width: 60%;
                }

                .user-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
                    border-radius: 50%;
                    flex-shrink: 0;
                }

                /* Testimonial */
                .apple-testimonial {
                    background: rgba(255, 255, 255, 0.8);
                    backdrop-filter: blur(20px);
                    border-radius: 16px;
                    padding: 24px;
                    border: 1px solid rgba(255, 255, 255, 0.5);
                    position: relative;
                    z-index: 2;
                }

                .quote-icon {
                    font-size: 36px;
                    color: #667eea;
                    line-height: 1;
                    margin-bottom: 12px;
                    font-family: Georgia, serif;
                }

                .testimonial-text {
                    font-size: 14px;
                    line-height: 1.6;
                    color: var(--apple-dark);
                    margin: 0 0 20px 0;
                    font-weight: 400;
                }

                .testimonial-author {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                }

                .author-avatar {
                    width: 40px;
                    height: 40px;
                    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                    border-radius: 50%;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    color: white;
                    font-weight: 600;
                    font-size: 14px;
                }

                .author-info {
                    flex: 1;
                }

                .author-name {
                    font-size: 14px;
                    font-weight: 600;
                    color: var(--apple-dark);
                    margin-bottom: 2px;
                }

                .author-title {
                    font-size: 12px;
                    color: var(--apple-gray);
                }

                /* Form Section */
                .apple-form-section {
                    padding: 60px 50px;
                    display: flex;
                    flex-direction: column;
                    overflow-y: auto;
                }

                /* Segmented Control */
                .apple-segmented-control {
                    display: inline-flex;
                    background: var(--apple-light-gray);
                    border-radius: 10px;
                    padding: 3px;
                    margin: 0 auto 40px;
                }

                .segment {
                    padding: 8px 24px;
                    border: none;
                    background: transparent;
                    border-radius: 8px;
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--apple-gray);
                    cursor: pointer;
                    transition: var(--apple-transition);
                }

                .segment.active {
                    background: white;
                    color: var(--apple-dark);
                    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
                }

                /* Form Title */
                .apple-form-title {
                    font-size: 32px;
                    font-weight: 700;
                    color: var(--apple-dark);
                    text-align: center;
                    margin: 0 0 32px 0;
                    letter-spacing: -1px;
                }

                /* Social Button */
                .apple-social-btn {
                    width: 100%;
                    height: 48px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 12px;
                    background: white;
                    border: 1.5px solid #E5E5E5;
                    border-radius: var(--apple-radius);
                    font-size: 15px;
                    font-weight: 500;
                    color: var(--apple-dark);
                    cursor: pointer;
                    transition: var(--apple-transition);
                    margin-bottom: 24px;
                }

                .apple-social-btn:hover {
                    background: var(--apple-light-gray);
                    border-color: #D1D1D1;
                    transform: translateY(-1px);
                }

                /* Divider */
                .apple-divider {
                    display: flex;
                    align-items: center;
                    gap: 16px;
                    margin: 24px 0;
                    color: var(--apple-gray);
                    font-size: 13px;
                }

                .apple-divider::before,
                .apple-divider::after {
                    content: '';
                    flex: 1;
                    height: 1px;
                    background: #E5E5E5;
                }

                /* Form */
                .apple-form {
                    display: flex;
                    flex-direction: column;
                    gap: 20px;
                }

                /* Alert */
                .apple-alert {
                    display: flex;
                    align-items: center;
                    gap: 12px;
                    padding: 12px 16px;
                    background: rgba(255, 59, 48, 0.08);
                    border: 1px solid rgba(255, 59, 48, 0.2);
                    border-radius: 10px;
                    color: var(--apple-red);
                    font-size: 14px;
                    animation: shake 0.3s ease-in-out;
                }

                /* Form Group */
                .apple-form-group {
                    display: flex;
                    flex-direction: column;
                    gap: 8px;
                }

                .apple-label {
                    font-size: 14px;
                    font-weight: 500;
                    color: var(--apple-dark);
                }

                .apple-input {
                    height: 48px;
                    padding: 0 16px;
                    background: var(--apple-light-gray);
                    border: 1.5px solid transparent;
                    border-radius: 10px;
                    font-size: 15px;
                    color: var(--apple-dark);
                    transition: var(--apple-transition);
                }

                .apple-input:focus {
                    outline: none;
                    background: white;
                    border-color: var(--apple-blue);
                    box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
                }

                .apple-input::placeholder {
                    color: var(--apple-gray);
                }

                .apple-input:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Form Row */
                .apple-form-row {
                    display: flex;
                    align-items: center;
                    justify-content: space-between;
                    margin: 4px 0;
                }

                /* Checkbox */
                .apple-checkbox {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    cursor: pointer;
                    user-select: none;
                }

                .apple-checkbox input[type="checkbox"] {
                    position: absolute;
                    opacity: 0;
                    pointer-events: none;
                }

                .checkbox-custom {
                    width: 20px;
                    height: 20px;
                    border: 1.5px solid #D1D1D1;
                    border-radius: 6px;
                    background: white;
                    position: relative;
                    transition: var(--apple-transition);
                }

                .apple-checkbox input:checked + .checkbox-custom {
                    background: var(--apple-blue);
                    border-color: var(--apple-blue);
                }

                .apple-checkbox input:checked + .checkbox-custom::after {
                    content: '';
                    position: absolute;
                    top: 3px;
                    left: 6px;
                    width: 5px;
                    height: 10px;
                    border: solid white;
                    border-width: 0 2px 2px 0;
                    transform: rotate(45deg);
                }

                .checkbox-label {
                    font-size: 14px;
                    color: var(--apple-dark);
                }

                /* Link Button */
                .apple-link-btn {
                    background: none;
                    border: none;
                    color: var(--apple-blue);
                    font-size: 14px;
                    font-weight: 500;
                    cursor: pointer;
                    padding: 0;
                    transition: var(--apple-transition);
                }

                .apple-link-btn:hover {
                    opacity: 0.7;
                }

                /* Primary Button */
                .apple-primary-btn {
                    height: 48px;
                    background: var(--apple-blue);
                    color: white;
                    border: none;
                    border-radius: 10px;
                    font-size: 15px;
                    font-weight: 600;
                    cursor: pointer;
                    transition: var(--apple-transition);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    gap: 8px;
                    margin-top: 8px;
                }

                .apple-primary-btn:hover:not(:disabled) {
                    background: #0051D5;
                    transform: translateY(-1px);
                    box-shadow: 0 4px 16px rgba(0, 122, 255, 0.3);
                }

                .apple-primary-btn:active:not(:disabled) {
                    transform: translateY(0);
                }

                .apple-primary-btn:disabled {
                    opacity: 0.5;
                    cursor: not-allowed;
                }

                /* Spinner */
                .apple-spinner {
                    width: 16px;
                    height: 16px;
                    border: 2px solid rgba(255, 255, 255, 0.3);
                    border-top-color: white;
                    border-radius: 50%;
                    animation: spin 0.6s linear infinite;
                }

                /* Form Footer */
                .apple-form-footer {
                    text-align: center;
                    margin-top: 24px;
                    font-size: 14px;
                    color: var(--apple-gray);
                }

                .apple-text-btn {
                    background: none;
                    border: none;
                    color: var(--apple-blue);
                    font-weight: 600;
                    cursor: pointer;
                    margin-left: 6px;
                    transition: var(--apple-transition);
                }

                .apple-text-btn:hover {
                    opacity: 0.7;
                }

                /* Animations */
                @keyframes fadeIn {
                    from {
                        opacity: 0;
                    }
                    to {
                        opacity: 1;
                    }
                }

                @keyframes slideUp {
                    from {
                        opacity: 0;
                        transform: translateY(40px) scale(0.95);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0) scale(1);
                    }
                }

                @keyframes float {
                    0%, 100% {
                        transform: translateY(0px) rotate(0deg);
                    }
                    50% {
                        transform: translateY(-20px) rotate(5deg);
                    }
                }

                @keyframes spin {
                    to {
                        transform: rotate(360deg);
                    }
                }

                @keyframes shake {
                    0%, 100% {
                        transform: translateX(0);
                    }
                    25% {
                        transform: translateX(-8px);
                    }
                    75% {
                        transform: translateX(8px);
                    }
                }

                /* Responsive Design */
                @media (max-width: 992px) {
                    .apple-modal-content {
                        grid-template-columns: 1fr;
                    }

                    .apple-visual-section {
                        display: none;
                    }

                    .apple-form-section {
                        padding: 40px 30px;
                    }
                }

                @media (max-width: 576px) {
                    .apple-modal-container {
                        border-radius: 0;
                        max-height: 100vh;
                        height: 100vh;
                    }

                    .apple-form-section {
                        padding: 30px 20px;
                    }

                    .apple-form-title {
                        font-size: 28px;
                    }
                }

                /* Scrollbar Styling */
                .apple-form-section::-webkit-scrollbar {
                    width: 8px;
                }

                .apple-form-section::-webkit-scrollbar-track {
                    background: transparent;
                }

                .apple-form-section::-webkit-scrollbar-thumb {
                    background: rgba(0, 0, 0, 0.2);
                    border-radius: 4px;
                }

                .apple-form-section::-webkit-scrollbar-thumb:hover {
                    background: rgba(0, 0, 0, 0.3);
                }
            `}</style>
        </>
    );
};

export default Login;