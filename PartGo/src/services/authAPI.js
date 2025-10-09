import axios from 'axios';

// Base URL for API
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true, // ✅ Thêm dòng này
});

// Add token to requests if available
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        console.log('API Request interceptor - token:', token ? 'exists' : 'missing');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        console.error('API Request interceptor error:', error);
        return Promise.reject(error);
    }
);

// Handle token expiration
api.interceptors.response.use(
    (response) => response,
    (error) => {
        console.log('API Response interceptor - error:', error.response?.status, error.response?.data);
        if (error.response?.status === 401) {
            console.log('401 Unauthorized - clearing auth data and redirecting');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            // Don't redirect immediately, let the component handle it
            // window.location.href = '/';
        }
        return Promise.reject(error);
    }
);

// Auth API functions
export const forgotPassword = async (email) => {
    try {
        const response = await api.post('/auth/forgot-password', { email });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const resetPassword = async (userId, code, newPassword) => {
    try {
        const response = await api.post('/auth/reset-password', {
            userId,
            code,
            newPassword
        });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });

        // ✅ Lưu token và user vào localStorage
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const registerCompany = async (companyData) => {
    try {
        const response = await api.post('/auth/register-company', companyData);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const verifyEmail = async (userId, code) => {
    try {
        const response = await api.post('/auth/verify-email', { userId, code });

        // ✅ Lưu token và user sau khi verify thành công
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
        }
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const resendVerification = async (userId) => {
    try {
        const response = await api.post('/auth/resend-verification', { userId });
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user'); // ✅ Thêm dòng này
};

// ✅ Sửa lại hàm getCurrentUser - ưu tiên lấy từ localStorage trước
export const getCurrentUser = () => {
    // Thử lấy user từ localStorage trước (đã lưu khi login)
    const userStr = localStorage.getItem('user');
    if (userStr) {
        try {
            const user = JSON.parse(userStr);
            console.log('getCurrentUser - from localStorage:', user);
            return user;
        } catch (error) {
            console.error('getCurrentUser - parse error:', error);
        }
    }

    // Nếu không có, thử decode từ token
    const token = localStorage.getItem('token');
    console.log('getCurrentUser - token:', token);
    if (!token) return null;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        console.log('getCurrentUser - payload:', payload);

        // Token payload có thể có cấu trúc khác nhau
        const user = {
            id: payload.userId || payload.id,
            email: payload.email,
            role: payload.role,
            fullName: payload.fullName,
            company: payload.company
        };

        // Lưu lại vào localStorage để lần sau không phải decode
        localStorage.setItem('user', JSON.stringify(user));

        return user;
    } catch (error) {
        console.error('getCurrentUser - error:', error);
        return null;
    }
};

export const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    console.log('isAuthenticated - checking token:', token ? 'exists' : 'missing');

    if (!token) return false;

    try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        const isValid = payload.exp > Date.now() / 1000;

        console.log('isAuthenticated - token payload:', payload);
        console.log('isAuthenticated - token valid:', isValid);

        // ✅ Nếu token hết hạn, xóa dữ liệu
        if (!isValid) {
            console.log('isAuthenticated - token expired, clearing auth data');
            localStorage.removeItem('token');
            localStorage.removeItem('user');
        }

        return isValid;
    } catch (error) {
        console.error('isAuthenticated - error:', error);
        return false;
    }
};

// Validate current auth state
export const validateAuthState = async () => {
    try {
        const token = localStorage.getItem('token');
        if (!token) {
            throw new Error('No token found');
        }

        // Try to make a simple authenticated request
        const response = await api.get('/auth/me');
        console.log('validateAuthState - success:', response.data);
        return response.data;
    } catch (error) {
        console.error('validateAuthState - error:', error);
        // Clear invalid auth data
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        throw error;
    }
};

export const saveProfile = async (userId, profileData) => {
    try {
        const response = await api.put('/auth/profile', { userId, profileData });

        // ✅ Cập nhật user trong localStorage
        if (response.data.user) {
            localStorage.setItem('user', JSON.stringify(response.data.user));
        }

        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export const getProfile = async (userId) => {
    try {
        const response = await api.get(`/auth/profile/${userId}`);
        return response.data;
    } catch (error) {
        throw error.response?.data || error.message;
    }
};

export default api;