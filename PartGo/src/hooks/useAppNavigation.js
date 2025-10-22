import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

/**
 * Custom hook for application navigation with authentication checks
 * Provides consistent navigation methods across the application
 */
export const useAppNavigation = () => {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuth();

    /**
     * Navigate to home page (now redirects to jobs page)
     */
    const goToHome = () => {
        navigate('/jobs');
    };

    /**
     * Navigate to jobs page (no authentication required)
     * Anyone can view the job listing page
     * @param {Function} onShowLogin - Callback to show login modal if not authenticated (optional)
     */
    const goToJobs = (onShowLogin) => {
        navigate('/jobs');
    };

    /**
     * Navigate to job detail page
     * @param {string} jobId - The job ID
     */
    const goToJobDetail = (jobId) => {
        if (jobId) {
            navigate(`/job/${jobId}`);
        }
    };

    /**
     * Navigate to user profile (requires authentication)
     * @param {Function} onShowLogin - Callback to show login modal if not authenticated
     */
    const goToProfile = (onShowLogin) => {
        if (isAuthenticated) {
            navigate('/profile');
        } else if (onShowLogin) {
            onShowLogin();
        } else {
            navigate('/jobs');
        }
    };

    /**
     * Navigate to CV page (requires authentication)
     * @param {Function} onShowLogin - Callback to show login modal if not authenticated
     */
    const goToCV = (onShowLogin) => {
        if (isAuthenticated) {
            navigate('/profile/cv');
        } else if (onShowLogin) {
            onShowLogin();
        } else {
            navigate('/jobs');
        }
    };

    /**
     * Navigate to company dashboard (requires employer authentication)
     * @param {Function} onShowLogin - Callback to show login modal if not authenticated
     */
    const goToCompanyDashboard = (onShowLogin) => {
        if (isAuthenticated) {
            navigate('/company-dashboard');
        } else if (onShowLogin) {
            onShowLogin();
        } else {
            navigate('/jobs');
        }
    };

    /**
     * Navigate to company dashboard jobs section
     */
    const goToCompanyJobs = () => {
        navigate('/company-dashboard/jobs');
    };

    /**
     * Navigate to company dashboard applications section
     */
    const goToCompanyApplications = () => {
        navigate('/company-dashboard/applications');
    };

    /**
     * Navigate to company dashboard analytics section
     */
    const goToCompanyAnalytics = () => {
        navigate('/company-dashboard/analytics');
    };

    /**
     * Navigate to company profile section
     */
    const goToCompanyProfile = () => {
        navigate('/company-dashboard/company');
    };

    /**
     * Navigate to about page
     */
    const goToAbout = () => {
        navigate('/about');
    };

    /**
     * Navigate back in history
     */
    const goBack = () => {
        navigate(-1);
    };

    /**
     * Navigate forward in history
     */
    const goForward = () => {
        navigate(1);
    };

    /**
     * Replace current route (doesn't add to history)
     * @param {string} path - The path to navigate to
     */
    const replaceTo = (path) => {
        navigate(path, { replace: true });
    };

    /**
     * Navigate with state
     * @param {string} path - The path to navigate to
     * @param {object} state - State to pass to the new route
     */
    const navigateWithState = (path, state) => {
        navigate(path, { state });
    };

    return {
        // Basic navigation
        goToHome,
        goToJobs,
        goToJobDetail,
        goToProfile,
        goToCV,
        goToAbout,
        
        // Company navigation
        goToCompanyDashboard,
        goToCompanyJobs,
        goToCompanyApplications,
        goToCompanyAnalytics,
        goToCompanyProfile,
        
        // History navigation
        goBack,
        goForward,
        
        // Advanced navigation
        replaceTo,
        navigateWithState,
        
        // Direct access to navigate function for custom use cases
        navigate
    };
};
