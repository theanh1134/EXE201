import React, { useState } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
const PartGOJobsPage = ({ onBackToHome, onSelectJob }) => {
    const [searchKeyword, setSearchKeyword] = useState('');
    const [location, setLocation] = useState('Florence, Italy');
    const [sortBy, setSortBy] = useState('Most relevant');
    const [selectedFilters, setSelectedFilters] = useState({
        employmentType: ['Full-time'],
        categories: ['Business'],
        jobLevel: ['Director'],
        salaryRange: ['$2000 or above']
    });

    const jobs = [
        {
            id: 1,
            title: 'Social Media Assistant',
            company: 'Nomad',
            location: 'Paris, France',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 5,
            capacity: 10,
            logo: '🌟',
            color: '#10b981'
        },
        {
            id: 2,
            title: 'Brand Designer',
            company: 'Dropbox',
            location: 'San Francisco, USA',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 2,
            capacity: 10,
            logo: '📦',
            color: '#3b82f6'
        },
        {
            id: 3,
            title: 'Interactive Developer',
            company: 'Terraform',
            location: 'Hamburg, Germany',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 8,
            capacity: 12,
            logo: '⚡',
            color: '#06b6d4'
        },
        {
            id: 4,
            title: 'Email Marketing',
            company: 'Revolut',
            location: 'Madrid, Spain',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 0,
            capacity: 10,
            logo: '📧',
            color: '#1f2937'
        },
        {
            id: 5,
            title: 'Lead Engineer',
            company: 'Canva',
            location: 'Ankara, Turkey',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 5,
            capacity: 10,
            logo: '🎨',
            color: '#06b6d4'
        },
        {
            id: 6,
            title: 'Product Designer',
            company: 'ClassPass',
            location: 'Berlin, Germany',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 5,
            capacity: 10,
            logo: '🏃',
            color: '#3b82f6'
        },
        {
            id: 7,
            title: 'Customer Manager',
            company: 'Pitch',
            location: 'Berlin, Germany',
            type: 'Full-Time',
            tags: ['Marketing', 'Design'],
            applied: 5,
            capacity: 10,
            logo: '⚫',
            color: '#1f2937'
        }
    ];

    const filterOptions = {
        employmentType: [
            { name: 'Full-time', count: 3 },
            { name: 'Part-time', count: 5 },
            { name: 'Remote', count: 2 },
            { name: 'Internship', count: 24 },
            { name: 'Contract', count: 3 }
        ],
        categories: [
            { name: 'Design', count: 24 },
            { name: 'Sales', count: 3 },
            { name: 'Marketing', count: 3 },
            { name: 'Business', count: 3, selected: true },
            { name: 'Human Resource', count: 6 },
            { name: 'Finance', count: 4 },
            { name: 'Engineering', count: 4 },
            { name: 'Technology', count: 5 }
        ],
        jobLevel: [
            { name: 'Entry Level', count: 57 },
            { name: 'Mid Level', count: 3 },
            { name: 'Senior Level', count: 5 },
            { name: 'Director', count: 12, selected: true },
            { name: 'VP or Above', count: 8 }
        ],
        salaryRange: [
            { name: '$700 - $1000', count: 4 },
            { name: '$100 - $1500', count: 6 },
            { name: '$1500 - $2000', count: 10 },
            { name: '$2000 or above', count: 4, selected: true }
        ]
    };

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
                <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    position: 'relative',
                    overflow: 'hidden'
                }}>
                    {/* Decorative elements */}
                    <div style={{
                        position: 'absolute',
                        top: '20px',
                        right: '10%',
                        width: '100px',
                        height: '100px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }}></div>
                    <div style={{
                        position: 'absolute',
                        bottom: '30px',
                        left: '5%',
                        width: '60px',
                        height: '60px',
                        background: 'rgba(255,255,255,0.1)',
                        borderRadius: '50%'
                    }}></div>

                    <div className="container py-5 text-center">
                        <h1 className="display-5 fw-bold text-white mb-3">
                            Find your <span style={{ textDecoration: 'underline', textDecorationColor: '#ff6b35' }}>dream job</span>
                        </h1>
                        <p className="text-white mb-4 opacity-75">
                            Find your next career at companies like HubSpot, Nike, and Dropbox
                        </p>

                        {/* Search Form */}
                        <div
                            className="bg-white p-3 rounded-3 mx-auto"
                            style={{
                                maxWidth: '600px',
                                boxShadow: '0 10px 30px rgba(0,0,0,0.15)'
                            }}
                        >
                            <div className="row g-0 align-items-center">
                                <div className="col-md-5">
                                    <div className="d-flex align-items-center px-3 py-2" style={{ borderRight: '1px solid #f1f3f4' }}>
                                        <div className="me-2" style={{ color: '#6c757d', fontSize: '18px' }}>
                                            🔍
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 p-0"
                                            placeholder="Job title or keyword"
                                            value={searchKeyword}
                                            onChange={(e) => setSearchKeyword(e.target.value)}
                                            style={{
                                                fontSize: '16px',
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-5">
                                    <div className="d-flex align-items-center px-3 py-2">
                                        <div className="me-2" style={{ color: '#6c757d', fontSize: '18px' }}>
                                            📍
                                        </div>
                                        <input
                                            type="text"
                                            className="form-control border-0 p-0"
                                            value={location}
                                            onChange={(e) => setLocation(e.target.value)}
                                            style={{
                                                fontSize: '16px',
                                                backgroundColor: 'transparent',
                                                boxShadow: 'none'
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-2">
                                    <button
                                        className="btn w-100"
                                        style={{
                                            backgroundColor: '#ff6b35',
                                            color: 'white',
                                            fontWeight: '600',
                                            borderRadius: '8px',
                                            padding: '10px',
                                            fontSize: '16px',
                                            border: 'none'
                                        }}
                                    >
                                        Search
                                    </button>
                                </div>
                            </div>
                        </div>

                        <p className="text-white mt-3 opacity-75 small">
                            Popular: UI Designer, UX Researcher, Android, Admin
                        </p>
                    </div>
                </div>

                {/* Main Content */}
                <div className="container py-5">
                    <div className="row">

                        {/* Sidebar Filters */}
                        <div className="col-lg-3">
                            <div className="bg-white p-4 rounded shadow-sm mb-4">

                                {/* Type of Employment */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Type of Employment</h6>
                                        <span>⌄</span>
                                    </div>
                                    {filterOptions.employmentType.map((option, index) => (
                                        <div key={index} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`employment-${index}`}
                                                defaultChecked={option.name === 'Full-time'}
                                            />
                                            <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`employment-${index}`}>
                                                <span>{option.name}</span>
                                                <span className="text-muted">({option.count})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Categories */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Categories</h6>
                                        <span>⌄</span>
                                    </div>
                                    {filterOptions.categories.map((option, index) => (
                                        <div key={index} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`category-${index}`}
                                                defaultChecked={option.selected}
                                                style={option.selected ? { accentColor: '#ff6b35' } : {}}
                                            />
                                            <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`category-${index}`}>
                                                <span>{option.name}</span>
                                                <span className="text-muted">({option.count})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Job Level */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Job Level</h6>
                                        <span>⌄</span>
                                    </div>
                                    {filterOptions.jobLevel.map((option, index) => (
                                        <div key={index} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`level-${index}`}
                                                defaultChecked={option.selected}
                                                style={option.selected ? { accentColor: '#ff6b35' } : {}}
                                            />
                                            <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`level-${index}`}>
                                                <span>{option.name}</span>
                                                <span className="text-muted">({option.count})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                                {/* Salary Range */}
                                <div className="mb-4">
                                    <div className="d-flex justify-content-between align-items-center mb-3">
                                        <h6 className="fw-bold mb-0">Salary Range</h6>
                                        <span>⌄</span>
                                    </div>
                                    {filterOptions.salaryRange.map((option, index) => (
                                        <div key={index} className="form-check mb-2">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id={`salary-${index}`}
                                                defaultChecked={option.selected}
                                                style={option.selected ? { accentColor: '#ff6b35' } : {}}
                                            />
                                            <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`salary-${index}`}>
                                                <span>{option.name}</span>
                                                <span className="text-muted">({option.count})</span>
                                            </label>
                                        </div>
                                    ))}
                                </div>

                            </div>
                        </div>

                        {/* Main Content */}
                        <div className="col-lg-9">

                            {/* Header */}
                            <div className="d-flex justify-content-between align-items-center mb-4">
                                <div>
                                    <h2 className="fw-bold mb-1">All Jobs</h2>
                                    <p className="text-muted mb-0">Showing 73 results</p>
                                </div>
                                <div className="d-flex align-items-center">
                                    <span className="me-2 text-muted">Sort by:</span>
                                    <select
                                        className="form-select border-0 bg-transparent"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                        style={{ width: 'auto' }}
                                    >
                                        <option>Most relevant</option>
                                        <option>Newest</option>
                                        <option>Oldest</option>
                                    </select>
                                    <div className="ms-3">
                                        <button className="btn btn-sm btn-outline-secondary me-2">☰</button>
                                        <button className="btn btn-sm" style={{ backgroundColor: '#ff6b35', color: 'white' }}>⊞</button>
                                    </div>
                                </div>
                            </div>

                            {/* Job Cards */}
                            <div className="row">
                                {jobs.map((job) => (
                                    <div key={job.id} className="col-md-6 mb-4">
                                        <div
                                            className="bg-white rounded-3 h-100 position-relative"
                                            style={{
                                                border: '1px solid #f1f3f4',
                                                transition: 'all 0.3s ease',
                                                cursor: 'pointer'
                                            }}
                                            onClick={() => onSelectJob(job.id)}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.transform = 'translateY(-2px)';
                                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(0,0,0,0.1)';
                                                e.currentTarget.style.borderColor = '#e0e0e0';
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.transform = 'translateY(0)';
                                                e.currentTarget.style.boxShadow = 'none';
                                                e.currentTarget.style.borderColor = '#f1f3f4';
                                            }}
                                        >
                                            <div className="p-4">
                                                {/* Header Section */}
                                                <div className="d-flex align-items-start mb-4">
                                                    <div
                                                        className="me-3 d-flex align-items-center justify-content-center rounded-3"
                                                        style={{
                                                            width: '56px',
                                                            height: '56px',
                                                            backgroundColor: job.color,
                                                            fontSize: '1.5rem',
                                                            flexShrink: 0
                                                        }}
                                                    >
                                                        <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                                                            {job.logo}
                                                        </span>
                                                    </div>
                                                    <div className="flex-grow-1 min-width-0">
                                                        <h5 className="fw-bold mb-2 text-truncate" style={{ color: '#1a1a1a', fontSize: '18px' }}>
                                                            {job.title}
                                                        </h5>
                                                        <p className="text-muted mb-0" style={{ fontSize: '14px', lineHeight: '1.4' }}>
                                                            <span className="fw-medium">{job.company}</span>
                                                            <span className="mx-2">•</span>
                                                            <span>{job.location}</span>
                                                        </p>
                                                    </div>
                                                </div>

                                                {/* Tags Section */}
                                                <div className="d-flex flex-wrap gap-2 mb-4">
                                                    <span
                                                        className="badge px-3 py-2"
                                                        style={{
                                                            backgroundColor: '#f0f9f0',
                                                            color: '#1b5e20',
                                                            fontSize: '12px',
                                                            fontWeight: '500',
                                                            borderRadius: '20px',
                                                            border: '1px solid #e8f5e8'
                                                        }}
                                                    >
                                                        {job.type}
                                                    </span>
                                                    {job.tags.map((tag, index) => (
                                                        <span
                                                            key={index}
                                                            className="badge px-3 py-2"
                                                            style={{
                                                                backgroundColor: '#fff8e1',
                                                                color: '#f57600',
                                                                fontSize: '12px',
                                                                fontWeight: '500',
                                                                borderRadius: '20px',
                                                                border: '1px solid #ffecb3'
                                                            }}
                                                        >
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>

                                                {/* Footer Section */}
                                                <div className="d-flex justify-content-between align-items-center">
                                                    <div>
                                                        <div
                                                            className="progress mb-2"
                                                            style={{
                                                                height: '6px',
                                                                backgroundColor: '#f5f5f5',
                                                                width: '120px',
                                                                borderRadius: '3px'
                                                            }}
                                                        >
                                                            <div
                                                                className="progress-bar"
                                                                style={{
                                                                    width: `${(job.applied / job.capacity) * 100}%`,
                                                                    backgroundColor: job.applied === 0 ? '#e0e0e0' : '#ff6b35',
                                                                    borderRadius: '3px'
                                                                }}
                                                            ></div>
                                                        </div>
                                                        <small style={{ color: '#666', fontSize: '12px' }}>
                                                            <span className="fw-medium">{job.applied}</span> applied of <span className="fw-medium">{job.capacity}</span> capacity
                                                        </small>
                                                    </div>

                                                    <button
                                                        className="btn px-4 py-2"
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onSelectJob(job.id);
                                                        }}
                                                        style={{
                                                            backgroundColor: '#ff6b35',
                                                            color: 'white',
                                                            fontWeight: '600',
                                                            fontSize: '14px',
                                                            borderRadius: '8px',
                                                            border: 'none',
                                                            transition: 'all 0.3s ease',
                                                            boxShadow: '0 2px 8px rgba(255, 107, 53, 0.3)'
                                                        }}
                                                        onMouseEnter={(e) => {
                                                            e.target.style.backgroundColor = '#e55a2b';
                                                            e.target.style.transform = 'translateY(-1px)';
                                                            e.target.style.boxShadow = '0 4px 12px rgba(255, 107, 53, 0.4)';
                                                        }}
                                                        onMouseLeave={(e) => {
                                                            e.target.style.backgroundColor = '#ff6b35';
                                                            e.target.style.transform = 'translateY(0)';
                                                            e.target.style.boxShadow = '0 2px 8px rgba(255, 107, 53, 0.3)';
                                                        }}
                                                    >
                                                        Apply Now
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Subtle top border accent */}
                                            <div
                                                style={{
                                                    position: 'absolute',
                                                    top: 0,
                                                    left: 0,
                                                    right: 0,
                                                    height: '3px',
                                                    background: `linear-gradient(90deg, ${job.color}, ${job.color}90)`,
                                                    borderRadius: '12px 12px 0 0'
                                                }}
                                            ></div>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Pagination */}
                            <div className="d-flex justify-content-center mt-4">
                                <nav>
                                    <ul className="pagination">
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>‹</a>
                                        </li>
                                        <li className="page-item active">
                                            <a className="page-link" href="#" style={{ backgroundColor: '#ff6b35', borderColor: '#ff6b35' }}>1</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>2</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>3</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>4</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>5</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>...</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>33</a>
                                        </li>
                                        <li className="page-item">
                                            <a className="page-link" href="#" style={{ color: '#6c757d' }}>›</a>
                                        </li>
                                    </ul>
                                </nav>
                            </div>

                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default PartGOJobsPage;