import React, { createContext, useContext, useState, useEffect } from 'react';
import { forgotPassword as forgotPasswordAPI, resetPassword as resetPasswordAPI, login as loginAPI, register as registerAPI, registerCompany as registerCompanyAPI, verifyEmail as verifyEmailAPI, resendVerification as resendVerificationAPI, logout as logoutAPI, getCurrentUser, isAuthenticated, validateAuthState } from '../services/authAPI';
import frontendEmailService from '../services/frontendEmailService';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pendingVerification, setPendingVerification] = useState(null);

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedUser = JSON.parse(localStorage.getItem('user') || 'null');
                console.log('AuthContext init - savedUser:', savedUser, 'isAuthenticated:', isAuthenticated());

                if (savedUser && isAuthenticated()) {
                    try {
                        // Validate token with server
                        const validatedUser = await validateAuthState();
                        setUser(validatedUser);
                        console.log('AuthContext - User validated with server:', validatedUser);
                    } catch (error) {
                        console.error('AuthContext - Token validation failed:', error);
                        // Token is invalid, clear auth state
                        setUser(null);
                        logoutAPI();
                    }
                } else {
                    console.log('AuthContext - No valid auth state found');
                    setUser(null);
                }

                // Check for pending verification
                const savedPendingVerification = localStorage.getItem('pendingVerification');
                if (savedPendingVerification) {
                    try {
                        const verificationData = JSON.parse(savedPendingVerification);
                        setPendingVerification(verificationData);
                    } catch (error) {
                        console.error('Error parsing pending verification:', error);
                        localStorage.removeItem('pendingVerification');
                    }
                }
            } catch (error) {
                console.error('Auth initialization error:', error);
                setUser(null);
                logoutAPI();
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    // Register job seeker (Step 1: Send OTP)
    const register = async (userData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await registerAPI(userData);

            // Store pending verification data
            const verificationData = {
                userId: response.userId,
                email: response.email,
                expiresIn: response.expiresIn
            };

            setPendingVerification(verificationData);
            localStorage.setItem('pendingVerification', JSON.stringify(verificationData));

            // Gửi email OTP từ frontend
            try {
                await frontendEmailService.sendVerificationCode(
                    response.email,
                    response.code || '123456', // Mock code nếu backend không trả về
                    userData.fullName
                );
                console.log('✅ Verification email sent from frontend');
            } catch (emailError) {
                console.warn('⚠️ Frontend email failed:', emailError);
                // Không throw error vì backend đã tạo user thành công
            }

            return response;
        } catch (error) {
            setError(error.message || 'Registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Register company (Step 1: Send OTP)
    const registerCompany = async (companyData) => {
        try {
            setError(null);
            setLoading(true);

            const response = await registerCompanyAPI(companyData);

            // Store pending verification data
            const verificationData = {
                userId: response.userId,
                companyId: response.companyId,
                email: response.email,
                expiresIn: response.expiresIn
            };

            setPendingVerification(verificationData);
            localStorage.setItem('pendingVerification', JSON.stringify(verificationData));

            // Gửi email OTP từ frontend
            try {
                await frontendEmailService.sendVerificationCode(
                    response.email,
                    response.code || '123456', // Mock code nếu backend không trả về
                    companyData.name
                );
                console.log('✅ Verification email sent from frontend');
            } catch (emailError) {
                console.warn('⚠️ Frontend email failed:', emailError);
                // Không throw error vì backend đã tạo user thành công
            }

            return response;
        } catch (error) {
            setError(error.message || 'Company registration failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Login
    const login = async (credentials) => {
        try {
            setError(null);
            setLoading(true);

            const response = await loginAPI(credentials.email, credentials.password);

            // Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log('Login - response.user:', response.user);
            console.log('Login - response.user.companyId:', response.user?.companyId);

            setUser(response.user);
            return response;
        } catch (error) {
            setError(error.message || 'Login failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = (onLogoutSuccess) => {
        logoutAPI();
        setUser(null);
        setError(null);
        setPendingVerification(null);
        localStorage.removeItem('pendingVerification');

        // Call callback if provided
        if (onLogoutSuccess && typeof onLogoutSuccess === 'function') {
            onLogoutSuccess();
        }
    };

    // Verify email with OTP
    const verifyEmail = async (userId, code) => {
        try {
            setError(null);
            setLoading(true);

            const response = await verifyEmailAPI(userId, code);

            console.log('VerifyEmail - Full response:', response);
            console.log('VerifyEmail - response.user:', response.user);
            console.log('VerifyEmail - response.user.companyId:', response.user?.companyId);

            // Save token and user data
            localStorage.setItem('token', response.token);
            localStorage.setItem('user', JSON.stringify(response.user));

            console.log('VerifyEmail - response.user:', response.user);
            console.log('VerifyEmail - response.user.companyId:', response.user?.companyId);

            setUser(response.user);
            setPendingVerification(null);
            localStorage.removeItem('pendingVerification');

            // Gửi welcome email từ frontend
            try {
                await frontendEmailService.sendWelcomeEmail(
                    response.user.email,
                    response.user.fullName,
                    response.user.role
                );
                console.log('✅ Welcome email sent from frontend');
            } catch (emailError) {
                console.warn('⚠️ Welcome email failed:', emailError);
                // Không throw error vì verification đã thành công
            }

            return response;
        } catch (error) {
            setError(error.message || 'Email verification failed');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Resend verification code
    const resendVerification = async (userId) => {
        try {
            setError(null);
            const response = await resendVerificationAPI(userId);
            return response;
        } catch (error) {
            setError(error.message || 'Failed to resend verification code');
            throw error;
        }
    };

    // Clear pending verification
    const clearPendingVerification = () => {
        setPendingVerification(null);
        localStorage.removeItem('pendingVerification');
    };

    // Clear error
    const clearError = () => {
        setError(null);
    };

    // Forgot password
    const forgotPassword = async (email) => {
        try {
            setError(null);
            setLoading(true);

            const response = await forgotPasswordAPI(email);
            console.log('Forgot password API response:', response);

            // Store reset data for EmailJS to send
            const resetData = {
                userId: response.userId,
                email: response.email,
                code: response.code
            };
            console.log('Reset data:', resetData);

            // Send OTP via EmailJS
            await frontendEmailService.sendPasswordResetCode(resetData.email, resetData.code);

            return resetData;
        } catch (error) {
            setError(error.message || 'Failed to send password reset code');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Reset password
    const resetPassword = async (userId, code, newPassword) => {
        try {
            setError(null);
            setLoading(true);

            const response = await resetPasswordAPI(userId, code, newPassword);
            return response;
        } catch (error) {
            setError(error.message || 'Failed to reset password');
            throw error;
        } finally {
            setLoading(false);
        }
    };

    const value = {
        user,
        loading,
        error,
        pendingVerification,
        isAuthenticated: !!user,
        register,
        registerCompany,
        login,
        logout,
        verifyEmail,
        resendVerification,
        forgotPassword,
        resetPassword,
        clearPendingVerification,
        clearError
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};
