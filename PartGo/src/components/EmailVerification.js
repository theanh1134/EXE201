import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { authAPI } from '../services/api';

const EmailVerification = ({ userId, email, onVerificationSuccess, onClose }) => {
    const [code, setCode] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [canResend, setCanResend] = useState(false);

    // Countdown timer
    useEffect(() => {
        if (timeLeft > 0) {
            const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
            return () => clearTimeout(timer);
        } else {
            setCanResend(true);
        }
    }, [timeLeft]);

    // Prevent body scroll when modal is open
    useEffect(() => {
        document.body.classList.add('modal-open');
        return () => {
            document.body.classList.remove('modal-open');
        };
    }, []);

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}:${secs.toString().padStart(2, '0')}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!code || code.length !== 6) {
            setError('Vui lòng nhập mã xác thực 6 chữ số');
            return;
        }

        try {
            setIsLoading(true);
            setError('');

            const response = await authAPI.verifyEmail(userId, code);

            // Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            onVerificationSuccess(response);
        } catch (error) {
            setError(error.message || 'Mã xác thực không đúng');
        } finally {
            setIsLoading(false);
        }
    };

    const handleResendCode = async () => {
        try {
            setIsLoading(true);
            setError('');

            await authAPI.resendVerification(userId);
            setTimeLeft(600); // Reset timer
            setCanResend(false);
            setCode('');

            alert('Mã xác thực mới đã được gửi đến email của bạn');
        } catch (error) {
            setError(error.message || 'Không thể gửi lại mã xác thực');
        } finally {
            setIsLoading(false);
        }
    };

    return createPortal(
        <div className="email-verification-modal">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>Xác thực Email</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="verification-info">
                        <p>Chúng tôi đã gửi mã xác thực 6 chữ số đến:</p>
                        <p className="email-address">{email}</p>
                        <p className="instruction">Vui lòng kiểm tra hộp thư và nhập mã xác thực bên dưới</p>
                    </div>

                    <form onSubmit={handleSubmit} className="verification-form">
                        <div className="input-group">
                            <label htmlFor="verification-code">Mã xác thực</label>
                            <input
                                type="text"
                                id="verification-code"
                                value={code}
                                onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                                placeholder="Nhập mã 6 chữ số"
                                maxLength="6"
                                className={error ? 'error' : ''}
                                disabled={isLoading}
                            />
                        </div>

                        {error && (
                            <div className="error-message">
                                {error}
                            </div>
                        )}

                        <div className="timer-info">
                            {timeLeft > 0 ? (
                                <p>Mã sẽ hết hạn sau: <span className="timer">{formatTime(timeLeft)}</span></p>
                            ) : (
                                <p className="expired">Mã đã hết hạn</p>
                            )}
                        </div>

                        <div className="form-actions">
                            <button
                                type="submit"
                                className="verify-btn"
                                disabled={isLoading || code.length !== 6}
                            >
                                {isLoading ? 'Đang xác thực...' : 'Xác thực'}
                            </button>
                        </div>
                    </form>

                    <div className="resend-section">
                        <p>Không nhận được mã?</p>
                        <button
                            className="resend-btn"
                            onClick={handleResendCode}
                            disabled={!canResend || isLoading}
                        >
                            Gửi lại mã
                        </button>
                    </div>
                </div>
            </div>

            <style jsx>{`
                .email-verification-modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.8);
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    z-index: 10000;
                    backdrop-filter: blur(5px);
                    animation: fadeIn 0.3s ease-out;
                }

                @keyframes fadeIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1);
                    }
                }

                .modal-content {
                    background: white;
                    border-radius: 15px;
                    width: 90%;
                    max-width: 500px;
                    max-height: 90vh;
                    overflow-y: auto;
                    box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
                    position: relative;
                    margin: 20px;
                    animation: slideIn 0.3s ease-out;
                }

                @keyframes slideIn {
                    from {
                        opacity: 0;
                        transform: translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: translateY(0);
                    }
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 20px;
                    border-bottom: 1px solid #e9ecef;
                }

                .modal-header h2 {
                    margin: 0;
                    color: #333;
                }

                .close-btn {
                    background: none;
                    border: none;
                    font-size: 24px;
                    cursor: pointer;
                    color: #666;
                }

                .modal-body {
                    padding: 20px;
                }

                .verification-info {
                    text-align: center;
                    margin-bottom: 30px;
                }

                .verification-info p {
                    margin: 10px 0;
                    color: #666;
                }

                .email-address {
                    font-weight: bold;
                    color: #ff6b35 !important;
                    font-size: 16px;
                }

                .instruction {
                    font-size: 14px;
                    color: #999;
                }

                .verification-form {
                    margin-bottom: 20px;
                }

                .input-group {
                    margin-bottom: 20px;
                }

                .input-group label {
                    display: block;
                    margin-bottom: 8px;
                    font-weight: 500;
                    color: #333;
                }

                .input-group input {
                    width: 100%;
                    padding: 12px;
                    border: 2px solid #e9ecef;
                    border-radius: 8px;
                    font-size: 18px;
                    text-align: center;
                    letter-spacing: 2px;
                    transition: border-color 0.3s;
                }

                .input-group input:focus {
                    outline: none;
                    border-color: #ff6b35;
                }

                .input-group input.error {
                    border-color: #dc3545;
                }

                .error-message {
                    background: #f8d7da;
                    color: #721c24;
                    padding: 10px;
                    border-radius: 5px;
                    margin-bottom: 15px;
                    font-size: 14px;
                }

                .timer-info {
                    text-align: center;
                    margin-bottom: 20px;
                }

                .timer-info p {
                    margin: 0;
                    color: #666;
                }

                .timer {
                    color: #ff6b35;
                    font-weight: bold;
                }

                .expired {
                    color: #dc3545 !important;
                }

                .form-actions {
                    text-align: center;
                }

                .verify-btn {
                    background: #ff6b35;
                    color: white;
                    border: none;
                    padding: 12px 30px;
                    border-radius: 8px;
                    font-size: 16px;
                    font-weight: bold;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    min-width: 150px;
                }

                .verify-btn:hover:not(:disabled) {
                    background: #e55a2b;
                }

                .verify-btn:disabled {
                    background: #ccc;
                    cursor: not-allowed;
                }

                .resend-section {
                    text-align: center;
                    padding-top: 20px;
                    border-top: 1px solid #e9ecef;
                }

                .resend-section p {
                    margin: 0 0 10px 0;
                    color: #666;
                    font-size: 14px;
                }

                .resend-btn {
                    background: none;
                    color: #ff6b35;
                    border: 1px solid #ff6b35;
                    padding: 8px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    font-size: 14px;
                    transition: all 0.3s;
                }

                .resend-btn:hover:not(:disabled) {
                    background: #ff6b35;
                    color: white;
                }

                .resend-btn:disabled {
                    color: #ccc;
                    border-color: #ccc;
                    cursor: not-allowed;
                }

                /* Mobile responsive */
                @media (max-width: 768px) {
                    .modal-content {
                        width: 95%;
                        margin: 10px;
                        max-height: 95vh;
                    }
                    
                    .modal-header h2 {
                        font-size: 20px;
                    }
                    
                    .input-group input {
                        font-size: 16px;
                        padding: 15px;
                    }
                    
                    .verify-btn {
                        padding: 15px 30px;
                        font-size: 16px;
                    }
                }

                /* Prevent body scroll when modal is open */
                body.modal-open {
                    overflow: hidden;
                }
            `}</style>
        </div>,
        document.body
    );
};

export default EmailVerification;
