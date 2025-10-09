import React, { useState, useEffect } from 'react';
import './Notification.css';

const Notification = ({
    type = 'success',
    title,
    message,
    duration = 4000,
    onClose
}) => {
    const [isVisible, setIsVisible] = useState(false);
    const [isExiting, setIsExiting] = useState(false);

    useEffect(() => {
        // Hiệu ứng fade in
        setTimeout(() => setIsVisible(true), 100);

        // Auto close
        if (duration > 0) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration]);

    const handleClose = () => {
        setIsExiting(true);
        setTimeout(() => {
            onClose();
        }, 300);
    };

    const getIcon = () => {
        switch (type) {
            case 'success':
                return '✓';
            case 'error':
                return '✕';
            case 'warning':
                return '⚠';
            case 'info':
                return 'ℹ';
            default:
                return 'ℹ';
        }
    };

    return (
        <div
            className={`notification notification-${type} ${isVisible ? 'notification-visible' : ''} ${isExiting ? 'notification-exiting' : ''}`}
        >
            <div className="notification-content">
                <div className="notification-icon">{getIcon()}</div>
                <div className="notification-text">
                    {title && <div className="notification-title">{title}</div>}
                    <div className="notification-message">{message}</div>
                </div>
                <button
                    className="notification-close"
                    onClick={handleClose}
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Notification;


