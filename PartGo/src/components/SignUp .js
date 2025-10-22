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
  const [userType, setUserType] = useState('jobseeker');
  const [showEmailVerification, setShowEmailVerification] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState({ score: 0, label: '', color: '' });

  const shouldShowEmailVerification = showEmailVerification && pendingVerification && isOpen;

  useEffect(() => {
    if (isOpen && pendingVerification && !showEmailVerification) {
      setShowEmailVerification(true);
    }
  }, [isOpen, pendingVerification, showEmailVerification]);

  // Password strength calculator
  const calculatePasswordStrength = (password) => {
    let score = 0;
    if (!password) return { score: 0, label: '', color: '' };

    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/[0-9]/.test(password)) score++;
    if (/[^a-zA-Z0-9]/.test(password)) score++;

    if (score <= 2) return { score: 1, label: 'Yếu', color: '#FF3B30' };
    if (score <= 4) return { score: 2, label: 'Trung bình', color: '#FF9500' };
    if (score <= 5) return { score: 3, label: 'Mạnh', color: '#34C759' };
    return { score: 4, label: 'Rất mạnh', color: '#30D158' };
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSignupData(prev => ({ ...prev, [name]: value }));

    if (name === 'password') {
      setPasswordStrength(calculatePasswordStrength(value));
    }

    if (localError) setLocalError('');
    if (error) clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        const companyData = {
          name: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          description: '',
          address: ''
        };
        await registerCompany(companyData);
      } else {
        const userData = {
          fullName: signupData.fullName,
          email: signupData.email,
          password: signupData.password,
          role: 'jobseeker'
        };
        await register(userData);
      }

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
    success('Đăng ký thành công! Chào mừng bạn đến với PartGO!', 'Hoàn thành');
  };

  const handleCloseVerification = () => {
    setShowEmailVerification(false);
    onClose();
  };

  if (!isOpen) return null;

   return (
    <>
      {/* Thêm Google Fonts */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap"
        rel="stylesheet"
      />

      {/* Email Verification Modal */}
      {shouldShowEmailVerification && (
        <EmailVerification
          userId={pendingVerification.userId}
          email={pendingVerification.email}
          onVerificationSuccess={handleVerificationSuccess}
          onClose={handleCloseVerification}
        />
      )}

      {/* Modal */}
      <div className="apple-modal-overlay" onClick={onClose}>
        <div className="apple-modal-container" onClick={(e) => e.stopPropagation()}>
          <button className="apple-close-btn" onClick={onClose}>
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
              <path d="M15 5L5 15M5 5L15 15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </button>

          <div className="apple-modal-content">
            {/* Left Side - Visual Section */}
            <div className="apple-visual-section">
              <div className="apple-logo">
                <svg className="logo-icon" width="32" height="32" viewBox="0 0 32 32" fill="none">
                  <rect width="32" height="32" rx="8" fill="#34C759"/>
                  <path d="M16 8L20 16H12L16 8Z" fill="white"/>
                  <path d="M12 18L16 24L20 18H12Z" fill="white"/>
                </svg>
                <span className="logo-text">PartGO</span>
              </div>

              <div className="stats-grid">
                <div className="stat-card card-animated" style={{ animationDelay: '0.1s' }}>
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #34c759, #30d158)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <div className="stat-number">10K+</div>
                    <div className="stat-label">Công việc hàng ngày</div>
                  </div>
                </div>

                <div className="stat-card card-animated" style={{ animationDelay: '0.2s' }}>
                  <div className="stat-icon" style={{ background: 'linear-gradient(135deg, #007AFF, #0051D5)' }}>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" fill="white"/>
                    </svg>
                  </div>
                  <div>
                    <div className="stat-number">5K+</div>
                    <div className="stat-label">Công ty tuyển dụng</div>
                  </div>
                </div>
              </div>

              <div className="feature-list">
                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-2 12l-4-4 1.41-1.41L8 11.17l6.59-6.59L16 6l-8 8z" fill="white"/>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Tìm việc dễ dàng</h4>
                    <p>Hàng ngàn công việc phù hợp với kỹ năng của bạn</p>
                  </div>
                </div>

                <div className="feature-item">
                  <div className="feature-icon">
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                      <path d="M10 2C5.58 2 2 5.58 2 10s3.58 8 8 8 8-3.58 8-8-3.58-8-8-8zm-2 12l-4-4 1.41-1.41L8 11.17l6.59-6.59L16 6l-8 8z" fill="white"/>
                    </svg>
                  </div>
                  <div className="feature-text">
                    <h4>Kết nối nhanh chóng</h4>
                    <p>Liên hệ trực tiếp với nhà tuyển dụng</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Side - Form Section */}
            <div className="apple-form-section">
              <div className="form-header">
                <h2 className="apple-form-title">Tạo tài khoản</h2>
                <p className="apple-form-subtitle">Bắt đầu hành trình tìm việc của bạn</p>
              </div>

              {/* User Type Toggle */}
              <div className="apple-segmented-control">
                <button
                  type="button"
                  className={`segment ${userType === 'jobseeker' ? 'active' : ''}`}
                  onClick={() => setUserType('jobseeker')}
                  disabled={isLoading}
                >
                  Tìm việc
                </button>
                <button
                  type="button"
                  className={`segment ${userType === 'company' ? 'active' : ''}`}
                  onClick={() => setUserType('company')}
                  disabled={isLoading}
                >
                  Tuyển dụng
                </button>
              </div>

              {/* Social Login */}
              <button className="apple-social-btn" disabled={isLoading}>
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
                  <path d="M19.6 10.227c0-.709-.064-1.39-.182-2.045H10v3.868h5.382a4.6 4.6 0 01-1.996 3.018v2.51h3.232c1.891-1.742 2.982-4.305 2.982-7.35z" fill="#4285F4"/>
                  <path d="M10 20c2.7 0 4.964-.895 6.618-2.423l-3.232-2.509c-.895.6-2.04.955-3.386.955-2.605 0-4.81-1.76-5.595-4.123H1.064v2.59A9.996 9.996 0 0010 20z" fill="#34A853"/>
                  <path d="M4.405 11.9c-.2-.6-.314-1.24-.314-1.9 0-.66.114-1.3.314-1.9V5.51H1.064A9.996 9.996 0 000 10c0 1.614.386 3.14 1.064 4.49l3.34-2.59z" fill="#FBBC05"/>
                  <path d="M10 3.977c1.468 0 2.786.505 3.823 1.496l2.868-2.868C14.959.99 12.695 0 10 0 6.09 0 2.71 2.24 1.064 5.51l3.34 2.59C5.19 5.736 7.395 3.977 10 3.977z" fill="#EA4335"/>
                </svg>
                <span>Đăng ký với Google</span>
              </button>

              <div className="apple-divider">
                <span>hoặc</span>
              </div>

              {/* Signup Form */}
              <form onSubmit={handleSubmit} className="apple-form">
                {localError && (
                  <div className="apple-alert">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <circle cx="8" cy="8" r="7" stroke="currentColor" strokeWidth="1.5"/>
                      <path d="M8 4V9M8 11V12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                    </svg>
                    <span>{localError}</span>
                  </div>
                )}

                <div className="apple-form-group">
                  <label className="apple-label">Họ và tên</label>
                  <input
                    type="text"
                    className="apple-input"
                    name="fullName"
                    value={signupData.fullName}
                    onChange={handleInputChange}
                    placeholder="Nhập họ và tên"
                    required
                    disabled={isLoading}
                  />
                </div>

                <div className="apple-form-group">
                  <label className="apple-label">Email</label>
                  <input
                    type="email"
                    className="apple-input"
                    name="email"
                    value={signupData.email}
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
                    value={signupData.password}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                  {signupData.password && (
                    <div className="password-strength">
                      <div className="strength-bars">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`strength-bar ${i <= passwordStrength.score ? 'active' : ''}`}
                            style={{ backgroundColor: i <= passwordStrength.score ? passwordStrength.color : '#E5E5E5' }}
                          />
                        ))}
                      </div>
                      <span className="strength-label" style={{ color: passwordStrength.color }}>
                        {passwordStrength.label}
                      </span>
                    </div>
                  )}
                </div>

                <div className="apple-form-group">
                  <label className="apple-label">Xác nhận mật khẩu</label>
                  <input
                    type="password"
                    className="apple-input"
                    name="confirmPassword"
                    value={signupData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="••••••••"
                    required
                    disabled={isLoading}
                    autoComplete="new-password"
                  />
                </div>

                <div className="terms-notice">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="7.5" stroke="currentColor" strokeWidth="1"/>
                    <path d="M8 4V9M8 11V12" stroke="currentColor" strokeWidth="1" strokeLinecap="round"/>
                  </svg>
                  <p>
                    Bằng cách đăng ký, bạn đồng ý với <a href="#" className="terms-link">Điều khoản dịch vụ</a> và <a href="#" className="terms-link">Chính sách bảo mật</a>
                  </p>
                </div>

                <button
                  type="submit"
                  className="apple-primary-btn"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <span className="apple-spinner"></span>
                      <span>Đang đăng ký...</span>
                    </>
                  ) : (
                    'Tạo tài khoản'
                  )}
                </button>
              </form>

              <div className="apple-form-footer">
                Đã có tài khoản?
                <button
                  type="button"
                  className="apple-text-btn"
                  onClick={onSwitchToLogin}
                  disabled={isLoading}
                >
                  Đăng nhập
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ============= STYLES ============= */}
      <style jsx>{`
        /* Reset & Base */
        * {
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }

        /* Overlay */
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

        .signup-container {
          max-height: 95vh;
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
          transition: all 0.3s ease;
          z-index: 10;
          color: #86868B;
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
          overflow-y: auto;
          gap: 32px;
        }

        .apple-visual-section::before {
          content: '';
          position: absolute;
          top: -50%;
          right: -50%;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(52, 199, 89, 0.1) 0%, transparent 70%);
          pointer-events: none;
        }

        /* Logo */
        .apple-logo {
          display: flex;
          align-items: center;
          gap: 12px;
          position: relative;
          z-index: 2;
        }

        .logo-icon {
          filter: drop-shadow(0 4px 12px rgba(52, 199, 89, 0.3));
        }

        .logo-text {
          font-size: 24px;
          font-weight: 700;
          color: #1D1D1F;
          letter-spacing: -0.5px;
        }

        /* Stats Grid */
        .stats-grid {
          display: grid;
          grid-template-columns: 1fr;
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        .stat-card {
          background: rgba(255, 255, 255, 0.9);
          backdrop-filter: blur(20px);
          border-radius: 16px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          display: flex;
          align-items: center;
          gap: 16px;
          transition: all 0.3s ease;
        }

        .stat-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 12px 32px rgba(0, 0, 0, 0.12);
        }

        .card-animated {
          opacity: 0;
          animation: slideInLeft 0.6s ease-out forwards;
        }

        .stat-icon {
          width: 48px;
          height: 48px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .stat-number {
          font-size: 28px;
          font-weight: 700;
          color: #1D1D1F;
          margin: 0;
          letter-spacing: -1px;
        }

        .stat-label {
          font-size: 13px;
          color: #86868B;
          margin: 0;
          line-height: 1.4;
        }

        /* Feature List */
        .feature-list {
          display: flex;
          flex-direction: column;
          gap: 16px;
          position: relative;
          z-index: 2;
        }

        .feature-item {
          display: flex;
          gap: 12px;
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          padding: 16px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.5);
          transition: all 0.3s ease;
        }

        .feature-item:hover {
          background: rgba(255, 255, 255, 0.95);
          transform: translateX(4px);
        }

        .feature-icon {
          width: 40px;
          height: 40px;
          background: linear-gradient(135deg, #34c759, #30d158);
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          color: white;
        }

        .feature-text h4 {
          font-size: 14px;
          font-weight: 600;
          color: #1D1D1F;
          margin: 0 0 4px 0;
        }

        .feature-text p {
          font-size: 12px;
          color: #86868B;
          margin: 0;
          line-height: 1.5;
        }

        /* Form Section */
        .apple-form-section {
          padding: 60px 50px;
          display: flex;
          flex-direction: column;
          overflow-y: auto;
          background: white;
          height: 100%;
          max-height: 90vh;
        }

        /* Form Header */
        .form-header {
          text-align: center;
          margin-bottom: 32px;
        }

        .apple-form-title {
          font-size: 32px;
          font-weight: 700;
          color: #1D1D1F;
          margin: 0 0 8px 0;
          letter-spacing: -1px;
        }

        .apple-form-subtitle {
          font-size: 15px;
          color: #86868B;
          margin: 0;
          line-height: 1.5;
        }

        /* Segmented Control */
        .apple-segmented-control {
          display: flex;
          background: #F5F5F7;
          border-radius: 10px;
          padding: 3px;
          margin: 0 0 32px 0;
        }

        .segment {
          flex: 1;
          padding: 10px 16px;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 500;
          color: #86868B;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .segment.active {
          background: white;
          color: #1D1D1F;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
        }

        .segment:hover:not(.active):not(:disabled) {
          color: #1D1D1F;
        }

        .segment:disabled {
          opacity: 0.5;
          cursor: not-allowed;
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
          border-radius: 12px;
          font-size: 15px;
          font-weight: 500;
          color: #1D1D1F;
          cursor: pointer;
          transition: all 0.3s ease;
          margin-bottom: 24px;
        }

        .apple-social-btn:hover:not(:disabled) {
          background: #F5F5F7;
          border-color: #D1D1D1;
          transform: translateY(-1px);
        }

        .apple-social-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Divider */
        .apple-divider {
          display: flex;
          align-items: center;
          gap: 16px;
          margin: 24px 0;
          color: #86868B;
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
          color: #FF3B30;
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
          color: #1D1D1F;
        }

        /* Input with Icon */
        .input-with-icon {
          position: relative;
        }

        .input-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: #86868B;
          pointer-events: none;
          z-index: 1;
        }

        .apple-input {
          height: 48px;
          padding: 0 16px;
          background: #F5F5F7;
          border: 1.5px solid transparent;
          border-radius: 10px;
          font-size: 15px;
          color: #1D1D1F;
          transition: all 0.3s ease;
          width: 100%;
        }

        .apple-input.with-icon {
          padding-left: 48px;
          padding-right: 48px;
        }

        .apple-input:focus {
          outline: none;
          background: white;
          border-color: #007AFF;
          box-shadow: 0 0 0 4px rgba(0, 122, 255, 0.1);
        }

        .apple-input::placeholder {
          color: #86868B;
        }

        .apple-input:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Validation Icon */
        .validation-icon {
          position: absolute;
          right: 16px;
          top: 50%;
          transform: translateY(-50%);
          animation: scaleIn 0.2s ease-out;
          z-index: 1;
        }

        /* Password Strength */
        .password-strength {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-top: 8px;
        }

        .strength-bars {
          display: flex;
          gap: 4px;
          flex: 1;
        }

        .strength-bar {
          height: 4px;
          flex: 1;
          background: #E5E5E5;
          border-radius: 2px;
          transition: all 0.3s ease;
        }

        .strength-bar.active {
          transform: scaleY(1.2);
        }

        .strength-label {
          font-size: 12px;
          font-weight: 600;
          white-space: nowrap;
        }

        /* Terms Notice */
        .terms-notice {
          display: flex;
          gap: 12px;
          padding: 12px 16px;
          background: rgba(0, 122, 255, 0.05);
          border: 1px solid rgba(0, 122, 255, 0.1);
          border-radius: 10px;
          font-size: 13px;
          color: #86868B;
          line-height: 1.5;
        }

        .terms-notice svg {
          flex-shrink: 0;
          margin-top: 2px;
          color: #007AFF;
        }

        .terms-notice p {
          margin: 0;
        }

        .terms-link {
          color: #007AFF;
          text-decoration: none;
          font-weight: 500;
          transition: opacity 0.3s ease;
        }

        .terms-link:hover {
          opacity: 0.7;
        }

        /* Primary Button */
        .apple-primary-btn {
          height: 48px;
          background: #007AFF;
          color: white;
          border: none;
          border-radius: 10px;
          font-size: 15px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 8px;
        }

        .apple-primary-btn:hover:not(:disabled) {
          background: #0051D5;
          transform: translateY(-1px);
          box-shadow: 0 8px 24px rgba(0, 122, 255, 0.3);
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
          color: #86868B;
        }

        .apple-text-btn {
          background: none;
          border: none;
          color: #007AFF;
          font-weight: 600;
          cursor: pointer;
          margin-left: 6px;
          transition: opacity 0.3s ease;
          padding: 0;
        }

        .apple-text-btn:hover:not(:disabled) {
          opacity: 0.7;
        }

        .apple-text-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        /* Animations */
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
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

        @keyframes slideInLeft {
          from {
            opacity: 0;
            transform: translateX(-20px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes scaleIn {
          from {
            opacity: 0;
            transform: translateY(-50%) scale(0.5);
          }
          to {
            opacity: 1;
            transform: translateY(-50%) scale(1);
          }
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }

        /* Scrollbar */
        .apple-visual-section::-webkit-scrollbar,
        .apple-form-section::-webkit-scrollbar {
          width: 8px;
        }

        .apple-visual-section::-webkit-scrollbar-thumb,
        .apple-form-section::-webkit-scrollbar-thumb {
          background: rgba(0, 0, 0, 0.2);
          border-radius: 4px;
        }

        /* Responsive */
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
      `}</style>
    </>
  );
};

export default SignUp;