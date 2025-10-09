import React, { useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import './ProtectedRoute.css';

const ProtectedRoute = ({
    children,
    requiredRole = null,
    fallbackComponent = null,
    redirectTo = '/',
    showNotification = true
}) => {
    const { user, isAuthenticated } = useAuth();
    const { warning } = useNotification();

    // Use useEffect to avoid setState during render
    useEffect(() => {
        if (!isAuthenticated || !user) {
            if (showNotification) {
                warning('Vui lòng đăng nhập để truy cập tính năng này', 'Cần đăng nhập');
            }
        } else if (requiredRole && user.role !== requiredRole) {
            if (showNotification) {
                warning(`Chỉ tài khoản ${requiredRole === 'employer' ? 'công ty' : 'ứng viên'} mới có thể truy cập tính năng này`, 'Không có quyền truy cập');
            }
        }
    }, [isAuthenticated, user, requiredRole, showNotification, warning]);

    // Kiểm tra đăng nhập
    if (!isAuthenticated || !user) {
        return fallbackComponent || (
            <div className="access-denied">
                <div className="access-denied-content">
                    <h2>🔒 Cần đăng nhập</h2>
                    <p>Vui lòng đăng nhập để truy cập tính năng này.</p>
                    <button
                        onClick={() => window.location.href = redirectTo}
                        className="btn-primary"
                    >
                        Về trang chủ
                    </button>
                </div>
            </div>
        );
    }

    // Kiểm tra role nếu có yêu cầu
    if (requiredRole && user.role !== requiredRole) {
        return fallbackComponent || (
            <div className="access-denied">
                <div className="access-denied-content">
                    <h2>🚫 Không có quyền truy cập</h2>
                    <p>
                        Chỉ tài khoản {requiredRole === 'employer' ? 'công ty' : 'ứng viên'} mới có thể truy cập tính năng này.
                    </p>
                    <div className="access-denied-actions">
                        <button
                            onClick={() => window.location.href = redirectTo}
                            className="btn-secondary"
                        >
                            Về trang chủ
                        </button>
                        <button
                            onClick={() => window.location.href = '/profile'}
                            className="btn-primary"
                        >
                            Xem hồ sơ
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    // Nếu đã đăng nhập và có đúng role, hiển thị children
    return children;
};

export default ProtectedRoute;
