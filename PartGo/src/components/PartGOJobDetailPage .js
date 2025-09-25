import React, { useState } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
const PartGOJobDetailPage = ({ jobId, onBackToJobs }) => {
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    
    // Mock data for job detail
    const jobDetail = {
        id: jobId || 1,
        title: 'Social Media Assistant',
        company: 'Stripe',
        location: 'Paris, France',
        type: 'Full-Time',
        logo: '💜',
        color: '#635bff',
        posted: 'July 31, 2021',
        applications: 22,
        about: {
            employeeCount: 'July 31, 2021',
            industry: 'July 31, 2021',
            stage: 'July 31, 2021',
            salary: '$75,000-100,000'
        },
        description: `We're looking for a mid-level product designer to join our team. You would be working closely with one of our clients to launch products from concept to execution. This role requires someone that can work independently with little oversight as our company is fast-paced and we value people who can take direction and run with them.`,
        responsibilities: [
            'Work on a wide range of projects and media, using various computer software to visualize and develop innovative graphic design that meets business goals',
            'Obtain input from managers to ensure that designs meet organization requirements and brand/client goals',
            'Create and maintain documentation and guidelines that define content where on site',
            'Prepare and produce proposals and presentations for account pitches',
            'Work with a wide range of media tools and programs'
        ],
        whoYouAre: [
            'You get energy from people and building the optimized, size experience',
            'You have a natural eye for design and the requisites skills for translating it',
            'You are design process and a strong culture across diverse areas',
            'You are skilled with various user and associated',
            'You are a strong reliable and creative problem-solving champion'
        ],
        niceToHaves: [
            'Figma, Sketch',
            'Previous work experience',
            'Product management skills',
            'Developing and marketing'
        ],
        benefits: [
            { title: 'Full Healthcare', desc: 'We believe in treating all staff as well so that you like to be', icon: '🏥' },
            { title: 'Unlimited Vacation', desc: 'We believe you should have a flexible schedule and decide where you want', icon: '🏖️' },
            { title: 'Skill Development', desc: 'We believe in always learning and want staff to attend workshops, conferences', icon: '📈' },
            { title: 'Team Summits', desc: 'Once a year the entire company team takes an incredible trip together', icon: '🎯' },
            { title: 'Remote Working', desc: 'You decide when you want to work from home or can start anytime anywhere', icon: '💻' },
            { title: 'Commuter Benefits', desc: 'We\'re grateful for all the hard work you do and commuting shouldn\'t', icon: '🚌' },
            { title: 'We give back to the community', desc: 'We\'ll donate to any organization and charity that you are passionate about', icon: '❤️' },
            { title: 'Meals', desc: 'We believe you should never have to bring lunch to work if you don\'t want', icon: '🍕' }
        ],
        similarJobs: [
            { title: 'Social Media Assistant', company: 'Revolut', location: 'Paris, France', tags: ['Design'], logo: '🟢', color: '#00d4aa' },
            { title: 'Social Media Assistant', company: 'Spotify', location: 'New York, US', tags: ['Marketing'], logo: '🎵', color: '#1db954' },
            { title: 'Brand Designer', company: 'Dropbox', location: 'San Francisco, USA', tags: ['Full-Time', 'Marketing'], logo: '📦', color: '#0061ff' },
            { title: 'Brand Designer', company: 'Pinterest', location: 'San Francisco, USA', tags: ['Full-Time'], logo: '📌', color: '#bd081c' },
            { title: 'Interactive Developer', company: 'Terraform', location: 'Hamburg, Germany', tags: ['Design'], logo: '⚡', color: '#623ce4' },
            { title: 'Interactive Developer', company: 'ClassPass', location: 'Manchester, UK', tags: ['Marketing'], logo: '🏃', color: '#1c1c1c' },
            { title: 'HR Manager', company: 'Reddit', location: 'London, Netherlands', tags: ['Design'], logo: '🔶', color: '#ff4500' },
            { title: 'HR Manager', company: 'Webflow', location: 'London, Netherlands', tags: ['Marketing'], logo: '💙', color: '#146ef5' }
        ]
    };

    const ApplicationModal = () => {
        const [formData, setFormData] = useState({
            fullName: '',
            email: '',
            phone: '',
            currentJobTitle: '',
            linkedinUrl: '',
            portfolioUrl: '',
            additionalInfo: ''
        });

        const handleInputChange = (e) => {
            const { name, value } = e.target;
            setFormData(prev => ({
                ...prev,
                [name]: value
            }));
        };

        const handleSubmit = (e) => {
            e.preventDefault();
            console.log('Application submitted:', formData);
            alert('Application submitted successfully!');
            setShowApplicationModal(false);
        };

        return (
            <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
                <div className="modal-dialog modal-dialog-centered" style={{ maxWidth: '500px' }}>
                    <div className="modal-content" style={{ borderRadius: '12px', border: 'none' }}>
                        {/* Modal Header */}
                        <div className="modal-header border-0 pb-2">
                            <div className="d-flex align-items-center">
                                <div 
                                    className="me-3 d-flex align-items-center justify-content-center rounded-3"
                                    style={{
                                        width: '40px',
                                        height: '40px',
                                        backgroundColor: '#22c55e',
                                        fontSize: '1.2rem'
                                    }}
                                >
                                    <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>🏠</span>
                                </div>
                                <div>
                                    <h5 className="modal-title fw-bold mb-0">Social Media Assistant</h5>
                                    <small className="text-muted">Remote • Paris, France • Full-Time</small>
                                </div>
                            </div>
                            <button 
                                type="button" 
                                className="btn-close" 
                                onClick={() => setShowApplicationModal(false)}
                            ></button>
                        </div>

                        {/* Modal Body */}
                        <div className="modal-body px-4">
                            <h6 className="fw-bold mb-3">Submit your application</h6>
                            <p className="text-muted small mb-4">The following is required and will only be shared with Homer.</p>

                            <form onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Full name</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Enter your full name"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Email address</label>
                                    <input 
                                        type="email" 
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Enter your email address"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Phone number</label>
                                    <input 
                                        type="tel" 
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Enter your phone number"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                    />
                                </div>

                                {/* Current Job Title */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Current or previous job title</label>
                                    <input 
                                        type="text" 
                                        className="form-control"
                                        name="currentJobTitle"
                                        value={formData.currentJobTitle}
                                        onChange={handleInputChange}
                                        placeholder="What's your current or previous job title?"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                    />
                                </div>

                                {/* Links Section */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">LINKS</h6>
                                    
                                    {/* LinkedIn */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">LinkedIn URL</label>
                                        <input 
                                            type="url" 
                                            className="form-control"
                                            name="linkedinUrl"
                                            value={formData.linkedinUrl}
                                            onChange={handleInputChange}
                                            placeholder="Link to your LinkedIn URL"
                                            style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        />
                                    </div>

                                    {/* Portfolio */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">Portfolio URL</label>
                                        <input 
                                            type="url" 
                                            className="form-control"
                                            name="portfolioUrl"
                                            value={formData.portfolioUrl}
                                            onChange={handleInputChange}
                                            placeholder="Link to your portfolio URL"
                                            style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        />
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Additional information</label>
                                    <textarea 
                                        className="form-control"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Add a cover letter or anything else you want to share."
                                        style={{ 
                                            borderRadius: '8px', 
                                            border: '1px solid #e9ecef', 
                                            padding: '12px',
                                            resize: 'vertical',
                                            minHeight: '100px'
                                        }}
                                    ></textarea>
                                    <div className="d-flex justify-content-between align-items-center mt-2">
                                        <div className="d-flex gap-2">
                                            <button type="button" className="btn btn-sm btn-link p-0 text-muted">
                                                <strong>B</strong>
                                            </button>
                                            <button type="button" className="btn btn-sm btn-link p-0 text-muted">
                                                <em>I</em>
                                            </button>
                                            <button type="button" className="btn btn-sm btn-link p-0 text-muted">
                                                <span>•</span>
                                            </button>
                                            <button type="button" className="btn btn-sm btn-link p-0 text-muted">
                                                <span>📎</span>
                                            </button>
                                        </div>
                                        <small className="text-muted">0 / 500</small>
                                    </div>
                                </div>

                                {/* Resume Upload */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Attach your resume</label>
                                    <div 
                                        className="border border-dashed p-3 text-center"
                                        style={{ 
                                            borderRadius: '8px', 
                                            borderColor: '#ff6b35',
                                            backgroundColor: '#fff8f5'
                                        }}
                                    >
                                        <div className="text-center">
                                            <span style={{ color: '#ff6b35', fontSize: '1.2rem' }}>📎</span>
                                            <span className="text-muted ms-2">Attach Resume/CV</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Submit Button */}
                                <button 
                                    type="submit" 
                                    className="btn w-100 py-3 fw-bold"
                                    style={{ 
                                        backgroundColor: '#ff6b35', 
                                        color: 'white', 
                                        borderRadius: '8px',
                                        border: 'none',
                                        fontSize: '16px'
                                    }}
                                >
                                    Submit Application
                                </button>

                                {/* Terms */}
                                <p className="text-muted small text-center mt-3 mb-0">
                                    By sending this request you can confirm that you accept our{' '}
                                    <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                        Terms of Service
                                    </a>{' '}
                                    and{' '}
                                    <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                        Privacy Policy
                                    </a>
                                </p>
                            </form>
                        </div>
                    </div>
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

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>

                {/* Header */}
                <Header/>
                {/* Main Content */}
                <div className="container py-4">

                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={onBackToJobs}
                                    style={{ color: '#6c757d', border: 'none', background: 'none' }}
                                >
                                    Home
                                </button>
                            </li>
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={onBackToJobs}
                                    style={{ color: '#6c757d', border: 'none', background: 'none' }}
                                >
                                    Find Jobs
                                </button>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#ff6b35' }}>
                                Social Media Assistant
                            </li>
                        </ol>
                    </nav>

                    <div className="row">

                        {/* Main Content */}
                        <div className="col-lg-8">

                            {/* Job Header */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex">
                                        <div
                                            className="me-4 d-flex align-items-center justify-content-center rounded-3"
                                            style={{
                                                width: '80px',
                                                height: '80px',
                                                backgroundColor: jobDetail.color,
                                                fontSize: '2.5rem'
                                            }}
                                        >
                                            <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                                                {jobDetail.logo}
                                            </span>
                                        </div>
                                        <div>
                                            <h1 className="fw-bold mb-2" style={{ color: '#2c3e50', fontSize: '32px' }}>
                                                {jobDetail.title}
                                            </h1>
                                            <p className="text-muted mb-0" style={{ fontSize: '16px' }}>
                                                {jobDetail.company} • {jobDetail.location} • {jobDetail.type}
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        className="btn px-4 py-3"
                                        onClick={() => setShowApplicationModal(true)}
                                        style={{
                                            backgroundColor: '#ff6b35',
                                            color: 'white',
                                            fontWeight: '600',
                                            fontSize: '16px',
                                            borderRadius: '8px',
                                            border: 'none',
                                            minWidth: '100px'
                                        }}
                                    >
                                        Apply
                                    </button>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Description</h3>
                                <p className="text-muted" style={{ lineHeight: '1.6' }}>
                                    {jobDetail.description}
                                </p>
                            </div>

                            {/* Responsibilities */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Responsibilities</h3>
                                <ul className="list-unstyled">
                                    {jobDetail.responsibilities.map((item, index) => (
                                        <li key={index} className="d-flex mb-3">
                                            <span className="me-3 text-success">✓</span>
                                            <span className="text-muted" style={{ lineHeight: '1.6' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Who You Are */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Who You Are</h3>
                                <ul className="list-unstyled">
                                    {jobDetail.whoYouAre.map((item, index) => (
                                        <li key={index} className="d-flex mb-3">
                                            <span className="me-3 text-success">✓</span>
                                            <span className="text-muted" style={{ lineHeight: '1.6' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Nice-To-Haves */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h3 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Nice-To-Haves</h3>
                                <ul className="list-unstyled">
                                    {jobDetail.niceToHaves.map((item, index) => (
                                        <li key={index} className="d-flex mb-3">
                                            <span className="me-3 text-success">✓</span>
                                            <span className="text-muted" style={{ lineHeight: '1.6' }}>{item}</span>
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* Perks & Benefits */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h3 className="fw-bold mb-4" style={{ color: '#2c3e50' }}>Perks & Benefits</h3>
                                <p className="text-muted mb-4">This job comes with several perks and benefits</p>

                                <div className="row g-4">
                                    {jobDetail.benefits.map((benefit, index) => (
                                        <div key={index} className="col-md-6">
                                            <div className="text-center p-3">
                                                <div className="mb-3" style={{ fontSize: '2.5rem' }}>
                                                    {benefit.icon}
                                                </div>
                                                <h6 className="fw-bold mb-2">{benefit.title}</h6>
                                                <p className="text-muted small" style={{ lineHeight: '1.5' }}>
                                                    {benefit.desc}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <div className="d-flex align-items-center">
                                    <div
                                        className="me-3 d-flex align-items-center justify-content-center rounded-3"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: jobDetail.color,
                                            fontSize: '1.8rem'
                                        }}
                                    >
                                        <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                                            {jobDetail.logo}
                                        </span>
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 className="fw-bold mb-1">{jobDetail.company}</h5>
                                        <p className="text-muted small mb-0">About Stripe - 4</p>
                                    </div>
                                </div>
                                <div className="mt-3">
                                    <p className="text-muted small">
                                        Stripe is a technology company that builds economic infrastructure for the internet. Businesses of every size from new
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">

                            {/* About this role */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>About this role</h5>
                                <div className="mb-3">
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Apply Before</span>
                                        <span className="fw-medium">{jobDetail.about.employeeCount}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Job Posted On</span>
                                        <span className="fw-medium">{jobDetail.about.industry}</span>
                                    </div>
                                    <div className="d-flex justify-content-between mb-2">
                                        <span className="text-muted">Job Type</span>
                                        <span className="fw-medium">{jobDetail.about.stage}</span>
                                    </div>
                                    <div className="d-flex justify-content-between">
                                        <span className="text-muted">Salary</span>
                                        <span className="fw-medium">{jobDetail.about.salary}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Categories</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge px-3 py-2" style={{ backgroundColor: '#fff3cd', color: '#856404', borderRadius: '20px' }}>
                                        Marketing
                                    </span>
                                    <span className="badge px-3 py-2" style={{ backgroundColor: '#e1f5fe', color: '#0277bd', borderRadius: '20px' }}>
                                        Design
                                    </span>
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                                <h5 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Required Skills</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge px-3 py-2" style={{ backgroundColor: '#f0f9f0', color: '#2e7d32', borderRadius: '20px' }}>
                                        Social Media Marketing
                                    </span>
                                    <span className="badge px-3 py-2" style={{ backgroundColor: '#e8f5e8', color: '#1b5e20', borderRadius: '20px' }}>
                                        English
                                    </span>
                                    <span className="badge px-3 py-2" style={{ backgroundColor: '#fff8e1', color: '#f57600', borderRadius: '20px' }}>
                                        Copy Writing
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Similar Jobs */}
                    <div className="mt-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 className="fw-bold mb-0" style={{ color: '#2c3e50' }}>Similar Jobs</h3>
                            <button
                                className="btn btn-link text-decoration-none p-0"
                                onClick={onBackToJobs}
                                style={{ color: '#ff6b35' }}
                            >
                                Show all jobs →
                            </button>
                        </div>

                        <div className="row">
                            {jobDetail.similarJobs.map((job, index) => (
                                <div key={index} className="col-lg-3 col-md-6 mb-4">
                                    <div className="bg-white p-3 rounded-3 shadow-sm h-100">
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="me-2 d-flex align-items-center justify-content-center rounded"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: job.color,
                                                    fontSize: '1.2rem'
                                                }}
                                            >
                                                <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                                                    {job.logo}
                                                </span>
                                            </div>
                                            <div className="min-width-0">
                                                <h6 className="fw-bold mb-0 small text-truncate">{job.title}</h6>
                                                <p className="text-muted mb-0 small">{job.company} • {job.location}</p>
                                            </div>
                                        </div>
                                        <div className="d-flex flex-wrap gap-1 mb-3">
                                            {job.tags.map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="badge px-2 py-1"
                                                    style={{
                                                        backgroundColor: '#e8f5e8',
                                                        color: '#1b5e20',
                                                        fontSize: '10px',
                                                        borderRadius: '12px'
                                                    }}
                                                >
                                                    {tag}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>

            {/* Application Modal */}
            {showApplicationModal && <ApplicationModal />}
        </div>
    );
};

export default PartGOJobDetailPage;