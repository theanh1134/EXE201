import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { useAuth } from '../contexts/AuthContext';

const ForgotPassword = ({ isOpen, onClose, onShowLogin }) => {
    const { forgotPassword, resetPassword, loading, error, clearError } = useAuth();
    const [step, setStep] = useState(1); // 1: Enter email, 2: Enter OTP, 3: Enter new password
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [resetData, setResetData] = useState(null);
    const [countdown, setCountdown] = useState(0);

    // Countdown timer
    React.useEffect(() => {
        let timer;
        if (countdown > 0) {
            timer = setTimeout(() => setCountdown(countdown - 1), 1000);
        }
        return () => clearTimeout(timer);
    }, [countdown]);

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            clearError();
            const data = await forgotPassword(email);
            setResetData(data);
            setStep(2);
            setCountdown(300); // 5 minutes
        } catch (error) {
            console.error('Forgot password error:', error);
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        if (otp.length !== 6) {
            return;
        }
        setStep(3);
    };

    const handlePasswordSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            return;
        }
        if (newPassword.length < 6) {
            return;
        }
        try {
            clearError();
            await resetPassword(resetData.userId, otp, newPassword);
            alert('Mật khẩu đã được reset thành công!');
            handleClose();
        } catch (error) {
            console.error('Reset password error:', error);
        }
    };

    const handleClose = () => {
        setStep(1);
        setEmail('');
        setOtp('');
        setNewPassword('');
        setConfirmPassword('');
        setResetData(null);
        setCountdown(0);
        clearError();
        onClose();
    };

    const handleResendCode = async () => {
        try {
            clearError();
            const data = await forgotPassword(email);
            setResetData(data);
            setCountdown(300);
        } catch (error) {
            console.error('Resend code error:', error);
        }
    };

    const handleBackToLogin = () => {
        handleClose();
        onShowLogin();
    };

    if (!isOpen) return null;

    return createPortal(
        <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1060,
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                backgroundColor: 'white',
                borderRadius: '16px',
                padding: '32px',
                maxWidth: '400px',
                width: '90%',
                maxHeight: '90vh',
                overflow: 'auto',
                boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                animation: 'slideIn 0.3s ease-out'
            }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                    <div style={{
                        width: '60px',
                        height: '60px',
                        backgroundColor: '#ff6b35',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        margin: '0 auto 16px',
                        fontSize: '24px'
                    }}>
                        🔐
                    </div>
                    <h2 style={{ margin: 0, color: '#2c3e50', fontSize: '24px', fontWeight: 'bold' }}>
                        {step === 1 && 'Quên mật khẩu?'}
                        {step === 2 && 'Nhập mã xác thực'}
                        {step === 3 && 'Tạo mật khẩu mới'}
                    </h2>
                    <p style={{ margin: '8px 0 0', color: '#6c757d', fontSize: '14px' }}>
                        {step === 1 && 'Nhập email để nhận mã reset mật khẩu'}
                        {step === 2 && `Mã đã được gửi đến ${email}`}
                        {step === 3 && 'Nhập mật khẩu mới của bạn'}
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div style={{
                        backgroundColor: '#f8d7da',
                        color: '#721c24',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '16px',
                        fontSize: '14px',
                        border: '1px solid #f5c6cb'
                    }}>
                        {error}
                    </div>
                )}

                {/* Step 1: Enter Email */}
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
                                Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Nhập email của bạn"
                                required
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading || !email}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: loading || !email ? '#ccc' : '#ff6b35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading || !email ? 'not-allowed' : 'pointer',
                                marginBottom: '16px'
                            }}
                        >
                            {loading ? 'Đang gửi...' : 'Gửi mã reset'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={handleBackToLogin}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#ff6b35',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                }}
                            >
                                Quay lại đăng nhập
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 2: Enter OTP */}
                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
                                Mã xác thực (6 số)
                            </label>
                            <input
                                type="text"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Nhập mã 6 số"
                                required
                                maxLength="6"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    textAlign: 'center',
                                    letterSpacing: '2px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {countdown > 0 && (
                                <p style={{ textAlign: 'center', margin: '8px 0 0', color: '#6c757d', fontSize: '14px' }}>
                                    Mã sẽ hết hạn sau {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={otp.length !== 6}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: otp.length !== 6 ? '#ccc' : '#ff6b35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: otp.length !== 6 ? 'not-allowed' : 'pointer',
                                marginBottom: '16px'
                            }}
                        >
                            Xác thực
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={handleResendCode}
                                disabled={countdown > 0}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: countdown > 0 ? '#ccc' : '#ff6b35',
                                    cursor: countdown > 0 ? 'not-allowed' : 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline',
                                    marginRight: '16px'
                                }}
                            >
                                {countdown > 0 ? `Gửi lại sau ${countdown}s` : 'Gửi lại mã'}
                            </button>
                            <button
                                type="button"
                                onClick={() => setStep(1)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6c757d',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                }}
                            >
                                Thay đổi email
                            </button>
                        </div>
                    </form>
                )}

                {/* Step 3: Enter New Password */}
                {step === 3 && (
                    <form onSubmit={handlePasswordSubmit}>
                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
                                Mật khẩu mới
                            </label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Nhập mật khẩu mới"
                                required
                                minLength="6"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                        </div>

                        <div style={{ marginBottom: '20px' }}>
                            <label style={{ display: 'block', marginBottom: '8px', fontWeight: '500', color: '#2c3e50' }}>
                                Xác nhận mật khẩu
                            </label>
                            <input
                                type="password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                placeholder="Nhập lại mật khẩu mới"
                                required
                                minLength="6"
                                style={{
                                    width: '100%',
                                    padding: '12px',
                                    border: '1px solid #e9ecef',
                                    borderRadius: '8px',
                                    fontSize: '16px',
                                    boxSizing: 'border-box'
                                }}
                            />
                            {newPassword && confirmPassword && newPassword !== confirmPassword && (
                                <p style={{ color: '#dc3545', fontSize: '12px', margin: '4px 0 0' }}>
                                    Mật khẩu không khớp
                                </p>
                            )}
                        </div>

                        <button
                            type="submit"
                            disabled={loading || newPassword !== confirmPassword || newPassword.length < 6}
                            style={{
                                width: '100%',
                                padding: '12px',
                                backgroundColor: loading || newPassword !== confirmPassword || newPassword.length < 6 ? '#ccc' : '#ff6b35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: '600',
                                cursor: loading || newPassword !== confirmPassword || newPassword.length < 6 ? 'not-allowed' : 'pointer',
                                marginBottom: '16px'
                            }}
                        >
                            {loading ? 'Đang reset...' : 'Reset mật khẩu'}
                        </button>

                        <div style={{ textAlign: 'center' }}>
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    color: '#6c757d',
                                    cursor: 'pointer',
                                    fontSize: '14px',
                                    textDecoration: 'underline'
                                }}
                            >
                                Quay lại nhập mã
                            </button>
                        </div>
                    </form>
                )}

                {/* Close Button */}
                <button
                    onClick={handleClose}
                    style={{
                        position: 'absolute',
                        top: '16px',
                        right: '16px',
                        background: 'none',
                        border: 'none',
                        fontSize: '24px',
                        cursor: 'pointer',
                        color: '#6c757d',
                        width: '32px',
                        height: '32px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '50%',
                        backgroundColor: '#f8f9fa'
                    }}
                >
                    ×
                </button>
            </div>

            <style>{`
                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
            `}</style>
        </div>,
        document.body
    );
};

export default ForgotPassword;
