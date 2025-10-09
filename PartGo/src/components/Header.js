// Header.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import PostJobModal from './PostJobModal';
import EmployerPricingModal from './EmployerPricingModal';
import './Header.css';

const Header = ({ onOpenCv, onOpenCompanyDashboard, onOpenPostJob, onOpenPricing, onShowLogin, onShowSignUp, onLogout }) => {
  const { user, isAuthenticated, logout } = useAuth();
  console.log('Header - user:', user, 'isAuthenticated:', isAuthenticated);
  const [showPostJob, setShowPostJob] = useState(false);
  const [showPricing, setShowPricing] = useState(false);
  const [showEmployerMenu, setShowEmployerMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleLogout = () => {
    if (onLogout) {
      onLogout();
    } else {
      logout();
    }
    setShowUserMenu(false);
    setShowEmployerMenu(false);
  };

  // Render menu based on user role
  const renderUserMenu = () => {
    if (!isAuthenticated || !user) {
      return (
        <div className="navbar-nav">
          <button
            className="btn btn-outline-primary me-2"
            onClick={onShowLogin}
          >
            Đăng nhập
          </button>
          <button
            className="btn btn-primary"
            onClick={onShowSignUp}
          >
            Đăng ký
          </button>
        </div>
      );
    }

    if (user.role === 'employer') {
      return (
        <div className="navbar-nav">
          <div className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle"
              onClick={() => setShowEmployerMenu(!showEmployerMenu)}
              style={{ position: 'relative' }}
            >
              Dashboard
            </button>
            {showEmployerMenu && (
              <div className="dropdown-menu show">
                <a className="dropdown-item" href="/company-dashboard">
                  📊 Dashboard
                </a>
                <a className="dropdown-item" href="/company-dashboard/jobs">
                  📝 Quản lý tin tuyển dụng
                </a>
                <a className="dropdown-item" href="/company-dashboard/applications">
                  👥 Quản lý ứng viên
                </a>
                <a className="dropdown-item" href="/company-dashboard/analytics">
                  📈 Thống kê
                </a>
              </div>
            )}
          </div>

          <div className="nav-item dropdown">
            <button
              className="btn btn-link nav-link dropdown-toggle"
              onClick={() => setShowUserMenu(!showUserMenu)}
              style={{ position: 'relative' }}
            >
              {user.fullName || user.email}
            </button>
            {showUserMenu && (
              <div className="dropdown-menu show">
                <a className="dropdown-item" href="/company-dashboard">
                  👤 Hồ sơ công ty
                </a>
                <a className="dropdown-item" href="/company-dashboard">
                  ⚙️ Cài đặt
                </a>
                <hr className="dropdown-divider" />
                <button className="dropdown-item" onClick={handleLogout}>
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      );
    }

    // Job seeker menu
    return (
      <div className="navbar-nav">
        <div className="nav-item dropdown">
          <button
            className="btn btn-link nav-link dropdown-toggle"
            onClick={() => setShowUserMenu(!showUserMenu)}
            style={{ position: 'relative' }}
          >
            {user.fullName || user.email}
          </button>
          {showUserMenu && (
            <div className="dropdown-menu show">
              <a className="dropdown-item" href="/profile">
                👤 Hồ sơ cá nhân
              </a>
              <a className="dropdown-item" href="/profile/cv">
                📄 Tạo CV
              </a>
              <a className="dropdown-item" href="/jobs">
                💼 Việc làm đã lưu
              </a>
              <a className="dropdown-item" href="/profile">
                📋 Đơn ứng tuyển
              </a>
              <hr className="dropdown-divider" />
              <button className="dropdown-item" onClick={handleLogout}>
                🚪 Đăng xuất
              </button>
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      {/* Bootstrap CSS */}
      <link
        href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
        rel="stylesheet"
      />

      <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm">
        <div className="container-fluid px-4">
          {/* Logo and Brand */}
          <a className="navbar-brand d-flex align-items-center" href="/" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
            <div
              className="rounded-circle me-2 d-flex align-items-center justify-content-center"
              style={{
                width: '40px',
                height: '40px',
                backgroundColor: '#f8f9fa',
                border: '2px solid #e9ecef'
              }}
            >
              <span style={{ fontSize: '18px', color: '#6c757d' }}>👤</span>
            </div>
            <span
              className="fw-bold"
              style={{
                fontSize: '24px',
                color: '#333'
              }}
            >
              Part GO
            </span>
          </a>

          {/* Toggle button for mobile */}
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarNav">
            {/* Navigation Links */}
            <ul className="navbar-nav me-auto ms-4">
              <li className="nav-item">
                <a
                  className="nav-link me-3"
                  href="#"
                  style={{
                    color: '#ff6b35',
                    fontWeight: '500'
                  }}
                >
                  Tìm việc làm
                </a>
              </li>
              {/* Show employer menu only for non-employer users */}
              {(!isAuthenticated || user?.role !== 'employer') && (
                <li className="nav-item dropdown">
                  <a
                    className="nav-link dropdown-toggle me-3"
                    href="#"
                    role="button"
                    onClick={(e) => { e.preventDefault(); setShowEmployerMenu(v => !v); }}
                    style={{
                      color: '#6c757d',
                      fontWeight: '500'
                    }}
                  >
                    Dành cho nhà tuyển dụng
                  </a>
                  <ul className={`dropdown-menu ${showEmployerMenu ? 'show' : ''}`} style={{ position: 'absolute' }}>
                    <li><button className="dropdown-item" onClick={() => { setShowPostJob(true); onOpenPostJob?.(); }}>Đăng tuyển việc làm</button></li>
                    <li><button className="dropdown-item" onClick={onOpenCompanyDashboard}>Bảng điều khiển công ty</button></li>
                    <li><button className="dropdown-item" onClick={() => { setShowPricing(true); onOpenPricing?.(); }}>Bảng giá</button></li>
                  </ul>
                </li>
              )}
            </ul>

            {/* Right side buttons */}
            <div className="d-flex align-items-center">
              {/* Show CV button only for job seekers */}
              {isAuthenticated && user?.role === 'jobseeker' && (
                <button
                  className="btn btn-outline-secondary me-3"
                  style={{ borderRadius: '6px' }}
                  onClick={onOpenCv}
                >
                  Tạo CV
                </button>
              )}

              {/* Render menu based on user role */}
              {renderUserMenu()}
            </div>
          </div>
        </div>
      </nav>

      <PostJobModal isOpen={showPostJob} onClose={() => setShowPostJob(false)} />
      <EmployerPricingModal isOpen={showPricing} onClose={() => setShowPricing(false)} />
    </div>
  );
};

export default Header;
