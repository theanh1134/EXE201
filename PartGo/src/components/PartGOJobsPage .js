import React, { useState, useEffect } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
import { useAuth } from '../contexts/AuthContext';
import { fetchJobs } from '../services/jobsAPI';
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

    return (
        <>
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
                                Tìm <span style={{ textDecoration: 'underline', textDecorationColor: '#ff6b35' }}>công việc mơ ước</span> của bạn
                            </h1>
                            <p className="text-white mb-4 opacity-75">
                                Tìm kiếm cơ hội việc làm part time tại các công ty tại Hòa Lạc, Hà Nội
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
                                                placeholder="Chức danh hoặc từ khóa"
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
                                            Tìm kiếm
                                        </button>
                                    </div>
                                </div>
                                {/* Giữ thanh tìm kiếm đơn giản như cũ */}
                            </div>

                            <p className="text-white mt-3 opacity-75 small">
                                Phổ biến: Nhân viên bán hàng, Nhân viên phục vụ, Gia sư, Nhân viên văn phòng
                            </p>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="container py-5">
                        <div className="row">

                            {/* Sidebar Filters */}
                            <div className="col-lg-3">
                                <div className="bg-white p-4 rounded shadow-sm mb-4">

                                    {/* Khoảng cách */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0">Khoảng cách (km)</h6>
                                            <span className="text-muted small">≤ {distanceKm}</span>
                                        </div>
                                        <input type="range" className="form-range" min="1" max="20" value={distanceKm} onChange={(e) => setDistanceKm(parseInt(e.target.value))} />
                                    </div>

                                    {/* Kỹ năng yêu cầu */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-2">
                                            <h6 className="fw-bold mb-0">Kỹ năng yêu cầu</h6>
                                        </div>
                                        <input className="form-control" placeholder="Bán hàng, giao tiếp..." value={skillsQuery} onChange={(e) => setSkillsQuery(e.target.value)} />
                                    </div>

                                    {/* Type of Employment */}
                                    <div className="mb-4">
                                        <div className="d-flex justify-content-between align-items-center mb-3">
                                            <h6 className="fw-bold mb-0">Loại hình việc làm</h6>
                                            <span>⌄</span>
                                        </div>
                                        {filterOptions.employmentType.map((option, index) => (
                                            <div key={index} className="form-check mb-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id={`employment-${index}`}
                                                    checked={typeSelected.includes(option.name)}
                                                    onChange={(e) => {
                                                        const checked = e.target.checked;
                                                        setTypeSelected(prev => checked ? [...new Set([...prev, option.name])] : prev.filter(v => v !== option.name));
                                                    }}
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

                                {/* Header */}
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <div>
                                        <h2 className="fw-bold mb-1">Tất cả việc làm</h2>
                                        <p className="text-muted mb-0">Hiển thị {totalJobs} kết quả</p>
                                    </div>
                                    <div className="d-flex align-items-center">
                                        <span className="me-2 text-muted">Sắp xếp theo:</span>
                                        <select
                                            className="form-select border-0 bg-transparent"
                                            value={sortBy}
                                            onChange={(e) => setSortBy(e.target.value)}
                                            style={{ width: 'auto' }}
                                        >
                                            <option>Phù hợp nhất</option>
                                            <option>Mới nhất</option>
                                            <option>Cũ nhất</option>
                                        </select>
                                        <div className="ms-3">
                                            <button className="btn btn-sm btn-outline-secondary me-2">☰</button>
                                            <button className="btn btn-sm" style={{ backgroundColor: '#ff6b35', color: 'white' }}>⊞</button>
                                        </div>
                                    </div>
                                </div>

                                {/* Job Cards */}
                                <div className="row">
                                    {loadingJobs && (
                                        <div className="col-12 text-center text-muted mb-3">Đang tải việc làm...</div>
                                    )}
                                    {!loadingJobs && jobsError && (
                                        <div className="col-12"><div className="alert alert-danger">{jobsError}</div></div>
                                    )}
                                    {!loadingJobs && !jobsError && filteredJobs.length === 0 && (
                                        <div className="col-12 text-center text-muted mb-3">Chưa có việc làm phù hợp</div>
                                    )}
                                    {!loadingJobs && !jobsError && filteredJobs.map((job) => (
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
                                                    <div className="d-flex flex-wrap gap-2 mb-3">
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

                                                    {/* Job Details */}
                                                    <div className="mb-3">
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="me-2" style={{ color: '#ff6b35', fontSize: '14px' }}>💰</span>
                                                            <span className="fw-medium" style={{ color: '#2c3e50', fontSize: '14px' }}>
                                                                {job.hourlyRate}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="me-2" style={{ color: '#ff6b35', fontSize: '14px' }}>⏰</span>
                                                            <span className="text-muted" style={{ fontSize: '14px' }}>
                                                                {job.workSchedule}
                                                            </span>
                                                        </div>
                                                        <div className="d-flex align-items-center mb-2">
                                                            <span className="me-2" style={{ color: '#ff6b35', fontSize: '14px' }}>📍</span>
                                                            <span className="text-muted" style={{ fontSize: '14px' }}>
                                                                Cách bạn ~ {job._distanceDisplay || job.distanceKm} km
                                                            </span>
                                                        </div>
                                                        <div className="d-flex align-items-center">
                                                            <span className="me-2" style={{ color: '#ff6b35', fontSize: '14px' }}>📅</span>
                                                            <span className="text-muted" style={{ fontSize: '14px' }}>
                                                                Đăng {job.postedDate}
                                                            </span>
                                                        </div>
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
                                                                <span className="fw-medium">{job.applied}</span> đã ứng tuyển / <span className="fw-medium">{job.capacity}</span> vị trí
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
                                                            title="Ứng tuyển"
                                                            aria-label="Ứng tuyển"
                                                        >
                                                            <span style={{ fontSize: '18px' }}>📩</span>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-warning ms-2"
                                                            onClick={(e) => { e.stopPropagation(); saveJob(job); }}
                                                            title="Lưu việc làm"
                                                            aria-label="Lưu việc làm"
                                                        >
                                                            <span style={{ fontSize: '18px' }}>🔖</span>
                                                        </button>
                                                        <button
                                                            className="btn btn-outline-secondary ms-2"
                                                            onClick={(e) => { e.stopPropagation(); openMapForJob(job); }}
                                                            title="Xem bản đồ"
                                                            aria-label="Xem bản đồ"
                                                        >
                                                            <span style={{ fontSize: '18px' }}>🗺️</span>
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
        </>
    );
};

export default PartGOJobsPage;