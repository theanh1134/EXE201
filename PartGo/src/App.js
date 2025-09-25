
import React, { useState } from 'react';
import PartGOHomepage from './components/PartGOHomepage';
import PartGOJobsPage from './components/PartGOJobsPage ';
import PartGOJobDetailPage from './components/PartGOJobDetailPage ';
import Login from './components/Login';
import SignUp from './components/SignUp ';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedJobId, setSelectedJobId] = useState(null);
  
  // Modal states
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [showSignUpModal, setShowSignUpModal] = useState(false);

  // Navigation functions
  const navigateToJobs = () => {
    setCurrentPage('jobs');
  };

  const navigateToHome = () => {
    setCurrentPage('home');
  };

  const navigateToJobDetail = (jobId) => {
    setSelectedJobId(jobId);
    setCurrentPage('job-detail');
  };

  const navigateBackToJobs = () => {
    setCurrentPage('jobs');
  };

  // Modal functions
  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };

  const openSignUpModal = () => {
    setShowSignUpModal(true);
  };

  const closeSignUpModal = () => {
    setShowSignUpModal(false);
  };

  const switchToSignUp = () => {
    setShowLoginModal(false);
    setShowSignUpModal(true);
  };

  const switchToLogin = () => {
    setShowSignUpModal(false);
    setShowLoginModal(true);
  };

  return (
    <div className="App">
      {currentPage === 'home' && (
        <PartGOHomepage 
          onShowAllJobs={navigateToJobs}
          onShowLogin={openLoginModal}
          onShowSignUp={openSignUpModal}
        />
      )}
      {currentPage === 'jobs' && (
        <PartGOJobsPage 
          onBackToHome={navigateToHome}
          onSelectJob={navigateToJobDetail}
          onShowLogin={openLoginModal}
          onShowSignUp={openSignUpModal}
        />
      )}
      {currentPage === 'job-detail' && (
        <PartGOJobDetailPage 
          jobId={selectedJobId}
          onBackToJobs={navigateBackToJobs}
          onShowLogin={openLoginModal}
          onShowSignUp={openSignUpModal}
        />
      )}

      {/* Modals */}
      <Login 
        isOpen={showLoginModal} 
        onClose={closeLoginModal}
        onSwitchToSignUp={switchToSignUp}
      />
      <SignUp 
        isOpen={showSignUpModal} 
        onClose={closeSignUpModal}
        onSwitchToLogin={switchToLogin}
      />
    </div>
  );
}

export default App;