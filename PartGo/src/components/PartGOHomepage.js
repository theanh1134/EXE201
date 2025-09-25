import React, { useState } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
const PartGOHomepage = ({ onShowAllJobs }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [location, setLocation] = useState('');

    const categories = [
        { name: 'Design', jobs: '235 jobs available', icon: '🎨', color: '#f8f9fa' },
        { name: 'Sales', jobs: '756 jobs available', icon: '📊', color: '#f8f9fa' },
        { name: 'Marketing', jobs: '140 jobs available', icon: '📢', color: '#ff6b35', featured: true },
        { name: 'Finance', jobs: '325 jobs available', icon: '💰', color: '#f8f9fa' },
        { name: 'Technology', jobs: '436 jobs available', icon: '💻', color: '#f8f9fa' },
        { name: 'Engineering', jobs: '542 jobs available', icon: '⚙️', color: '#f8f9fa' },
        { name: 'Business', jobs: '211 jobs available', icon: '💼', color: '#f8f9fa' },
        { name: 'Human Resource', jobs: '346 jobs available', icon: '👥', color: '#f8f9fa' }
    ];

    const featuredJobs = [
        {
            title: 'Email Marketing',
            company: 'Revolut',
            location: 'Madrid, Spain',
            tags: ['PART TIME'],
            description: 'Revolut is looking for Email Marketing to help team grow.',
            logo: '🏢'
        },
        {
            title: 'Brand Designer',
            company: 'Dropbox',
            location: 'San Francisco, US',
            tags: ['FULL TIME'],
            description: 'Dropbox is looking for Brand Designer to help team grow.',
            logo: '📦'
        },
        {
            title: 'Email Marketing',
            company: 'Pitch',
            location: 'Berlin, Germany',
            tags: ['FULL TIME'],
            description: 'Pitch is looking for Customer Manager to join marketing team.',
            logo: '🎯'
        },
        {
            title: 'Visual Designer',
            company: 'Klarna',
            location: 'Stockholm, Spain',
            tags: ['FULL TIME'],
            description: 'Klarna is looking for Visual Designer to help team grow.',
            logo: '💳'
        },
        {
            title: 'Product Designer',
            company: 'ClassPass',
            location: 'Manchester, UK',
            tags: ['FULL TIME'],
            description: 'Product Designer UI team in Manchester, UK.',
            logo: '🏃'
        },
        {
            title: 'Lead Designer',
            company: 'Chuva',
            location: 'Ottawa, Canada',
            tags: ['FULL TIME'],
            description: 'Chuva is looking for Lead Designer to help team grow.',
            logo: '☔'
        },
        {
            title: 'Brand Strategist',
            company: 'GoDaddy',
            location: 'Minnesota, France',
            tags: ['FULL TIME'],
            description: 'GoDaddy is looking for Brand Strategist to join our team.',
            logo: '🌐'
        },
        {
            title: 'Data Analyst',
            company: 'Twitter',
            location: 'San Diego, US',
            tags: ['FULL TIME'],
            description: 'Twitter is looking for Data Analyst to help team.',
            logo: '🐦'
        }
    ];

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

                {/* Header */}
               <Header/>
                {/* Hero Section */}
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <h1 className="display-4 fw-bold mb-4" style={{ color: '#2c3e50' }}>
                                Discover<br />
                                more than<br />
                                <span style={{ color: '#ff6b35' }}>5000+</span><br />
                                <span style={{ color: '#ff6b35' }}>Jobs</span>
                            </h1>
                            <div style={{ width: '100px', height: '4px', backgroundColor: '#ff6b35', marginBottom: '2rem' }}></div>
                            <p className="lead mb-4" style={{ color: '#6c757d' }}>
                                Great platform for the job seeker that searching for new career heights and passionate about startups.
                            </p>

                            {/* Search Form */}
                            <div
                                className="bg-white p-4 rounded-3 mb-4"
                                style={{
                                    boxShadow: '0 10px 30px rgba(0,0,0,0.08)',
                                    border: '1px solid rgba(0,0,0,0.05)'
                                }}
                            >
                                <div className="row g-0 align-items-center">
                                    <div className="col-md-5">
                                        <div className="d-flex align-items-center px-4 py-3" style={{ borderRight: '1px solid #f1f3f4' }}>
                                            <div className="me-3" style={{ color: '#6c757d', fontSize: '18px' }}>
                                                🔍
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium mb-1" style={{ fontSize: '14px', color: '#2c3e50' }}>
                                                    What
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control border-0 p-0"
                                                    placeholder="Job title, keyword..."
                                                    value={searchKeyword}
                                                    onChange={(e) => setSearchKeyword(e.target.value)}
                                                    style={{
                                                        fontSize: '16px',
                                                        color: '#495057',
                                                        backgroundColor: 'transparent',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-5">
                                        <div className="d-flex align-items-center px-4 py-3">
                                            <div className="me-3" style={{ color: '#6c757d', fontSize: '18px' }}>
                                                📍
                                            </div>
                                            <div className="flex-grow-1">
                                                <div className="fw-medium mb-1" style={{ fontSize: '14px', color: '#2c3e50' }}>
                                                    Where
                                                </div>
                                                <input
                                                    type="text"
                                                    className="form-control border-0 p-0"
                                                    placeholder="Florence, Italy"
                                                    value={location}
                                                    onChange={(e) => setLocation(e.target.value)}
                                                    style={{
                                                        fontSize: '16px',
                                                        color: '#495057',
                                                        backgroundColor: 'transparent',
                                                        boxShadow: 'none'
                                                    }}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-md-2">
                                        <div className="px-2">
                                            <button
                                                className="btn w-100 d-flex align-items-center justify-content-center"
                                                style={{
                                                    backgroundColor: '#ff6b35',
                                                    color: 'white',
                                                    fontWeight: '600',
                                                    borderRadius: '12px',
                                                    padding: '14px 20px',
                                                    fontSize: '18px',
                                                    border: 'none',
                                                    boxShadow: '0 4px 12px rgba(255, 107, 53, 0.3)',
                                                    transition: 'all 0.3s ease'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.target.style.backgroundColor = '#e55a2b';
                                                    e.target.style.transform = 'translateY(-1px)';
                                                    e.target.style.boxShadow = '0 6px 16px rgba(255, 107, 53, 0.4)';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.target.style.backgroundColor = '#ff6b35';
                                                    e.target.style.transform = 'translateY(0)';
                                                    e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.3)';
                                                }}
                                            >
                                                🔍
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <p className="text-muted small">
                                Popular: UI Designer, UX Researcher, Android, Admin
                            </p>
                        </div>
                        <div className="col-lg-6">
                            <div className="position-relative">
                                <div style={{
                                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                    borderRadius: '20px',
                                    height: '400px',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    {/* Decorative elements */}
                                    <div style={{
                                        position: 'absolute',
                                        top: '20px',
                                        right: '20px',
                                        width: '100px',
                                        height: '100px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }}></div>
                                    <div style={{
                                        position: 'absolute',
                                        bottom: '50px',
                                        left: '30px',
                                        width: '60px',
                                        height: '60px',
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Categories Section */}
                <div className="container py-5">
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <h2 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                Explore by <span style={{ color: '#ff6b35' }}>category</span>
                            </h2>
                        </div>
                        <div className="col-auto">
                            <button
                                onClick={onShowAllJobs}
                                className="btn btn-link text-decoration-none p-0"
                                style={{ color: '#ff6b35' }}
                            >
                                Show all jobs →
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {categories.map((category, index) => (
                            <div key={index} className="col-lg-3 col-md-6">
                                <div
                                    className="p-4 rounded shadow-sm h-100 d-flex flex-column"
                                    style={{
                                        backgroundColor: category.featured ? '#ff6b35' : '#ffffff',
                                        color: category.featured ? '#ffffff' : '#2c3e50',
                                        cursor: 'pointer',
                                        transition: 'transform 0.3s ease'
                                    }}
                                >
                                    <div className="mb-3" style={{ fontSize: '2rem' }}>
                                        {category.icon}
                                    </div>
                                    <h5 className="fw-bold mb-2">{category.name}</h5>
                                    <p className="mb-0 small" style={{ opacity: 0.8 }}>
                                        {category.jobs} →
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Start Posting Section */}
                <div className="container py-5">
                    <div className="row align-items-center">
                        <div className="col-lg-6">
                            <div className="p-5 rounded" style={{ backgroundColor: '#ff6b35', color: 'white' }}>
                                <h2 className="fw-bold mb-4">
                                    Start<br />
                                    posting<br />
                                    jobs<br />
                                    today
                                </h2>
                                <p className="mb-4">
                                    Start posting jobs for only job place.
                                </p>
                                <button className="btn btn-light px-4 py-2" style={{ fontWeight: '500' }}>
                                    Sign Up For Free
                                </button>
                            </div>
                        </div>
                        <div className="col-lg-6">
                            <div className="bg-white p-4 rounded shadow">
                                <div className="d-flex align-items-center mb-3">
                                    <div className="me-3">
                                        <div style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', borderRadius: '10px' }}></div>
                                    </div>
                                    <div>
                                        <h6 className="mb-0">Good morning, Boris</h6>
                                        <small className="text-muted">Here is your job list status</small>
                                    </div>
                                </div>
                                <div className="row text-center">
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#2c3e50' }}>21,457</div>
                                        <small className="text-muted">Live Job</small>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#ff6b35' }}>5</div>
                                        <small className="text-muted">Companies</small>
                                    </div>
                                    <div className="col-4">
                                        <div className="fw-bold" style={{ fontSize: '1.5rem', color: '#2c3e50' }}>22</div>
                                        <small className="text-muted">New Applicants</small>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Featured Jobs Section */}
                <div className="container py-5">
                    <div className="row align-items-center mb-4">
                        <div className="col">
                            <h2 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>
                                Featured <span style={{ color: '#ff6b35' }}>jobs</span>
                            </h2>
                        </div>
                        <div className="col-auto">
                            <button
                                onClick={onShowAllJobs}
                                className="btn btn-link text-decoration-none p-0"
                                style={{ color: '#ff6b35' }}
                            >
                                Show all jobs →
                            </button>
                        </div>
                    </div>

                    <div className="row g-4">
                        {featuredJobs.map((job, index) => (
                            <div key={index} className="col-lg-6">
                                <div className="bg-white p-4 rounded shadow-sm">
                                    <div className="d-flex justify-content-between align-items-start mb-3">
                                        <div className="d-flex">
                                            <div className="me-3">
                                                <div
                                                    className="d-flex align-items-center justify-content-center rounded"
                                                    style={{ width: '50px', height: '50px', backgroundColor: '#f8f9fa', fontSize: '1.5rem' }}
                                                >
                                                    {job.logo}
                                                </div>
                                            </div>
                                            <div>
                                                <h6 className="fw-bold mb-1">{job.title}</h6>
                                                <p className="text-muted mb-1 small">{job.company} • {job.location}</p>
                                            </div>
                                        </div>
                                        <span
                                            className="badge px-2 py-1 small"
                                            style={{
                                                backgroundColor: job.tags[0] === 'FULL TIME' ? '#e8f5e8' : '#fff3cd',
                                                color: job.tags[0] === 'FULL TIME' ? '#28a745' : '#856404',
                                                fontWeight: '500'
                                            }}
                                        >
                                            {job.tags[0]}
                                        </span>
                                    </div>
                                    <p className="text-muted small mb-0">{job.description}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Footer */}
                <footer style={{ backgroundColor: '#2c3e50', color: '#ffffff' }}>
                    <div className="container py-5">
                        <div className="row">
                            <div className="col-lg-4 col-md-6 mb-4">
                                <div className="d-flex align-items-center mb-3">
                                    <div
                                        className="rounded-circle me-2 d-flex align-items-center justify-content-center"
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            backgroundColor: '#34495e',
                                            border: '2px solid #4a5c6b'
                                        }}
                                    >
                                        <span style={{ fontSize: '18px', color: '#ffffff' }}>👤</span>
                                    </div>
                                    <span className="fw-bold" style={{ fontSize: '24px', color: '#ffffff' }}>
                                        Part GO
                                    </span>
                                </div>
                                <p style={{ color: '#bdc3c7', lineHeight: '1.6', fontSize: '14px' }}>
                                    Great platform for the job seeker that passionate about startups. Find your dream job easier.
                                </p>
                            </div>

                            <div className="col-lg-2 col-md-3 col-6 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>About</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Companies</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Pricing</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Terms</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Advice</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Privacy Policy</a></li>
                                </ul>
                            </div>

                            <div className="col-lg-2 col-md-3 col-6 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Resources</h6>
                                <ul className="list-unstyled">
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Help Docs</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Guide</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Updates</a></li>
                                    <li className="mb-2"><a href="#" className="text-decoration-none" style={{ color: '#bdc3c7', fontSize: '14px' }}>Contact Us</a></li>
                                </ul>
                            </div>

                            <div className="col-lg-4 col-md-12 mb-4">
                                <h6 className="fw-bold mb-3" style={{ color: '#ffffff' }}>Get job notifications</h6>
                                <p style={{ color: '#bdc3c7', fontSize: '14px', marginBottom: '20px' }}>
                                    The latest job news, articles, sent to your inbox weekly.
                                </p>
                                <div className="d-flex">
                                    <input
                                        type="email"
                                        className="form-control me-2"
                                        placeholder="Email Address"
                                        style={{
                                            backgroundColor: '#ffffff',
                                            border: 'none',
                                            borderRadius: '6px 0 0 6px',
                                            padding: '12px 16px',
                                            fontSize: '14px'
                                        }}
                                    />
                                    <button
                                        className="btn px-4"
                                        style={{
                                            backgroundColor: '#e74c3c',
                                            borderColor: '#e74c3c',
                                            color: 'white',
                                            fontWeight: '500',
                                            borderRadius: '0 6px 6px 0',
                                            fontSize: '14px'
                                        }}
                                    >
                                        Subscribe
                                    </button>
                                </div>
                            </div>
                        </div>

                        <hr style={{ borderColor: '#4a5c6b', margin: '2rem 0 1.5rem 0' }} />
                        <div className="row align-items-center">
                            <div className="col-md-6">
                                <p className="mb-0" style={{ color: '#7f8c8d', fontSize: '14px' }}>
                                    2021 © JobHuntly. All rights reserved.
                                </p>
                            </div>
                        </div>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default PartGOHomepage;