// Header.js
import React, { useState } from 'react';
import Login from './Login';
import SignUp from './SignUp ';

const Header = () => {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

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
          <a className="navbar-brand d-flex align-items-center" href="#">
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
                  Find Jobs
                </a>
              </li>
              <li className="nav-item">
                <a
                  className="nav-link me-3"
                  href="#"
                  style={{
                    color: '#6c757d',
                    fontWeight: '500'
                  }}
                >
                  Discover Companies
                </a>
              </li>
            </ul>

            {/* Right side buttons */}
            <div className="d-flex">
              <button
                className="btn btn-link text-decoration-none me-3"
                style={{
                  color: '#6c757d',
                  fontWeight: '500',
                  border: 'none'
                }}
                onClick={() => setShowLoginModal(true)}
              >
                Login
              </button>
              <button
                className="btn px-4 py-2"
                style={{
                  backgroundColor: '#ff6b35',
                  borderColor: '#ff6b35',
                  color: 'white',
                  fontWeight: '500',
                  borderRadius: '6px'
                }}
                onClick={() => setShowSignUpModal(true)}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Modals */}
      <Login
        isOpen={showLoginModal}
        onClose={() => setShowLoginModal(false)}
        onSwitchToSignUp={() => {
          setShowLoginModal(false);
          setShowSignUpModal(true);
        }}
      />
      <SignUp
        isOpen={showSignUpModal}
        onClose={() => setShowSignUpModal(false)}
        onSwitchToLogin={() => {
          setShowSignUpModal(false);
          setShowLoginModal(true);
        }}
      />
    </div>
  );
};

export default Header;
