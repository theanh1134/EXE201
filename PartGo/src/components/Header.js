import React, { useState, useEffect, useRef } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostJobModal from './PostJobModal';
import EmployerPricingModal from './EmployerPricingModal';

const Header = ({ 
  onOpenCv, 
  onOpenCompanyDashboard, 
  onOpenPostJob, 
  onOpenPricing, 
  onShowLogin, 
  onShowSignUp, 
  onLogout 
}) => {
  const { user, isAuthenticated, logout } = useAuth();
  const [showPostJob, setShowPostJob] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showEmployerMenu, setShowEmployerMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  const employerMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (employerMenuRef.current && !employerMenuRef.current.contains(event.target)) {
        setShowEmployerMenu(false);
      }
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
    setShowUserMenu(false);
    setShowEmployerMenu(false);
  };

  // Render user menu based on role
  const renderUserMenu = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="apple-header-actions">
          <button
            className="apple-btn-outline"
            onClick={onShowLogin}
          >
            Đăng nhập
          </button>
          <button
            className="apple-btn-primary"
            onClick={onShowSignUp}
          >
            Đăng ký
          </button>
        </div>
      );
    }

    if (user.role === 'employer') {
      return (
        <div className="apple-header-actions">
          {/* Dashboard Dropdown */}
          <div className="apple-dropdown" ref={employerMenuRef}>
            <button
              className="apple-nav-link"
              onClick={() => setShowEmployerMenu(!showEmployerMenu)}
            >
              Dashboard
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '6px' }}>
                <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            {showEmployerMenu && (
              <div className="apple-dropdown-menu">
                <a className="apple-dropdown-item" href="/company-dashboard">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  </svg>
                  Dashboard
                </a>
                <a className="apple-dropdown-item" href="/company-dashboard/jobs">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M6 5H10M6 8H10M6 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Quản lý tin tuyển dụng
                </a>
                <a className="apple-dropdown-item" href="/company-dashboard/applications">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M3 13C3 10.5 5 9 8 9C11 9 13 10.5 13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Quản lý ứng viên
                </a>
                <a className="apple-dropdown-item" href="/company-dashboard/analytics">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M3 13V9M8 13V3M13 13V6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Thống kê
                </a>
              </div>
            )}
          </div>

          {/* User Avatar Dropdown */}
          <div className="apple-dropdown" ref={userMenuRef}>
            <button
              className="apple-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="apple-avatar">
                {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <span className="apple-user-name">{user.fullName || user.email}</span>
            </button>
            {showUserMenu && (
              <div className="apple-dropdown-menu apple-user-menu">
                <div className="apple-user-info">
                  <div className="apple-avatar-large">
                    {user.fullName?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <div>
                    <div className="apple-user-fullname">{user.fullName || 'Người dùng'}</div>
                    <div className="apple-user-email">{user.email}</div>
                  </div>
                </div>
                <div className="apple-dropdown-divider"></div>
                <a className="apple-dropdown-item" href="/company-dashboard">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <rect x="2" y="3" width="12" height="10" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M5 6H7M5 9H7M9 6H11M9 9H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Hồ sơ công ty
                </a>
                <a className="apple-dropdown-item" href="/settings">
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <circle cx="8" cy="8" r="2" stroke="currentColor" strokeWidth="1.5"/>
                    <path d="M8 1V3M8 13V15M15 8H13M3 8H1M12.5 3.5L11.1 4.9M4.9 11.1L3.5 12.5M12.5 12.5L11.1 11.1M4.9 4.9L3.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                  </svg>
                  Cài đặt
                </a>
                <div className="apple-dropdown-divider"></div>
                <button className="apple-dropdown-item apple-logout" onClick={handleLogout}>
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Job seeker menu
    return (
      <div className="apple-header-actions">
        <div className="apple-dropdown" ref={userMenuRef}>
          <button
            className="apple-avatar-btn"
            onClick={() => setShowUserMenu(!showUserMenu)}
          >
            <div className="apple-avatar">
              {user.fullName?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
            </div>
            <span className="apple-user-name">{user.fullName || user.email}</span>
          </button>
          {showUserMenu && (
            <div className="apple-dropdown-menu apple-user-menu">
              <div className="apple-user-info">
                <div className="apple-avatar-large">
                  {user.fullName?.[0]?.toUpperCase() || 'U'}
                </div>
                <div>
                  <div className="apple-user-fullname">{user.fullName || 'Người dùng'}</div>
                  <div className="apple-user-email">{user.email}</div>
                </div>
              </div>
              <div className="apple-dropdown-divider"></div>
              <a className="apple-dropdown-item" href="/profile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <circle cx="8" cy="5" r="2.5" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M3 13C3 10.5 5 9 8 9C11 9 13 10.5 13 13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Hồ sơ cá nhân
              </a>
              <a className="apple-dropdown-item" href="/profile/cv">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 5H10M6 8H10M6 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Tạo CV
              </a>
              <a className="apple-dropdown-item" href="/jobs">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M8 3V13M13 8L8 13L3 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  <path d="M11 2L8 5L5 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Việc làm đã lưu
              </a>
              <a className="apple-dropdown-item" href="/profile">
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <rect x="3" y="4" width="10" height="9" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 7H10M6 10H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Đơn ứng tuyển
              </a>
              <div className="apple-dropdown-divider"></div>
              <button className="apple-dropdown-item apple-logout" onClick={handleLogout}>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path d="M6 14H3C2.44772 14 2 13.5523 2 13V3C2 2.44772 2.44772 2 3 2H6M11 11L14 8M14 8L11 5M14 8H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <>
      <header className={`apple-header ${isScrolled ? 'scrolled' : ''}`}>
        <div className="apple-header-container">
          {/* Logo */}
          <a className="apple-logo" href="/jobs" onClick={(e) => { e.preventDefault(); window.location.href = '/jobs'; }}>
            <div className="apple-logo-icon">
              <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                <rect width="28" height="28" rx="7" fill="url(#logo-gradient)"/>
                <path d="M14 7L17.5 14L14 21L10.5 14L14 7Z" fill="white" opacity="0.9"/>
                <defs>
                  <linearGradient id="logo-gradient" x1="0" y1="0" x2="28" y2="28">
                    <stop offset="0%" stopColor="#007AFF"/>
                    <stop offset="100%" stopColor="#0051D5"/>
                  </linearGradient>
                </defs>
              </svg>
            </div>
            <span className="apple-logo-text">Part GO</span>
          </a>

          {/* Desktop Navigation */}
          <nav className="apple-nav">
            <a className="apple-nav-link active" href="/jobs">
              Tìm việc làm
            </a>

            {/* Employer Menu - Only show for non-employer users */}
            {(!isAuthenticated || user?.role !== 'employer') && (
              <div className="apple-dropdown" ref={employerMenuRef}>
                <button
                  className="apple-nav-link"
                  onClick={() => setShowEmployerMenu(!showEmployerMenu)}
                >
                  Dành cho nhà tuyển dụng
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none" style={{ marginLeft: '6px' }}>
                    <path d="M3 4.5L6 7.5L9 4.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </button>
                {showEmployerMenu && (
                  <div className="apple-dropdown-menu">
                    <button className="apple-dropdown-item" onClick={() => { setShowPostJob(true); onOpenPostJob?.(); }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 5V11M5 8H11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Đăng tuyển việc làm
                    </button>
                    <button className="apple-dropdown-item" onClick={onOpenCompanyDashboard}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <rect x="2" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="9" y="2" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="2" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                        <rect x="9" y="9" width="5" height="5" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                      </svg>
                      Bảng điều khiển công ty
                    </button>
                    <button className="apple-dropdown-item" onClick={() => { setShowPricing(true); onOpenPricing?.(); }}>
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.5"/>
                        <path d="M8 4V5M8 10V12M10 7C10 6 9 5.5 8 5.5C7 5.5 6 6 6 7C6 8 7 8.5 8 8.5C9 8.5 10 9 10 10C10 11 9 11.5 8 11.5C7 11.5 6 11 6 10" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                      </svg>
                      Bảng giá
                    </button>
                  </div>
                )}
              </div>
            )}
          </nav>

          {/* Right Actions */}
          <div className="apple-header-right">
            {/* CV Button - Only for job seekers */}
            {isAuthenticated && user?.role === 'jobseeker' && (
              <button
                className="apple-btn-outline"
                onClick={onOpenCv}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={{ marginRight: '6px' }}>
                  <rect x="3" y="2" width="10" height="12" rx="1" stroke="currentColor" strokeWidth="1.5"/>
                  <path d="M6 5H10M6 8H10M6 11H8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                </svg>
                Tạo CV
              </button>
            )}

            {/* User Menu */}
            {renderUserMenu()}

            {/* Mobile Menu Toggle */}
            <button
              className="apple-mobile-toggle"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M6 6L18 18M18 6L6 18" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              ) : (
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 6H20M4 12H20M4 18H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="apple-mobile-menu">
            <a className="apple-mobile-link" href="/jobs">
              Tìm việc làm
            </a>
            {(!isAuthenticated || user?.role !== 'employer') && (
              <>
                <button className="apple-mobile-link" onClick={() => { setShowPostJob(true); setIsMobileMenuOpen(false); }}>
                  Đăng tuyển việc làm
                </button>
                <button className="apple-mobile-link" onClick={() => { onOpenCompanyDashboard(); setIsMobileMenuOpen(false); }}>
                  Bảng điều khiển công ty
                </button>
                <button className="apple-mobile-link" onClick={() => { setShowPricing(true); setIsMobileMenuOpen(false); }}>
                  Bảng giá
                </button>
              </>
            )}
          </div>
        )}
      </header>

      {/* Modals */}
      <PostJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} />
      <EmployerPricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />

      {/* Styles */}
      <style jsx>{`
        /* Variables */
        :root {
          --apple-blue: #007AFF;
          --apple-dark: #1D1D1F;
          --apple-gray: #86868B;
          --apple-light-gray: #F5F5F7;
          --apple-border: #E5E5E5;
          --apple-red: #FF3B30;
          --header-height: 64px;
          --apple-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
        }

        /* Header */
        .apple-header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          height: var(--header-height);
          background: rgba(255, 255, 255, 0.8);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid transparent;
          z-index: 1000;
          transition: var(--apple-transition);
        }

        .apple-header.scrolled {
          background: rgba(255, 255, 255, 0.95);
          border-bottom-color: var(--apple-border);
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
        }

        .apple-header-container {
          max-width: 1280px;
          margin: 0 auto;
          height: 100%;
          padding: 0 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 32px;
        }

        /* Logo */
        .apple-logo {
          display: flex;
          align-items: center;
          gap: 10px;
          text-decoration: none;
          flex-shrink: 0;
        }

        .apple-logo-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          filter: drop-shadow(0 2px 8px rgba(0, 122, 255, 0.25));
        }

        .apple-logo-text {
          font-size: 20px;
          font-weight: 700;
          color: var(--apple-dark);
          letter-spacing: -0.5px;
        }

        /* Navigation */
        .apple-nav {
          display: flex;
          align-items: center;
          gap: 8px;
          flex: 1;
        }

        .apple-nav-link {
          padding: 8px 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--apple-gray);
          text-decoration: none;
          border: none;
          background: none;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--apple-transition);
          white-space: nowrap;
          display: flex;
          align-items: center;
        }

        .apple-nav-link:hover {
          color: var(--apple-dark);
          background: var(--apple-light-gray);
        }

        .apple-nav-link.active {
          color: var(--apple-blue);
        }

        /* Header Right */
        .apple-header-right {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        .apple-header-actions {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Buttons */
        .apple-btn-outline {
          height: 36px;
          padding: 0 16px;
          font-size: 14px;
          font-weight: 500;
          color: var(--apple-dark);
          background: white;
          border: 1.5px solid var(--apple-border);
          border-radius: 8px;
          cursor: pointer;
          transition: var(--apple-transition);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          white-space: nowrap;
        }

        .apple-btn-outline:hover {
          background: var(--apple-light-gray);
          border-color: #D1D1D1;
        }

        .apple-btn-primary {
          height: 36px;
          padding: 0 20px;
          font-size: 14px;
          font-weight: 600;
          color: white;
          background: var(--apple-blue);
          border: none;
          border-radius: 8px;
          cursor: pointer;
          transition: var(--apple-transition);
          white-space: nowrap;
        }

        .apple-btn-primary:hover {
          background: #0051D5;
          transform: translateY(-1px);
          box-shadow: 0 4px 12px rgba(0, 122, 255, 0.3);
        }

        /* Avatar Button */
        .apple-avatar-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 4px 12px 4px 4px;
          background: var(--apple-light-gray);
          border: none;
          border-radius: 20px;
          cursor: pointer;
          transition: var(--apple-transition);
        }

        .apple-avatar-btn:hover {
          background: #EAEAEA;
        }

        .apple-avatar {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--apple-blue), #0051D5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 12px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .apple-user-name {
          font-size: 14px;
          font-weight: 500;
          color: var(--apple-dark);
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }

        /* Dropdown */
        .apple-dropdown {
          position: relative;
        }

        .apple-dropdown-menu {
          position: absolute;
          top: calc(100% + 8px);
          right: 0;
          min-width: 240px;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border: 1px solid var(--apple-border);
          border-radius: 12px;
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          padding: 8px;
          animation: dropdownSlide 0.2s ease-out;
          z-index: 1001;
        }

        .apple-user-menu {
          min-width: 280px;
        }

        @keyframes dropdownSlide {
          from {
            opacity: 0;
            transform: translateY(-8px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .apple-dropdown-item {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 10px 12px;
          font-size: 14px;
          font-weight: 500;
          color: var(--apple-dark);
          text-decoration: none;
          background: none;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          transition: var(--apple-transition);
          width: 100%;
          text-align: left;
        }

        .apple-dropdown-item:hover {
          background: var(--apple-light-gray);
        }

        .apple-dropdown-item svg {
          color: var(--apple-gray);
          flex-shrink: 0;
        }

        .apple-dropdown-item.apple-logout {
          color: var(--apple-red);
        }

        .apple-dropdown-item.apple-logout svg {
          color: var(--apple-red);
        }

        .apple-dropdown-divider {
          height: 1px;
          background: var(--apple-border);
          margin: 8px 0;
        }

        /* User Info */
        .apple-user-info {
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 12px;
          background: var(--apple-light-gray);
          border-radius: 8px;
          margin-bottom: 8px;
        }

        .apple-avatar-large {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          background: linear-gradient(135deg, var(--apple-blue), #0051D5);
          color: white;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 18px;
          font-weight: 600;
          flex-shrink: 0;
        }

        .apple-user-fullname {
          font-size: 15px;
          font-weight: 600;
          color: var(--apple-dark);
          margin-bottom: 2px;
        }

        .apple-user-email {
          font-size: 13px;
          color: var(--apple-gray);
        }

        /* Mobile Toggle */
        .apple-mobile-toggle {
          display: none;
          width: 36px;
          height: 36px;
          padding: 0;
          background: none;
          border: none;
          color: var(--apple-dark);
          cursor: pointer;
          align-items: center;
          justify-content: center;
        }

        /* Mobile Menu */
        .apple-mobile-menu {
          position: absolute;
          top: var(--header-height);
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(20px);
          -webkit-backdrop-filter: blur(20px);
          border-bottom: 1px solid var(--apple-border);
          padding: 16px 24px;
          display: none;
          flex-direction: column;
          gap: 4px;
          animation: slideDown 0.3s ease-out;
        }

        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .apple-mobile-link {
          padding: 12px 16px;
          font-size: 15px;
          font-weight: 500;
          color: var(--apple-dark);
          text-decoration: none;
          background: none;
          border: none;
          border-radius: 8px;
          text-align: left;
          cursor: pointer;
          transition: var(--apple-transition);
        }

        .apple-mobile-link:hover {
          background: var(--apple-light-gray);
        }

        /* Responsive */
        @media (max-width: 992px) {
          .apple-nav {
            display: none;
          }

          .apple-mobile-toggle {
            display: flex;
          }

          .apple-mobile-menu {
            display: flex;
          }

          .apple-user-name {
            display: none;
          }

          .apple-btn-outline svg + * {
            display: none;
          }

          .apple-header-container {
            padding: 0 16px;
          }
        }

        @media (max-width: 576px) {
          .apple-logo-text {
            display: none;
          }

          .apple-btn-outline {
            padding: 0 12px;
          }

          .apple-btn-primary {
            padding: 0 16px;
            font-size: 13px;
          }

          .apple-dropdown-menu {
            min-width: calc(100vw - 32px);
            right: -16px;
          }
        }

        /* Print */
        @media print {
          .apple-header {
            display: none;
          }
        }
      `}</style>
    </>
  );
};

export default Header;