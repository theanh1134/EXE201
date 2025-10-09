import React, { useState, useEffect } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
import { useAuth } from '../contexts/AuthContext';
import { fetchJobs } from '../services/jobsAPI';
import './PartGOJobsPage.css';
const PartGOJobsPage = ({ onBackToHome, onSelectJob, onShowLogin, onShowSignUp }) => {
    const { logout } = useAuth();
    const [searchKeyword, setSearchKeyword] = useState('');
    const [location, setLocation] = useState('Hòa Lạc, Hà Nội');
    const [sortBy, setSortBy] = useState('Phù hợp nhất');
    const [selectedFilters, setSelectedFilters] = useState({
        employmentType: [],
        categories: [],
        jobLevel: [],
        salaryRange: []
    });

    // Advanced search states
    const [distanceKm, setDistanceKm] = useState(50); // Khoảng cách từ trường/ký túc xá (tăng cho part-time)
    const [scheduleSelected, setScheduleSelected] = useState([]); // Lịch làm việc phù hợp lịch học
    const [salaryMin, setSalaryMin] = useState(20000);
    const [salaryMax, setSalaryMax] = useState(100000);
    const [typeSelected, setTypeSelected] = useState([]);
    const [skillsQuery, setSkillsQuery] = useState('');
    const [userCoords, setUserCoords] = useState(null);
    const [geoError, setGeoError] = useState('');

    useEffect(() => {
        // Thử lấy vị trí người dùng khi vào trang
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                (pos) => {
                    setUserCoords({ lat: pos.coords.latitude, lng: pos.coords.longitude });
                },
                (err) => {
                    setGeoError('Không thể lấy vị trí: ' + err.message);
                },
                { enableHighAccuracy: true, timeout: 8000 }
            );
        } else {
            setGeoError('Trình duyệt không hỗ trợ định vị.');
        }
    }, []);

    const [apiJobs, setApiJobs] = useState([]);
    const [loadingJobs, setLoadingJobs] = useState(true);
    const [jobsError, setJobsError] = useState('');
    const [totalJobs, setTotalJobs] = useState(0);

    useEffect(() => {
        (async () => {
            try {
                setLoadingJobs(true);
                setJobsError('');
                const data = await fetchJobs({ page: 1, limit: 50 });
                const raw = Array.isArray(data?.jobs) ? data.jobs : [];
                setTotalJobs(parseInt(data?.total || raw.length || 0));
                // Hàm tạo tên địa điểm hiển thị thân thiện
                const getDisplayLocation = (locationData) => {
                    if (!locationData) return 'Hòa Lạc, Hà Nội';

                    // Nếu có city, ưu tiên hiển thị city
                    if (locationData.city) {
                        return locationData.city;
                    }

                    // Nếu address ngắn (< 20 ký tự), hiển thị address
                    if (locationData.address && locationData.address.length < 20) {
                        return locationData.address;
                    }

                    // Nếu address dài, cố gắng rút gọn
                    if (locationData.address) {
                        const address = locationData.address;

                        // Tìm tên khu vực chính
                        const patterns = [
                            /hòa lạc/i,
                            /hoa lac/i,
                            /thạch thất/i,
                            /thach that/i,
                            /tân xã/i,
                            /tan xa/i,
                            /cầu giấy/i,
                            /cau giay/i,
                            /đống đa/i,
                            /dong da/i,
                            /hoàn kiếm/i,
                            /hoan kiem/i,
                            /thanh xuân/i,
                            /thanh xuan/i,
                            /quận \d+/i,
                            /quan \d+/i
                        ];

                        for (const pattern of patterns) {
                            const match = address.match(pattern);
                            if (match) {
                                return match[0];
                            }
                        }

                        // Nếu không tìm thấy pattern, lấy phần đầu của address
                        const parts = address.split(',');
                        if (parts.length > 1) {
                            return parts[0].trim();
                        }

                        return address;
                    }

                    return 'Hòa Lạc, Hà Nội';
                };

                const mapped = raw.map((j) => ({
                    id: j._id || j.id,
                    title: j.title || 'Công việc',
                    company: j.company?.name || j.companyName || 'Công ty',
                    location: getDisplayLocation(j.location),
                    fullAddress: j.location?.address, // Lưu địa chỉ đầy đủ
                    type: (j.type || j.employmentType || '').toString(),
                    tags: Array.isArray(j.tags) ? j.tags : [],
                    applied: j.applied || 0,
                    capacity: j.capacity || 10,
                    logo: '💼',
                    color: '#1f2937',
                    hourlyRate: j.salary ? `${j.salary.min?.toLocaleString()}-${j.salary.max?.toLocaleString()} VNĐ/giờ` : 'Thỏa thuận',
                    workSchedule: j.schedule?.workHours ? `${j.schedule.workHours.start}-${j.schedule.workHours.end}` : (j.schedule || 'Linh hoạt'),
                    postedDate: j.createdAt ? new Date(j.createdAt).toLocaleDateString('vi-VN') : '',
                    lat: j.location?.coordinates?.lat,
                    lng: j.location?.coordinates?.lng,
                }));
                setApiJobs(mapped);
            } catch (e) {
                setJobsError(e?.message || 'Không tải được danh sách việc làm');
            } finally {
                setLoadingJobs(false);
            }
        })();
    }, []);

    const jobs = apiJobs;

    const filterOptions = {
        employmentType: [
            { name: 'Part-time', count: 15, selected: true },
            { name: 'Full-time', count: 3 },
            { name: 'Remote', count: 8 },
            { name: 'Thực tập', count: 24 },
            { name: 'Hợp đồng', count: 3 },
            { name: 'Freelance', count: 12 }
        ],
        workSchedule: [
            { name: 'Ca sáng (6h-12h)', count: 8 },
            { name: 'Ca chiều (12h-18h)', count: 12 },
            { name: 'Ca tối (18h-22h)', count: 6 },
            { name: 'Ca đêm (22h-6h)', count: 3 },
            { name: 'Cuối tuần', count: 9 },
            { name: 'Linh hoạt', count: 15 }
        ],
        hourlyRate: [
            { name: '20,000-30,000 VNĐ/giờ', count: 8 },
            { name: '30,000-40,000 VNĐ/giờ', count: 12 },
            { name: '40,000-50,000 VNĐ/giờ', count: 6 },
            { name: '50,000-60,000 VNĐ/giờ', count: 4 },
            { name: '60,000+ VNĐ/giờ', count: 2 }
        ],
        categories: [
            { name: 'Bán hàng', count: 24 },
            { name: 'Phục vụ', count: 3 },
            { name: 'Marketing', count: 3 },
            { name: 'Văn phòng', count: 3, selected: true },
            { name: 'Giáo dục', count: 6 },
            { name: 'Công nghệ', count: 4 },
            { name: 'Dịch vụ', count: 4 },
            { name: 'Giao hàng', count: 5 }
        ],
        jobLevel: [
            { name: 'Mới tốt nghiệp', count: 57 },
            { name: 'Có kinh nghiệm', count: 3 },
            { name: 'Kinh nghiệm cao', count: 5 },
            { name: 'Quản lý', count: 12, selected: true },
            { name: 'Cấp cao', count: 8 }
        ],
        salaryRange: [
            { name: '2-3 triệu/tháng', count: 4 },
            { name: '3-4 triệu/tháng', count: 6 },
            { name: '4-5 triệu/tháng', count: 10 },
            { name: '5 triệu+/tháng', count: 4, selected: true }
        ]
    };

    // Helpers
    const parseSalary = (rateStr) => {
        // '25,000-35,000 VNĐ/giờ' => [25000, 35000]
        if (!rateStr || rateStr === 'Thỏa thuận') return [0, 999999];

        const match = rateStr.match(/([0-9.,]+)\s*-\s*([0-9.,]+)/);
        if (!match) return [0, 999999];

        const toNum = (s) => {
            const cleaned = s.replace(/\./g, '').replace(/,/g, '');
            return parseInt(cleaned) || 0;
        };

        return [toNum(match[1]), toNum(match[2])];
    };

    const skillsFromQuery = (q) => q.split(',').map(s => s.trim()).filter(Boolean);

    const saveJob = (job) => {
        try {
            const existing = JSON.parse(localStorage.getItem('savedJobs') || '[]');
            const minimal = {
                id: job.id,
                title: job.title,
                company: job.company,
                location: job.location,
                hourlyRate: job.hourlyRate,
                savedDate: new Date().toLocaleDateString('vi-VN')
            };
            const next = [minimal, ...existing.filter(j => j.id !== job.id)];
            localStorage.setItem('savedJobs', JSON.stringify(next));
            alert('Đã lưu việc làm vào danh sách');
        } catch (e) {
            alert('Không thể lưu việc làm');
        }
    };

    const openMapForJob = (job) => {
        console.log('🗺️ Opening map for job:', {
            jobId: job.id,
            title: job.title,
            lat: job.lat,
            lng: job.lng,
            userCoords,
            fullJob: job
        });

        if (job.lat && job.lng) {
            const dest = `${job.lat},${job.lng}`;
            if (userCoords) {
                const origin = `${userCoords.lat},${userCoords.lng}`;
                const url = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(dest)}&travelmode=driving`;
                console.log('🗺️ Opening directions:', url);
                window.open(url, '_blank');
            } else {
                const url = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dest)}`;
                console.log('🗺️ Opening location:', url);
                window.open(url, '_blank');
            }
        } else {
            console.error('❌ Không có tọa độ cho công việc này!', {
                jobId: job.id,
                title: job.title,
                lat: job.lat,
                lng: job.lng
            });
            alert('Không có thông tin vị trí cho công việc này. Vui lòng liên hệ nhà tuyển dụng để biết thêm chi tiết.');
        }
    };

    const haversineKm = (lat1, lon1, lat2, lon2) => {
        const toRad = (v) => (v * Math.PI) / 180;
        const R = 6371; // km
        const dLat = toRad(lat2 - lat1);
        const dLon = toRad(lon2 - lon1);
        const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c;
    };

    const filteredJobs = jobs.filter((job) => {
        // Keyword
        const keywordOk = !searchKeyword || (job.title + ' ' + job.company + ' ' + job.tags.join(' ')).toLowerCase().includes(searchKeyword.toLowerCase());

        // Distance - TẠM THỜI TẮT để hiển thị tất cả jobs
        // Sẽ chỉ lọc khi user chọn cụ thể "Gần tôi" hoặc nhập địa chỉ
        let distanceOk = true;

        // Chỉ tính distance để hiển thị, không lọc
        if (userCoords && job.lat && job.lng) {
            const d = haversineKm(userCoords.lat, userCoords.lng, job.lat, job.lng);
            job._distanceDisplay = d.toFixed(1);

            console.log(`📍 Distance info for "${job.title}":`, {
                jobLocation: job.location || 'N/A',
                jobCoords: { lat: job.lat, lng: job.lng },
                distance: d.toFixed(1) + 'km',
                note: 'Distance calculated but NOT filtering'
            });
        } else {
            job._distanceDisplay = undefined;
            console.log(`📍 No distance calc for "${job.title}":`, {
                hasUserCoords: !!userCoords,
                hasJobCoords: !!(job.lat && job.lng),
                jobLocation: job.location || 'N/A'
            });
        }

        // Schedule
        const scheduleOk = scheduleSelected.length === 0 || scheduleSelected.some(s => job.workSchedule.includes(s));

        // Type
        const typeOk = typeSelected.length === 0 || typeSelected.map(s => s.toLowerCase()).includes((job.type || '').toLowerCase());

        // Salary
        const [minR, maxR] = parseSalary(job.hourlyRate);
        const salaryOk = maxR >= salaryMin && minR <= salaryMax;

        // Skills
        const querySkills = skillsFromQuery(skillsQuery);
        const jobText = (job.title + ' ' + job.tags.join(' ')).toLowerCase();
        const skillsOk = querySkills.length === 0 || querySkills.every(s => jobText.includes(s.toLowerCase()));

        const result = keywordOk && distanceOk && scheduleOk && typeOk && salaryOk && skillsOk;

        // Debug logging
        if (!result) {
            console.log(`🔍 Job "${job.title}" filtered out:`, {
                keywordOk,
                distanceOk,
                scheduleOk,
                typeOk,
                salaryOk,
                skillsOk,
                job
            });
        }

        return result;
    });

    console.log('📊 Filter results:', {
        totalJobs: jobs.length,
        filteredJobs: filteredJobs.length,
        filters: {
            searchKeyword,
            distanceKm,
            scheduleSelected,
            typeSelected,
            salaryMin,
            salaryMax,
            skillsQuery
        }
    });

    // Enhanced Job Card Component
    const ModernJobCard = ({ job }) => {
        const [isSaved, setIsSaved] = useState(false);

        const getBadgeClass = (type) => {
            switch (type?.toLowerCase()) {
                case 'part-time': return 'badge-part-time';
                case 'full-time': return 'badge-full-time';
                case 'remote': return 'badge-remote';
                default: return 'badge-part-time';
            }
        };

        const getCompanyLogo = (company) => {
            // Generate consistent colors based on company name
            const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
            const colorIndex = company.charCodeAt(0) % colors.length;
            return {
                background: colors[colorIndex],
                text: company.charAt(0).toUpperCase()
            };
        };

        const logo = getCompanyLogo(job.company);

        return (
            <div className="job-card-enhanced" onClick={() => onSelectJob(job.id)}>
                {/* Company Logo */}
                <div className="job-logo-section">
                    <div className="company-logo" style={{ backgroundColor: logo.background }}>
                        {logo.text}
                    </div>
                    <div className="job-status-indicator"></div>
                </div>

                {/* Job Header */}
                <div className="job-header-enhanced">
                    <div className="job-title-section">
                        <h3 className="job-title-enhanced">{job.title}</h3>
                        <div className="job-company-enhanced">{job.company}</div>
                    </div>
                    <div className="job-badges-enhanced">
                        <span className={`job-badge-enhanced ${getBadgeClass(job.type)}`}>
                            {job.type}
                        </span>
                        {job.isUrgent && (
                            <span className="job-badge-enhanced badge-urgent-enhanced">🔥 Gấp</span>
                        )}
                    </div>
                </div>

                {/* Job Details Grid */}
                <div className="job-details-enhanced">
                    <div className="detail-item-enhanced">
                        <div className="detail-icon-enhanced">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </div>
                        <div className="detail-content">
                            <span className="detail-label">Địa điểm</span>
                            <span className="detail-value">{job.location}</span>
                        </div>
                    </div>

                    <div className="detail-item-enhanced">
                        <div className="detail-icon-enhanced">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <circle cx="12" cy="12" r="10"></circle>
                                <polyline points="12,6 12,12 16,14"></polyline>
                            </svg>
                        </div>
                        <div className="detail-content">
                            <span className="detail-label">Thời gian</span>
                            <span className="detail-value">{job.workSchedule}</span>
                        </div>
                    </div>

                    <div className="detail-item-enhanced">
                        <div className="detail-icon-enhanced">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <line x1="12" y1="1" x2="12" y2="23"></line>
                                <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                            </svg>
                        </div>
                        <div className="detail-content">
                            <span className="detail-label">Lương</span>
                            <span className="detail-value">{job.hourlyRate}</span>
                        </div>
                    </div>

                    <div className="detail-item-enhanced">
                        <div className="detail-icon-enhanced">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="9" cy="7" r="4"></circle>
                                <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
                                <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
                            </svg>
                        </div>
                        <div className="detail-content">
                            <span className="detail-label">Ứng viên</span>
                            <span className="detail-value">{job.applied}/{job.capacity}</span>
                        </div>
                    </div>
                </div>

                {/* Job Tags */}
                <div className="job-tags-enhanced">
                    {job.tags.slice(0, 3).map((tag, index) => (
                        <span key={index} className="job-tag-enhanced">{tag}</span>
                    ))}
                    {job.tags.length > 3 && (
                        <span className="job-tag-enhanced more-tags">+{job.tags.length - 3}</span>
                    )}
                </div>

                {/* Job Footer */}
                <div className="job-footer-enhanced">
                    <div className="job-meta-enhanced">
                        <span className="posted-date">📅 {job.postedDate}</span>
                        <span className="distance-info">📍 {job._distanceDisplay || 'N/A'} km</span>
                    </div>
                    <div className="job-actions-enhanced">
                        <button
                            className="btn-apply-enhanced"
                            onClick={(e) => {
                                e.stopPropagation();
                                onSelectJob(job.id);
                            }}
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                                <circle cx="8.5" cy="7" r="4"></circle>
                                <line x1="20" y1="8" x2="20" y2="14"></line>
                                <line x1="23" y1="11" x2="17" y2="11"></line>
                            </svg>
                            Ứng tuyển
                        </button>
                        <button
                            className={`btn-save-enhanced ${isSaved ? 'saved' : ''}`}
                            onClick={(e) => {
                                e.stopPropagation();
                                setIsSaved(!isSaved);
                                saveJob(job);
                            }}
                            title="Lưu việc làm"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"></path>
                            </svg>
                        </button>
                        <button
                            className="btn-map-enhanced"
                            onClick={(e) => {
                                e.stopPropagation();
                                openMapForJob(job);
                            }}
                            title="Xem bản đồ"
                        >
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                <circle cx="12" cy="10" r="3"></circle>
                            </svg>
                        </button>
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
                <Header
                    onOpenCv={() => window.location.href = '/profile/cv'}
                    onOpenCompanyDashboard={() => window.location.href = '/company-dashboard'}
                    onShowLogin={onShowLogin}
                    onShowSignUp={onShowSignUp}
                    onLogout={() => logout(() => window.location.href = '/')}
                />

                {/* Hero Section */}
                <div className="jobs-hero">
                    {/* Background Image Overlay */}
                    <div className="hero-background">
                        <div className="hero-overlay"></div>
                        <div className="hero-pattern"></div>
                    </div>

                    {/* Floating Elements */}
                    <div className="floating-elements">
                        <div className="floating-icon">💼</div>
                        <div className="floating-icon">🎯</div>
                        <div className="floating-icon">⭐</div>
                        <div className="floating-icon">🚀</div>
                    </div>

                    <div className="container text-center">
                        <div className="hero-content">
                            <div className="hero-badge">
                                <span className="badge-icon">✨</span>
                                <span>Hơn 1000+ công việc part-time</span>
                            </div>

                            <h1 className="hero-title">
                                Tìm <span className="gradient-text">công việc mơ ước</span> của bạn
                            </h1>

                            <p className="hero-subtitle">
                                Khám phá hàng nghìn cơ hội việc làm part-time tại các công ty hàng đầu Hòa Lạc, Hà Nội
                            </p>

                            {/* Enhanced Search Form */}
                            <div className="search-container-modern">
                                <div className="search-card">
                                    <div className="search-row">
                                        <div className="search-field">
                                            <div className="search-icon-modern">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <circle cx="11" cy="11" r="8"></circle>
                                                    <path d="m21 21-4.35-4.35"></path>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="search-input-modern"
                                                placeholder="Chức danh hoặc từ khóa"
                                                value={searchKeyword}
                                                onChange={(e) => setSearchKeyword(e.target.value)}
                                            />
                                        </div>

                                        <div className="search-field">
                                            <div className="search-icon-modern">
                                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                                                    <circle cx="12" cy="10" r="3"></circle>
                                                </svg>
                                            </div>
                                            <input
                                                type="text"
                                                className="search-input-modern"
                                                placeholder="Địa điểm"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                            />
                                        </div>

                                        <button className="search-btn-modern">
                                            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                <circle cx="11" cy="11" r="8"></circle>
                                                <path d="m21 21-4.35-4.35"></path>
                                            </svg>
                                            <span>Tìm kiếm</span>
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="popular-searches-modern">
                                <span className="popular-label">Tìm kiếm phổ biến:</span>
                                <div className="popular-tags">
                                    <span className="popular-tag-modern">Nhân viên bán hàng</span>
                                    <span className="popular-tag-modern">Phục vụ</span>
                                    <span className="popular-tag-modern">Gia sư</span>
                                    <span className="popular-tag-modern">Văn phòng</span>
                                    <span className="popular-tag-modern">Marketing</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="jobs-main">
                    <div className="container">
                        <div className="row">

                            {/* Sidebar Filters */}
                            <div className="col-lg-3">
                                <div className="filters-sidebar">

                                    {/* Khoảng cách */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <h6 className="filter-title">Khoảng cách</h6>
                                            <button className="filter-toggle">⌄</button>
                                        </div>
                                        <div className="range-container">
                                            <div className="range-display">
                                                <span>1 km</span>
                                                <span className="range-value">≤ {distanceKm} km</span>
                                                <span>20 km</span>
                                            </div>
                                            <input
                                                type="range"
                                                className="custom-range"
                                                min="1"
                                                max="20"
                                                value={distanceKm}
                                                onChange={(e) => setDistanceKm(parseInt(e.target.value))}
                                            />
                                        </div>
                                    </div>

                                    {/* Kỹ năng yêu cầu */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <h6 className="filter-title">Kỹ năng yêu cầu</h6>
                                        </div>
                                        <input
                                            className="filter-input"
                                            placeholder="Bán hàng, giao tiếp, Excel..."
                                            value={skillsQuery}
                                            onChange={(e) => setSkillsQuery(e.target.value)}
                                        />
                                    </div>

                                    {/* Type of Employment */}
                                    <div className="filter-section">
                                        <div className="filter-header">
                                            <h6 className="filter-title">Loại hình việc làm</h6>
                                            <button className="filter-toggle">⌄</button>
                                        </div>
                                        {filterOptions.employmentType.map((option, index) => (
                                            <div key={index} className="filter-option">
                                                <div className="custom-checkbox">
                                                    <input
                                                        type="checkbox"
                                                        id={`employment-${index}`}
                                                        checked={typeSelected.includes(option.name)}
                                                        onChange={(e) => {
                                                            const checked = e.target.checked;
                                                            setTypeSelected(prev => checked ? [...new Set([...prev, option.name])] : prev.filter(v => v !== option.name));
                                                        }}
                                                    />
                                                    <label className="option-label" htmlFor={`employment-${index}`}>
                                                        {option.name}
                                                    </label>
                                                </div>
                                                <span className="option-count">{option.count}</span>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Categories */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold mb-0">Danh mục</h6>
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
                                            <h6 className="fw-bold mb-0">Cấp độ công việc</h6>
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

                                    {/* Work Schedule */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold mb-0">Lịch làm việc</h6>
                                            <span>⌄</span>
                                        </div>
                                        {filterOptions.workSchedule.map((option, index) => (
                                            <div key={index} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`schedule-${index}`}
                                                    style={{ accentColor: '#ff6b35' }}
                                                    checked={scheduleSelected.includes(option.name)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setScheduleSelected(prev => checked ? [...new Set([...prev, option.name])] : prev.filter(v => v !== option.name));
                                                    }}
                                                />
                                                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`schedule-${index}`}>
                                                    <span>{option.name}</span>
                                                    <span className="text-muted">({option.count})</span>
                                                </label>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Hourly Rate */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold mb-0">Mức lương theo giờ</h6>
                                            <span>⌄</span>
                                        </div>
                                        {filterOptions.hourlyRate.map((option, index) => (
                                            <div key={index} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`rate-${index}`}
                                                    style={{ accentColor: '#ff6b35' }}
                                                    onChange={(e) => {
                                                        const [min, max] = parseSalary(option.name);
                                                        if (e.target.checked) {
                                                            setSalaryMin(min);
                                                            setSalaryMax(max);
                                                        }
                                                    }}
                                                />
                                                <label className="form-check-label d-flex justify-content-between w-100" htmlFor={`rate-${index}`}>
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

                                {/* Results Header */}
                                <div className="results-header">
                                    <div className="results-info">
                                        <h2>Tất cả việc làm</h2>
                                        <p className="results-count">Hiển thị {filteredJobs.length} kết quả</p>
                                    </div>
                                    <div className="sort-controls">
                                        <span className="sort-label">Sắp xếp theo:</span>
                                        <select
                                            className="sort-select"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                        >
                                            <option>Phù hợp nhất</option>
                                            <option>Mới nhất</option>
                                            <option>Cũ nhất</option>
                                            <option>Lương cao nhất</option>
                                        </select>
                                        <div className="view-toggle">
                                            <button className="view-btn">☰</button>
                                            <button className="view-btn active">⊞</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Cards */}
                                <div className="jobs-grid">
                                    {loadingJobs && (
                                        <div className="loading-state">
                                            <div className="loading-spinner">
                                                <div className="spinner"></div>
                                            </div>
                                            <p>Đang tải việc làm...</p>
                                        </div>
                                    )}
                                    {!loadingJobs && jobsError && (
                                        <div className="error-state">
                                            <div className="error-icon">⚠️</div>
                                            <h3>Không thể tải danh sách việc làm</h3>
                                            <p>{jobsError}</p>
                                        </div>
                                    )}
                                    {!loadingJobs && !jobsError && filteredJobs.length === 0 && (
                                        <div className="empty-state">
                                            <div className="empty-icon">🔍</div>
                                            <h3>Không tìm thấy việc làm phù hợp</h3>
                                            <p>Hãy thử điều chỉnh bộ lọc hoặc từ khóa tìm kiếm</p>
                                            <button className="btn-reset-filters">
                                                🔄 Đặt lại bộ lọc
                                            </button>
                                        </div>
                                    )}
                                    {!loadingJobs && !jobsError && filteredJobs.map((job) => (
                                        <ModernJobCard key={job.id} job={job} />
                                    ))}
                                </div>


                                {/* Modern Pagination */}
                                <div className="pagination-modern">
                                    <nav>
                                        <ul className="pagination-list">
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Previous">‹</a>
                                            </li>
                                            <li className="pagination-item active">
                                                <a className="pagination-link" href="#" aria-label="Page 1">1</a>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Page 2">2</a>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Page 3">3</a>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Page 4">4</a>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Page 5">5</a>
                                            </li>
                                            <li className="pagination-item">
                                                <span className="pagination-ellipsis">...</span>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Page 33">33</a>
                                            </li>
                                            <li className="pagination-item">
                                                <a className="pagination-link" href="#" aria-label="Next">›</a>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>

                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PartGOJobsPage;