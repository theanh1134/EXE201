import React, { useState } from 'react';

const SignUp = ({ isOpen, onClose, onSwitchToLogin }) => {
    const [signupData, setSignupData] = useState({
        fullName: '',
        email: '',
        password: ''
    });

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setSignupData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = () => {
        console.log('Signup data:', signupData);
        alert('Sign up successful!');
        onClose();
    };

    if (!isOpen) return null;

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 1050 }}>
                <div className="modal-dialog modal-xl" style={{ maxWidth: '1200px', margin: '0 auto' }}>
                    <div className="modal-content" style={{ borderRadius: '0', border: 'none', minHeight: '100vh' }}>
                        <div className="row g-0 h-100">
                            {/* Left Side - Illustration */}
                            <div className="col-lg-7" style={{ backgroundColor: '#f8f9fa', position: 'relative' }}>
                                <button
                                    type="button"
                                    className="btn-close position-absolute top-0 end-0 m-3"
                                    onClick={onClose}
                                    style={{ zIndex: 10 }}
                                ></button>

                                <div className="d-flex flex-column h-100 p-5">
                                    {/* Logo */}
                                    <div className="mb-4">
                                        <div className="d-flex align-items-center">
                                            <div
                                                className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: '#fff',
                                                    border: '2px solid #e9ecef'
                                                }}
                                            >
                                                <span style={{ fontSize: '18px', color: '#6c757d' }}>👤</span>
                                            </div>
                                            <span className="fw-bold" style={{ fontSize: '24px', color: '#333' }}>
                                                Part GO
                                            </span>
                                        </div>
                                    </div>

                                    {/* Stats */}
                                    <div className="mb-5">
                                        <div className="d-flex align-items-center mb-2">
                                            <div style={{
                                                width: '40px',
                                                height: '30px',
                                                background: 'linear-gradient(45deg, #ff6b35, #ff8a65)',
                                                borderRadius: '4px',
                                                marginRight: '12px'
                                            }}></div>
                                        </div>
                                        <h3 className="fw-bold mb-1" style={{ color: '#333' }}>100K+</h3>
                                        <p className="text-muted">People got hired</p>
                                    </div>

                                    {/* Illustration area */}
                                    <div className="flex-grow-1 d-flex align-items-center justify-content-center" style={{ position: 'relative' }}>
                                        <div style={{ position: 'relative', width: '400px', height: '300px' }}>
                                            <div style={{
                                                position: 'absolute',
                                                top: '20px',
                                                left: '50px',
                                                width: '200px',
                                                height: '150px',
                                                background: 'linear-gradient(135deg, #e8f5e8, #c8e6c9)',
                                                borderRadius: '20px',
                                                transform: 'rotate(-10deg)',
                                                opacity: 0.7
                                            }}></div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '80px',
                                                left: '150px',
                                                width: '180px',
                                                height: '120px',
                                                background: 'linear-gradient(135deg, #fff3e0, #ffcc80)',
                                                borderRadius: '15px',
                                                transform: 'rotate(10deg)',
                                                opacity: 0.8
                                            }}></div>
                                            <div style={{
                                                position: 'absolute',
                                                top: '140px',
                                                left: '20px',
                                                width: '160px',
                                                height: '100px',
                                                background: 'linear-gradient(135deg, #f3e5f5, #e1bee7)',
                                                borderRadius: '12px',
                                                transform: 'rotate(-5deg)',
                                                opacity: 0.6
                                            }}></div>
                                        </div>
                                    </div>

                                    {/* Testimonial */}
                                    <div className="mt-auto">
                                        <div className="d-flex align-items-start">
                                            <div className="me-3">
                                                <span style={{ fontSize: '24px', color: '#ff6b35' }}>❝</span>
                                            </div>
                                            <div>
                                                <p className="mb-2" style={{ fontStyle: 'italic', color: '#666' }}>
                                                    "Great platform for the job seeker that searching for new career heights."
                                                </p>
                                                <div className="d-flex align-items-center">
                                                    <div
                                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                                        style={{
                                                            width: '40px',
                                                            height: '40px',
                                                            backgroundColor: '#ff6b35',
                                                            fontSize: '1.2rem'
                                                        }}
                                                    >
                                                        <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>👨</span>
                                                    </div>
                                                    <div>
                                                        <div className="fw-medium" style={{ fontSize: '14px' }}>Adam Sandler</div>
                                                        <div className="text-muted" style={{ fontSize: '12px' }}>Lead Engineer at Canva</div>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Right Side - Sign Up Form */}
                            <div className="col-lg-5 d-flex align-items-center">
                                <div className="w-100 p-5">
                                    {/* Job Seeker / Company Toggle */}
                                    <div className="d-flex mb-4 justify-content-center">
                                        <div className="d-flex" style={{ backgroundColor: '#f8f9fa', borderRadius: '25px', padding: '4px' }}>
                                            <button className="btn btn-sm px-4" style={{
                                                backgroundColor: '#ff6b35',
                                                color: 'white',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontWeight: '500'
                                            }}>
                                                Job Seeker
                                            </button>
                                            <button className="btn btn-sm px-4 text-muted" style={{
                                                backgroundColor: 'transparent',
                                                borderRadius: '20px',
                                                border: 'none',
                                                fontWeight: '500'
                                            }}>
                                                Company
                                            </button>
                                        </div>
                                    </div>

                                    <div className="text-center mb-4">
                                        <h2 className="fw-bold mb-2" style={{ color: '#333' }}>Get more</h2>
                                        <h2 className="fw-bold" style={{ color: '#333' }}>opportunities</h2>
                                    </div>

                                    {/* Google Sign Up */}
                                    <button className="btn w-100 mb-3 py-3 d-flex align-items-center justify-content-center" style={{
                                        border: '1px solid #e9ecef',
                                        borderRadius: '8px',
                                        backgroundColor: 'white'
                                    }}>
                                        <span style={{ fontSize: '18px', marginRight: '12px' }}>🌐</span>
                                        <span style={{ color: '#333', fontWeight: '500' }}>Sign Up with Google</span>
                                    </button>

                                    <div className="text-center mb-3">
                                        <span className="text-muted">Or sign up with email</span>
                                    </div>

                                    <div>
                                        {/* Full Name */}
                                        <div className="mb-3">
                                            <label className="form-label fw-medium" style={{ color: '#333' }}>Full name</label>
                                            <input
                                                type="text"
                                                className="form-control"
                                                name="fullName"
                                                value={signupData.fullName}
                                                onChange={handleInputChange}
                                                placeholder="Enter your full name"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    padding: '12px',
                                                    fontSize: '16px'
                                                }}
                                                required
                                            />
                                        </div>

                                        {/* Email */}
                                        <div className="mb-3">
                                            <label className="form-label fw-medium" style={{ color: '#333' }}>Email Address</label>
                                            <input
                                                type="email"
                                                className="form-control"
                                                name="email"
                                                value={signupData.email}
                                                onChange={handleInputChange}
                                                placeholder="Enter email address"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    padding: '12px',
                                                    fontSize: '16px'
                                                }}
                                                required
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="mb-4">
                                            <label className="form-label fw-medium" style={{ color: '#333' }}>Password</label>
                                            <input
                                                type="password"
                                                className="form-control"
                                                name="password"
                                                value={signupData.password}
                                                onChange={handleInputChange}
                                                placeholder="Enter password"
                                                style={{
                                                    borderRadius: '8px',
                                                    border: '1px solid #e9ecef',
                                                    padding: '12px',
                                                    fontSize: '16px'
                                                }}
                                                required
                                            />
                                        </div>

                                        {/* Submit Button */}
                                        <button
                                            type="button"
                                            onClick={handleSubmit}
                                            className="btn w-100 py-3 fw-bold mb-4"
                                            style={{
                                                backgroundColor: '#ff6b35',
                                                color: 'white',
                                                borderRadius: '8px',
                                                border: 'none',
                                                fontSize: '16px'
                                            }}
                                        >
                                            Continue
                                        </button>
                                    </div>

                                    {/* Login Link */}
                                    <p className="text-center mb-3">
                                        <span className="text-muted">Already have an account? </span>
                                        <button
                                            className="btn btn-link p-0 text-decoration-none fw-medium"
                                            style={{ color: '#ff6b35' }}
                                            onClick={onSwitchToLogin}
                                        >
                                            Login
                                        </button>
                                    </p>

                                    {/* Terms */}
                                    <p className="text-center text-muted" style={{ fontSize: '12px' }}>
                                        By clicking Continue, you acknowledge that you have read
                                        and accept our{' '}
                                        <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                            Terms of Service
                                        </a>{' '}
                                        and{' '}
                                        <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                            Privacy Policy
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignUp;