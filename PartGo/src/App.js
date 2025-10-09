import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { useAppNavigation } from './hooks/useAppNavigation';
import { NotificationProvider } from './contexts/NotificationContext';
import { isAuthenticated as checkAuth } from './services/authAPI';
import ProtectedRoute from './components/ProtectedRoute';
import UserDebugInfo from './components/UserDebugInfo';
import PartGOHomepage from './components/PartGOHomepage';
import PartGOJobsPage from './components/PartGOJobsPage ';
import PartGOJobDetailPage from './components/PartGOJobDetailPage ';
import CompanyDashboard from './components/CompanyDashboard';
import CompanyDashboardNew from './components/employer/CompanyDashboardNew';
import JobManagement from './components/employer/Jobs/JobManagement';
import ApplicationManagement from './components/employer/Applications/ApplicationManagement';
import AnalyticsDashboard from './components/employer/Analytics/AnalyticsDashboard';
import CompanyProfile from './components/employer/Company/CompanyProfile';
import Debug from './components/employer/Debug';
import PartGOAbout from './components/PartGOAbout';
import UserProfile from './components/UserProfile';
import Login from './components/Login';
import SignUp from './components/SignUp ';
import ForgotPassword from './components/ForgotPassword';
import ChatBot from './components/ChatBot';
import ErrorBoundary from './components/ErrorBoundary';

// Import global force light theme CSS
import './styles/force-light-theme.css';

// Test EmailJS integration


function AppContent() {
  const { user, isAuthenticated, logout } = useAuth();
  const {
    goToHome,
    goToJobs,
    goToJobDetail,
    goToCV,
    goToCompanyDashboard,
    goBack
  } = useAppNavigation();

  // Debug authentication state
  console.log('AppContent - user:', user, 'isAuthenticated:', isAuthenticated, 'checkAuth():', checkAuth());

  // Use both state and function check for reliability
  const userIsAuthenticated = isAuthenticated || checkAuth();

  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showForgotPasswordModal, setShowForgotPasswordModal] = useState(false);

  // Modal functions
  const openLoginModal = () => setShowLoginModal(true);
  const closeLoginModal = () => setShowLoginModal(false);
  const openSignUpModal = () => setShowSignUpModal(true);
  const closeSignUpModal = () => setShowSignUpModal(false);
  const openForgotPasswordModal = () => setShowForgotPasswordModal(true);
  const closeForgotPasswordModal = () => setShowForgotPasswordModal(false);
  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };
  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };
  const switchToForgotPassword = () => {
    setShowLoginModal(false);
    setShowForgotPasswordModal(true);
  };
  const switchFromForgotPasswordToLogin = () => {
    setShowForgotPasswordModal(false);
    setShowLoginModal(true);
  };

  // Helper component: when user chưa đăng nhập, đưa về homepage và tự mở modal đăng nhập
  const LoginGateHome = () => {
    React.useEffect(() => {
      openLoginModal();
    }, []);
    return (
      <PartGOHomepage
        onShowAllJobs={() => goToJobs(openLoginModal)}
        onOpenCv={() => goToCV(openLoginModal)}
        onOpenCompanyDashboard={() => goToCompanyDashboard(openLoginModal)}
        onViewJobDetail={goToJobDetail}
        onShowLogin={openLoginModal}
        onShowSignUp={openSignUpModal}
      />
    );
  };

  return (
    <div className="App">
      {/* Modals */}
      <Login
        isOpen={showLoginModal}
        onClose={closeLoginModal}
        onSwitchToSignUp={switchToSignUp}
        onShowForgotPassword={switchToForgotPassword}
      />
      <SignUp
        isOpen={showSignUpModal}
        onClose={closeSignUpModal}
        onSwitchToLogin={switchToLogin}
      />
      <ForgotPassword
        isOpen={showForgotPasswordModal}
        onClose={closeForgotPasswordModal}
        onShowLogin={switchFromForgotPasswordToLogin}
      />

      {/* Global ChatBot */}
      <ChatBot />

      {/* Routes */}
      <Routes>
        <Route path="/" element={
          <PartGOHomepage
            onShowAllJobs={() => goToJobs(openLoginModal)}
            onOpenCv={() => goToCV(openLoginModal)}
            onOpenCompanyDashboard={() => goToCompanyDashboard(openLoginModal)}
            onViewJobDetail={goToJobDetail}
            onShowLogin={openLoginModal}
            onShowSignUp={openSignUpModal}
          />
        } />
        <Route path="/jobs" element={
          userIsAuthenticated ? (
            <PartGOJobsPage
              onBackToHome={goToHome}
              onSelectJob={goToJobDetail}
              onShowLogin={openLoginModal}
              onShowSignUp={openSignUpModal}
            />
          ) : (
            <LoginGateHome />
          )
        } />
        <Route path="/job/:id" element={
          <PartGOJobDetailPage
            onBackToJobs={() => goToJobs(openLoginModal)}
            onShowLogin={openLoginModal}
            onShowSignUp={openSignUpModal}
          />
        } />
        <Route path="/company-dashboard" element={
          <ProtectedRoute requiredRole="employer">
            <CompanyDashboardNew />
          </ProtectedRoute>
        } />
        <Route path="/company-dashboard-old" element={
          <ProtectedRoute requiredRole="employer">
            <CompanyDashboard />
          </ProtectedRoute>
        } />
        <Route path="/company-dashboard/jobs" element={
          <ProtectedRoute requiredRole="employer">
            <JobManagement />
          </ProtectedRoute>
        } />
        <Route path="/company-dashboard/applications" element={
          <ProtectedRoute requiredRole="employer">
            <ApplicationManagement />
          </ProtectedRoute>
        } />
        <Route path="/company-dashboard/analytics" element={
          <ProtectedRoute requiredRole="employer">
            <AnalyticsDashboard />
          </ProtectedRoute>
        } />
        <Route path="/company-dashboard/company" element={
          <ProtectedRoute requiredRole="employer">
            <CompanyProfile />
          </ProtectedRoute>
        } />
        <Route path="/debug" element={<Debug />} />
        <Route path="/profile" element={
          <ProtectedRoute requiredRole="jobseeker">
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/profile/cv" element={
          <ProtectedRoute requiredRole="jobseeker">
            <UserProfile />
          </ProtectedRoute>
        } />
        <Route path="/about" element={<PartGOAbout />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <NotificationProvider>
          <Router>
            <AppContent />
          </Router>
        </NotificationProvider>
      </AuthProvider>
    </ErrorBoundary>
  );
}

export default App;