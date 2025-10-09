import React, { useState } from 'react';
import Header from './Header';

const CompanyReviews = ({ onBackToHome }) => {
    const [activeTab, setActiveTab] = useState('reviews');
    const [showReviewForm, setShowReviewForm] = useState(false);
    const [reviewData, setReviewData] = useState({
        companyName: '',
        jobTitle: '',
        rating: 5,
        pros: '',
        cons: '',
        overallExperience: '',
        workLifeBalance: 5,
        management: 5,
        compensation: 5,
        culture: 5
    });

    const companies = [
        {
            id: 1,
            name: 'Công ty Nomad',
            logo: '🌟',
            color: '#10b981',
            overallRating: 4.5,
            totalReviews: 24,
            averageHourlyRate: '30,000-45,000 VNĐ',
            categories: ['Marketing', 'Làm việc từ xa'],
            reviews: [
                {
                    id: 1,
                    jobTitle: 'Nhân viên mạng xã hội',
                    rating: 5,
                    pros: 'Đồng đội tốt, giờ linh hoạt, lương ổn',
                    cons: 'Đôi khi hướng dẫn chưa rõ ràng',
                    overallExperience: 'Trải nghiệm tốt. Đội ngũ hỗ trợ và công việc thú vị.',
                    workLifeBalance: 5,
                    management: 4,
                    compensation: 5,
                    culture: 5,
                    reviewer: 'Sarah J.',
                    date: '2 tuần trước'
                },
                {
                    id: 2,
                    jobTitle: 'Nhân viên viết nội dung',
                    rating: 4,
                    pros: 'Làm từ xa, tự do sáng tạo',
                    cons: 'Deadline gắt',
                    overallExperience: 'Tổng thể ổn. Quản lý hiểu lịch làm part-time.',
                    workLifeBalance: 4,
                    management: 4,
                    compensation: 4,
                    culture: 4,
                    reviewer: 'Mike C.',
                    date: '1 tháng trước'
                }
            ]
        },
        {
            id: 2,
            name: 'Dropbox',
            logo: '📦',
            color: '#3b82f6',
            overallRating: 4.2,
            totalReviews: 18,
            averageHourlyRate: '25,000-40,000 VNĐ',
            categories: ['Chăm sóc khách hàng', 'Làm việc từ xa'],
            reviews: [
                {
                    id: 3,
                    jobTitle: 'Nhân viên chăm sóc khách hàng',
                    rating: 4,
                    pros: 'Đào tạo tốt, đội ngũ hỗ trợ',
                    cons: 'Công việc có thể lặp lại',
                    overallExperience: 'Cơ hội part-time ổn với phúc lợi tốt.',
                    workLifeBalance: 4,
                    management: 4,
                    compensation: 3,
                    culture: 4,
                    reviewer: 'Emily D.',
                    date: '3 tuần trước'
                }
            ]
        }
    ];

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        setReviewData(prev => ({
            ...prev,
            [name]: type === 'number' ? parseInt(value) : value
        }));
    };

    const handleReviewSubmit = (e) => {
        e.preventDefault();
        console.log('Review submitted:', reviewData);
        alert('Review submitted successfully!');
        setShowReviewForm(false);
        setReviewData({
            companyName: '',
            jobTitle: '',
            rating: 5,
            pros: '',
            cons: '',
            overallExperience: '',
            workLifeBalance: 5,
            management: 5,
            compensation: 5,
            culture: 5
        });
    };

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, i) => (
            <span key={i} style={{ color: i < rating ? '#ffc107' : '#e9ecef', fontSize: '18px' }}>
                ★
            </span>
        ));
    };

    const ReviewForm = () => (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: '12px' }}>
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Viết đánh giá</h5>
                        <button
                            type="button"
                            className="btn-close"
                            onClick={() => setShowReviewForm(false)}
                        ></button>
                    </div>
                    <div className="modal-body">
                        <form onSubmit={handleReviewSubmit}>
                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Tên công ty</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="companyName"
                                        value={reviewData.companyName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập tên công ty"
                                        required
                                    />
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Chức danh công việc</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="jobTitle"
                                        value={reviewData.jobTitle}
                                        onChange={handleInputChange}
                                        placeholder="Chức danh của bạn"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Đánh giá tổng thể</label>
                                <div className="d-flex align-items-center gap-2">
                                    {renderStars(reviewData.rating)}
                                    <input
                                        type="range"
                                        className="form-range flex-grow-1"
                                        name="rating"
                                        min="1"
                                        max="5"
                                        value={reviewData.rating}
                                        onChange={handleInputChange}
                                        style={{ maxWidth: '200px' }}
                                    />
                                    <span className="fw-medium">{reviewData.rating}/5</span>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Cân bằng công việc - cuộc sống</label>
                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(reviewData.workLifeBalance)}
                                        <input
                                            type="range"
                                            className="form-range"
                                            name="workLifeBalance"
                                            min="1"
                                            max="5"
                                            value={reviewData.workLifeBalance}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Quản lý</label>
                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(reviewData.management)}
                                        <input
                                            type="range"
                                            className="form-range"
                                            name="management"
                                            min="1"
                                            max="5"
                                            value={reviewData.management}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="row">
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Đãi ngộ</label>
                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(reviewData.compensation)}
                                        <input
                                            type="range"
                                            className="form-range"
                                            name="compensation"
                                            min="1"
                                            max="5"
                                            value={reviewData.compensation}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                                <div className="col-md-6 mb-3">
                                    <label className="form-label fw-medium">Văn hóa công ty</label>
                                    <div className="d-flex align-items-center gap-2">
                                        {renderStars(reviewData.culture)}
                                        <input
                                            type="range"
                                            className="form-range"
                                            name="culture"
                                            min="1"
                                            max="5"
                                            value={reviewData.culture}
                                            onChange={handleInputChange}
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Điểm hài lòng</label>
                                <textarea
                                    className="form-control"
                                    name="pros"
                                    value={reviewData.pros}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Bạn hài lòng điều gì khi làm việc ở đây?"
                                ></textarea>
                            </div>

                            <div className="mb-3">
                                <label className="form-label fw-medium">Điểm chưa hài lòng</label>
                                <textarea
                                    className="form-control"
                                    name="cons"
                                    value={reviewData.cons}
                                    onChange={handleInputChange}
                                    rows="3"
                                    placeholder="Điều gì có thể cải thiện?"
                                ></textarea>
                            </div>

                            <div className="mb-4">
                                <label className="form-label fw-medium">Trải nghiệm tổng thể</label>
                                <textarea
                                    className="form-control"
                                    name="overallExperience"
                                    value={reviewData.overallExperience}
                                    onChange={handleInputChange}
                                    rows="4"
                                    placeholder="Chia sẻ trải nghiệm tổng thể khi làm việc tại công ty..."
                                    required
                                ></textarea>
                            </div>

                            <div className="d-flex gap-3">
                                <button
                                    type="button"
                                    className="btn btn-outline-secondary px-4"
                                    onClick={() => setShowReviewForm(false)}
                                >
                                    Hủy
                                </button>
                                <button
                                    type="submit"
                                    className="btn px-4"
                                    style={{
                                        backgroundColor: '#ff6b35',
                                        color: 'white',
                                        border: 'none'
                                    }}
                                >
                                    Gửi đánh giá
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );

    return (
        <div>
            {/* Bootstrap CSS */}
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />

            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                {/* Header */}
                <Header />

                {/* Main Content */}
                <div className="container py-4">
                    {/* Page Header */}
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <div>
                            <h1 className="fw-bold mb-1" style={{ color: '#2c3e50' }}>Đánh giá công ty</h1>
                            <p className="text-muted mb-0">Đọc đánh giá từ người lao động part-time</p>
                        </div>
                        <button
                            className="btn px-4 py-2"
                            onClick={() => setShowReviewForm(true)}
                            style={{
                                backgroundColor: '#ff6b35',
                                color: 'white',
                                border: 'none',
                                borderRadius: '8px',
                                fontWeight: '500'
                            }}
                        >
                            + Viết đánh giá
                        </button>
                    </div>

                    {/* Company Cards */}
                    <div className="row">
                        {companies.map((company) => (
                            <div key={company.id} className="col-lg-6 mb-4">
                                <div className="bg-white p-4 rounded-3 shadow-sm h-100">
                                    {/* Company Header */}
                                    <div className="d-flex align-items-center mb-3">
                                        <div
                                            className="me-3 d-flex align-items-center justify-content-center rounded-3"
                                            style={{
                                                width: '60px',
                                                height: '60px',
                                                backgroundColor: company.color,
                                                fontSize: '1.8rem'
                                            }}
                                        >
                                            <span style={{ filter: 'grayscale(100%) brightness(0) invert(1)' }}>
                                                {company.logo}
                                            </span>
                                        </div>
                                        <div className="flex-grow-1">
                                            <h5 className="fw-bold mb-1">{company.name}</h5>
                                            <div className="d-flex align-items-center gap-2">
                                                <div className="d-flex">
                                                    {renderStars(Math.floor(company.overallRating))}
                                                </div>
                                                <span className="fw-medium">{company.overallRating}</span>
                                                <span className="text-muted">({company.totalReviews} đánh giá)</span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Company Info */}
                                    <div className="mb-3">
                                        <div className="d-flex align-items-center mb-2">
                                            <span className="me-2" style={{ color: '#ff6b35' }}>💰</span>
                                            <span className="fw-medium">{company.averageHourlyRate}/giờ</span>
                                        </div>
                                        <div className="d-flex flex-wrap gap-2">
                                            {company.categories.map((category, index) => (
                                                <span
                                                    key={index}
                                                    className="badge px-3 py-2"
                                                    style={{
                                                        backgroundColor: '#e3f2fd',
                                                        color: '#1976d2',
                                                        borderRadius: '20px',
                                                        fontSize: '12px'
                                                    }}
                                                >
                                                    {category}
                                                </span>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Recent Reviews */}
                                    <div>
                                        <h6 className="fw-bold mb-3">Đánh giá gần đây</h6>
                                        {company.reviews.slice(0, 2).map((review) => (
                                            <div key={review.id} className="border-start border-3 border-primary ps-3 mb-3">
                                                <div className="d-flex justify-content-between align-items-start mb-2">
                                                    <div>
                                                        <h6 className="fw-medium mb-1">{review.jobTitle}</h6>
                                                        <div className="d-flex align-items-center gap-2">
                                                            <div className="d-flex">
                                                                {renderStars(review.rating)}
                                                            </div>
                                                            <small className="text-muted">bởi {review.reviewer}</small>
                                                        </div>
                                                    </div>
                                                    <small className="text-muted">{review.date}</small>
                                                </div>
                                                <p className="text-muted small mb-2">{review.overallExperience}</p>
                                                {review.pros && (
                                                    <div className="mb-1">
                                                        <small className="fw-medium text-success">Pros: </small>
                                                        <small className="text-muted">{review.pros}</small>
                                                    </div>
                                                )}
                                                {review.cons && (
                                                    <div>
                                                        <small className="fw-medium text-danger">Cons: </small>
                                                        <small className="text-muted">{review.cons}</small>
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>

                                    <button className="btn btn-outline-primary w-100 mt-3">
                                        Xem tất cả đánh giá
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Review Form Modal */}
            {showReviewForm && <ReviewForm />}
        </div>
    );
};

export default CompanyReviews;
