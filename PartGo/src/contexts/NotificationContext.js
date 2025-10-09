import React, { createContext, useContext, useState, useCallback } from 'react';
import Notification from '../components/Notification';

const NotificationContext = createContext();

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};

export const NotificationProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);

    const addNotification = useCallback((notification) => {
        const id = Date.now() + Math.random();
        const newNotification = {
            id,
            type: 'success',
            duration: 4000,
            ...notification,
        };

        setNotifications(prev => [...prev, newNotification]);
        return id;
    }, []);

    const removeNotification = useCallback((id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, []);

    const success = useCallback((message, title = 'Thành công') => {
        return addNotification({
            type: 'success',
            title,
            message,
        });
    }, [addNotification]);

    const error = useCallback((message, title = 'Lỗi') => {
        return addNotification({
            type: 'error',
            title,
            message,
            duration: 6000,
        });
    }, [addNotification]);

    const warning = useCallback((message, title = 'Cảnh báo') => {
        return addNotification({
            type: 'warning',
            title,
            message,
            duration: 5000,
        });
    }, [addNotification]);

    const info = useCallback((message, title = 'Thông tin') => {
        return addNotification({
            type: 'info',
            title,
            message,
        });
    }, [addNotification]);

    const value = {
        addNotification,
        removeNotification,
        success,
        error,
        warning,
        info,
    };

    return (
        <NotificationContext.Provider value={value}>
            {children}
            <div className="notification-container">
                {notifications.map(notification => (
                    <Notification
                        key={notification.id}
                        {...notification}
                        onClose={() => removeNotification(notification.id)}
                    />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

