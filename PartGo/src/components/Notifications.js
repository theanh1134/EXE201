import React, { useState } from 'react';
import Header from './Header';

const Notifications = ({ onBackToHome }) => {
    const [notifications, setNotifications] = useState([
        {
            id: 1,
            type: 'application',
            title: 'Application Status Update',
            message: 'Your application for "Social Media Assistant" at Nomad has been reviewed.',
            time: '2 hours ago',
            read: false,
            priority: 'high'
        },
        {
            id: 2,
            type: 'job_match',
            title: 'New Job Match',
            message: 'We found 3 new part-time jobs that match your skills and preferences.',
            time: '5 hours ago',
            read: false,
            priority: 'medium'
        },
        {
            id: 3,
            type: 'interview',
            title: 'Interview Invitation',
            message: 'You have been invited for an interview for "Content Writer" at Terraform.',
            time: '1 day ago',
            read: true,
            priority: 'high'
        },
        {
            id: 4,
            type: 'saved_job',
            title: 'Saved Job Update',
            message: 'The job "Customer Service Rep" you saved has been updated with new requirements.',
            time: '2 days ago',
            read: true,
            priority: 'low'
        },
        {
            id: 5,
            type: 'company_review',
            title: 'Review Request',
            message: 'Share your experience working at Dropbox to help other job seekers.',
            time: '3 days ago',
            read: true,
            priority: 'low'
        }
    ]);

    const [filter, setFilter] = useState('all');

    const getNotificationIcon = (type) => {
        switch (type) {
            case 'application':
                return '📋';
            case 'job_match':
                return '🎯';
            case 'interview':
                return '💼';
            case 'saved_job':
                return '⭐';
            case 'company_review':
                return '⭐';
            default:
                return '🔔';
        }
    };

    const getNotificationColor = (type, priority) => {
        if (priority === 'high') return '#ff6b35';
        if (type === 'application') return '#1976d2';
        if (type === 'job_match') return '#388e3c';
        if (type === 'interview') return '#f57c00';
        return '#6c757d';
    };

    const markAsRead = (id) => {
        setNotifications(prev =>
            prev.map(notification =>
                notification.id === id
                    ? { ...notification, read: true }
                    : notification
            )
        );
    };

    const markAllAsRead = () => {
        setNotifications(prev =>
            prev.map(notification => ({ ...notification, read: true }))
        );
    };

    const deleteNotification = (id) => {
        setNotifications(prev => prev.filter(notification => notification.id !== id));
    };

    const filteredNotifications = notifications.filter(notification => {
        if (filter === 'unread') return !notification.read;
        if (filter === 'high') return notification.priority === 'high';
        return true;
    });

    const unreadCount = notifications.filter(n => !n.read).length;

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {/* Header */}
                <Header />

                {/* Main Content */}
                <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>
                    {/* Page Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>
                                Notifications
                                {unreadCount > 0 && (
                                    <span className="badge bg-danger ms-2">{unreadCount}</span>
                                )}
                            </h1>
                            <p className="text-muted mb-0">Stay updated with your job applications and opportunities</p>
                        </div>
                        {unreadCount > 0 && (
                            <button
                                className="btn btn-outline-primary"
                                onClick={markAllAsRead}
                            >
                                Mark All as Read
                            </button>
                        )}
                    </div>

                    {/* Filter Tabs */}
                    <div className="mb-4">
                        <ul className="nav nav-pills">
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${filter === 'all' ? 'active' : ''}`}
                                    onClick={() => setFilter('all')}
                                    style={{
                                        backgroundColor: filter === 'all' ? '#ff6b35' : 'transparent',
                                        color: filter === 'all' ? 'white' : '#6c757d',
                                        border: 'none',
                                        borderRadius: '20px',
                                        marginRight: '8px'
                                    }}
                                >
                                    All ({notifications.length})
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${filter === 'unread' ? 'active' : ''}`}
                                    onClick={() => setFilter('unread')}
                                    style={{
                                        backgroundColor: filter === 'unread' ? '#ff6b35' : 'transparent',
                                        color: filter === 'unread' ? 'white' : '#6c757d',
                                        border: 'none',
                                        borderRadius: '20px',
                                        marginRight: '8px'
                                    }}
                                >
                                    Unread ({unreadCount})
                                </button>
                            </li>
                            <li className="nav-item">
                                <button
                                    className={`nav-link ${filter === 'high' ? 'active' : ''}`}
                                    onClick={() => setFilter('high')}
                                    style={{
                                        backgroundColor: filter === 'high' ? '#ff6b35' : 'transparent',
                                        color: filter === 'high' ? 'white' : '#6c757d',
                                        border: 'none',
                                        borderRadius: '20px'
                                    }}
                                >
                                    High Priority
                                </button>
                            </li>
                        </ul>
                    </div>

                    {/* Notifications List */}
                    <div className="bg-white rounded-3 shadow-sm">
                        {filteredNotifications.length === 0 ? (
                            <div className="text-center py-5">
                                <div style={{ fontSize: '3rem', color: '#6c757d', marginBottom: '1rem' }}>
                                    🔔
                                </div>
                                <h5 className="text-muted">No notifications</h5>
                                <p className="text-muted">You're all caught up!</p>
                            </div>
                        ) : (
                            <div className="list-group list-group-flush">
                                {filteredNotifications.map((notification) => (
                                    <div
                                        key={notification.id}
                                        className={`list-group-item list-group-item-action ${!notification.read ? 'bg-light' : ''
                                            }`}
                                        style={{
                                            border: 'none',
                                            borderBottom: '1px solid #f1f3f4',
                                            cursor: 'pointer'
                                        }}
                                        onClick={() => markAsRead(notification.id)}
                                    >
                                        <div className="d-flex align-items-start">
                                            <div
                                                className="me-3 d-flex align-items-center justify-content-center rounded-circle"
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    backgroundColor: getNotificationColor(notification.type, notification.priority) + '20',
                                                    fontSize: '1.5rem',
                                                    flexShrink: 0
                                                }}
                                            >
                                                <span style={{ color: getNotificationColor(notification.type, notification.priority) }}>
                                                    {getNotificationIcon(notification.type)}
                                                </span>
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <h6 className={`mb-1 ${!notification.read ? 'fw-bold' : 'fw-medium'}`}>
                                                        {notification.title}
                                                        {!notification.read && (
                                                            <span className="badge bg-primary ms-2" style={{ fontSize: '8px' }}>
                                                                NEW
                                                            </span>
                                                        )}
                                                    </h6>
                                                    <div className="d-flex align-items-center gap-2">
                                                        <small className="text-muted">{notification.time}</small>
                                                        <button
                                                            className="btn btn-sm btn-outline-danger"
                                                            onClick={(e) => {
                                                                e.stopPropagation();
                                                                deleteNotification(notification.id);
                                                            }}
                                                            style={{ padding: '2px 6px', fontSize: '12px' }}
                                                        >
                                                            ×
                                                        </button>
                                                    </div>
                                                </div>
                                                <p className="text-muted mb-0" style={{ lineHeight: '1.4' }}>
                                                    {notification.message}
                                                </p>
                                                {notification.priority === 'high' && (
                                                    <span className="badge bg-danger mt-2" style={{ fontSize: '10px' }}>
                                                        HIGH PRIORITY
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Notification Settings */}
                    <div className="bg-white p-4 rounded-3 shadow-sm mt-4">
                        <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Notification Settings</h5>
                        <div className="row">
                            <div className="col-md-6">
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="emailNotifications"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="emailNotifications">
                                        Email notifications
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="jobMatches"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="jobMatches">
                                        New job matches
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="applicationUpdates"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="applicationUpdates">
                                        Application updates
                                    </label>
                                </div>
                                <div className="form-check mb-3">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        id="interviewInvites"
                                        defaultChecked
                                    />
                                    <label className="form-check-label" htmlFor="interviewInvites">
                                        Interview invitations
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Notifications;









