import React, { useState, useEffect } from 'react';
import Header from './Header';
import PartGOFooter from './PartGOFooter ';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { fetchJobById, applyToJob } from '../services/jobsAPI';
import api from '../services/authAPI';
import { useParams } from 'react-router-dom';
import './PartGOJobDetailPage.css';
const PartGOJobDetailPage = ({ jobId, onBackToJobs, onShowLogin, onShowSignUp }) => {
    const { id: routeId } = useParams();
    const { user, isAuthenticated, logout } = useAuth();
    const { success, error: showError, warning, info } = useNotification();
    const [showApplicationModal, setShowApplicationModal] = useState(false);
    const [userCoords, setUserCoords] = useState(null);
    const [geoError, setGeoError] = useState('');

    useEffect(() => {
        // Lấy vị trí hiện tại của người dùng (nếu cho phép)
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

    const [jobDetail, setJobDetail] = useState({
        id: jobId || 1,
        title: 'Nhân viên bán hàng',
        company: 'Siêu thị Hòa Lạc',
        location: 'Hòa Lạc, Hà Nội',
        type: 'Part-Time',
        logo: '🛒',
        color: '#ff6b35',
        posted: '2 ngày trước',
        applications: 15,
        // Toạ độ điểm đến (ví dụ gần Hòa Lạc)
        lat: 21.015,
        lng: 105.526,
        about: {
            employeeCount: '15 tháng 12, 2024',
            industry: '31 tháng 7, 2024',
            stage: 'Part-Time',
            salary: '25,000-35,000 VNĐ/giờ'
        },
        description: `Chúng tôi đang tìm kiếm nhân viên bán hàng part time để tham gia đội ngũ của chúng tôi. Bạn sẽ làm việc trực tiếp với khách hàng để hỗ trợ họ tìm kiếm sản phẩm phù hợp và đảm bảo trải nghiệm mua sắm tốt nhất. Vị trí này yêu cầu người có thể làm việc độc lập với sự giám sát tối thiểu vì chúng tôi là một công ty năng động và đánh giá cao những người có thể tiếp nhận hướng dẫn và thực hiện hiệu quả.`,
        responsibilities: [
            'Hỗ trợ khách hàng tìm kiếm sản phẩm phù hợp và tư vấn về các sản phẩm có sẵn',
            'Đảm bảo khu vực bán hàng luôn sạch sẽ, gọn gàng và sản phẩm được sắp xếp đúng vị trí',
            'Xử lý thanh toán và giao dịch với khách hàng một cách chính xác và thân thiện',
            'Theo dõi tồn kho và báo cáo tình hình bán hàng cho quản lý',
            'Tham gia các chương trình đào tạo và cập nhật kiến thức về sản phẩm mới'
        ],
        whoYouAre: [
            'Bạn có năng lượng tích cực và thích tương tác với mọi người',
            'Bạn có kỹ năng giao tiếp tốt và khả năng thuyết phục khách hàng',
            'Bạn có tinh thần trách nhiệm cao và có thể làm việc theo ca linh hoạt',
            'Bạn có khả năng làm việc nhóm và hỗ trợ đồng nghiệp',
            'Bạn là người đáng tin cậy và có tinh thần giải quyết vấn đề sáng tạo'
        ],
        niceToHaves: [
            'Kinh nghiệm bán hàng trước đây',
            'Kỹ năng sử dụng máy tính cơ bản',
            'Khả năng giao tiếp tiếng Anh',
            'Hiểu biết về các sản phẩm tiêu dùng'
        ],
        benefits: [
            { title: 'Bảo hiểm y tế', desc: 'Chúng tôi tin tưởng vào việc chăm sóc sức khỏe cho tất cả nhân viên', icon: '🏥' },
            { title: 'Lịch làm việc linh hoạt', desc: 'Bạn có thể chọn ca làm việc phù hợp với lịch trình cá nhân', icon: '🏖️' },
            { title: 'Phát triển kỹ năng', desc: 'Chúng tôi khuyến khích nhân viên tham gia các khóa đào tạo và hội thảo', icon: '📈' },
            { title: 'Hoạt động tập thể', desc: 'Hàng năm công ty tổ chức các hoạt động team building thú vị', icon: '🎯' },
            { title: 'Làm việc gần nhà', desc: 'Vị trí làm việc tại Hòa Lạc, thuận tiện cho việc di chuyển', icon: '💻' },
            { title: 'Hỗ trợ đi lại', desc: 'Chúng tôi đánh giá cao sự chăm chỉ của bạn và hỗ trợ chi phí đi lại', icon: '🚌' },
            { title: 'Đóng góp cộng đồng', desc: 'Chúng tôi tham gia các hoạt động từ thiện và đóng góp cho cộng đồng', icon: '❤️' },
            { title: 'Bữa ăn', desc: 'Chúng tôi cung cấp bữa trưa miễn phí cho nhân viên', icon: '🍕' }
        ],
        ratingAverage: 4.5,
        ratingCount: 32,
        reviews: [
            {
                reviewer: 'Nguyễn Văn A',
                rating: 5,
                date: '3 ngày trước',
                content: 'Môi trường làm việc thân thiện, ca linh hoạt, phù hợp cho sinh viên. Quản lý hỗ trợ nhiệt tình.'
            },
            {
                reviewer: 'Trần Thị B',
                rating: 4,
                date: '1 tuần trước',
                content: 'Khối lượng công việc ổn, giờ giấc rõ ràng. Có thể bận rộn vào cuối tuần nhưng bù lại lương theo giờ ổn.'
            },
            {
                reviewer: 'Lê Minh C',
                rating: 4,
                date: '2 tuần trước',
                content: 'Địa điểm thuận tiện tại Hòa Lạc, đồng nghiệp thân thiện. Nên tăng thêm phụ cấp gửi xe.'
            }
        ],
        similarJobs: [
            { title: 'Nhân viên phục vụ', company: 'Quán cà phê Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Phục vụ'], logo: '🍽️', color: '#00d4aa' },
            { title: 'Gia sư Toán', company: 'Trung tâm Gia sư Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Giáo dục'], logo: '📚', color: '#1db954' },
            { title: 'Nhân viên văn phòng', company: 'Công ty TNHH Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Part-Time', 'Văn phòng'], logo: '💼', color: '#0061ff' },
            { title: 'Nhân viên giao hàng', company: 'Shopee Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Part-Time'], logo: '🚚', color: '#bd081c' },
            { title: 'Nhân viên IT', company: 'Công ty Công nghệ Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Công nghệ'], logo: '💻', color: '#623ce4' },
            { title: 'Nhân viên marketing', company: 'Công ty Du lịch Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Marketing'], logo: '📢', color: '#1c1c1c' },
            { title: 'Nhân viên bảo vệ', company: 'Khu công nghiệp Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Bảo vệ'], logo: '🛡️', color: '#ff4500' },
            { title: 'Nhân viên dịch vụ', company: 'Công ty Dịch vụ Hòa Lạc', location: 'Hòa Lạc, Hà Nội', tags: ['Dịch vụ'], logo: '🔧', color: '#146ef5' }
        ]
    });

    const [loading, setLoading] = useState(true);
    const [errorText, setErrorText] = useState('');

    useEffect(() => {
        (async () => {
            try {
                setLoading(true);
                setErrorText('');
                const id = jobId || routeId;
                if (!id) return;
                const j = await fetchJobById(id);
                if (j && j._id) {
                    // Tạo tên địa điểm hiển thị thân thiện
                    const getDisplayLocation = (locationData, fallbackLocation = 'Hòa Lạc, Hà Nội') => {
                        if (!locationData) return fallbackLocation;

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

                            // Tìm tên khu vực chính (Hòa Lạc, Thạch Thất, etc.)
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

                        return fallbackLocation;
                    };

                    setJobDetail(prev => ({
                        ...prev,
                        id: j._id,
                        title: j.title || prev.title,
                        company: j.company?.name || j.companyName || prev.company,
                        location: getDisplayLocation(j.location, prev.location),
                        fullAddress: j.location?.address || prev.fullAddress || '', // Lưu địa chỉ đầy đủ
                        type: j.type || prev.type,
                        logo: '💼',
                        lat: j.location?.coordinates?.lat || prev.lat,
                        lng: j.location?.coordinates?.lng || prev.lng,
                        description: j.description || prev.description,
                        about: {
                            employeeCount: j.deadline ? new Date(j.deadline).toLocaleDateString('vi-VN') : prev.about.employeeCount,
                            industry: j.createdAt ? new Date(j.createdAt).toLocaleDateString('vi-VN') : prev.about.industry,
                            stage: j.type || prev.about.stage,
                            salary: j.salary ? `${j.salary.min?.toLocaleString()}-${j.salary.max?.toLocaleString()} VNĐ/giờ` : prev.about.salary
                        }
                    }));
                }
            } catch (e) {
                setErrorText(e?.message || 'Không tải được chi tiết công việc');
            }
            finally { setLoading(false); }
        })();
    }, [jobId]);

    const handleApplyClick = () => {
        if (!isAuthenticated) {
            warning('Vui lòng đăng nhập để ứng tuyển', 'Cần đăng nhập');
            if (onShowLogin) onShowLogin();
            return;
        }
        setShowApplicationModal(true);
    };

    const openMapForJob = () => {
        console.log('🗺️ Opening map for job:', {
            lat: jobDetail.lat,
            lng: jobDetail.lng,
            userCoords,
            fullJobDetail: jobDetail
        });

        if (jobDetail.lat && jobDetail.lng) {
            const dest = `${jobDetail.lat},${jobDetail.lng}`;
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
                lat: jobDetail.lat,
                lng: jobDetail.lng,
                location: jobDetail.location
            });
            alert('Không có thông tin vị trí cho công việc này. Vui lòng liên hệ nhà tuyển dụng để biết thêm chi tiết.');
        }
    };

    const ApplicationModal = () => {
        const { user } = useAuth();
        const [submitting, setSubmitting] = useState(false);
        const [submitError, setSubmitError] = useState('');
        const [cvFile, setCvFile] = useState(null);
        const [cvUploading, setCvUploading] = useState(false);
        const [cvUrl, setCvUrl] = useState('');
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

        const handleCvSelect = (e) => {
            const file = e.target.files && e.target.files[0];
            if (!file) return;
            const allowed = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
            if (!allowed.includes(file.type)) {
                warning('Chỉ chấp nhận PDF, DOC, DOCX', 'Định dạng file không hợp lệ');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                warning('File quá lớn (tối đa 10MB)', 'Kích thước file không hợp lệ');
                return;
            }
            setCvFile(file);
        };

        const uploadCv = async () => {
            if (!cvFile) return;
            try {
                setCvUploading(true);
                const form = new FormData();
                form.append('file', cvFile);
                const resp = await api.post('/upload', form, { headers: { 'Content-Type': 'multipart/form-data' } });
                const path = resp?.data?.path;
                if (path) {
                    setCvUrl(path);
                    success('Tải CV thành công', 'File đã được tải lên');
                } else {
                    showError('Tải CV thất bại', 'Lỗi tải file');
                }
            } catch (err) {
                showError('Lỗi tải CV: ' + (err?.message || 'Unknown'), 'Lỗi hệ thống');
            } finally {
                setCvUploading(false);
            }
        };

        const handleSubmit = async (e) => {
            e.preventDefault();
            if (!user) {
                warning('Vui lòng đăng nhập để ứng tuyển.', 'Cần đăng nhập');
                if (onShowLogin) onShowLogin();
                return;
            }
            try {
                setSubmitting(true);
                setSubmitError('');
                const isValidObjectId = typeof jobDetail.id === 'string' && /^[a-fA-F0-9]{24}$/.test(jobDetail.id);
                if (!isValidObjectId) {
                    setSubmitting(false);
                    setSubmitError('Công việc demo không thể ứng tuyển. Hãy chọn công việc từ danh sách tải từ hệ thống.');
                    warning('Công việc demo không thể ứng tuyển. Vui lòng quay lại trang Tìm việc và chọn một công việc thật (không phải dữ liệu mẫu).', 'Không thể ứng tuyển');
                    return;
                }
                await applyToJob({
                    jobId: jobDetail.id,
                    coverLetter: formData.additionalInfo || 'Ứng tuyển nhanh từ PartGO',
                    cvUrl: cvUrl || undefined
                });

                // Đóng modal trước
                setShowApplicationModal(false);
                setFormData({ additionalInfo: '' });
                setCvFile(null);
                setCvUrl('');

                // Hiện thông báo thành công sau khi đóng modal
                success('Ứng tuyển thành công!', 'Đơn ứng tuyển đã được gửi');
            } catch (err) {
                console.error('Apply job error:', err);
                console.error('Error response:', err?.response?.data);
                const msg = err?.response?.data?.message || err?.message || 'Lỗi không xác định';
                setSubmitError(String(msg));
                showError('Ứng tuyển thất bại: ' + String(msg), 'Lỗi ứng tuyển');
            } finally {
                setSubmitting(false);
            }
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
                                    <h5 className="modal-title fw-bold mb-0">Nhân viên bán hàng</h5>
                                    <small className="text-muted">Hòa Lạc, Hà Nội • Part-Time</small>
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
                            <h6 className="fw-bold mb-3">Gửi đơn ứng tuyển</h6>
                            <p className="text-muted small mb-4">Thông tin sau đây là bắt buộc và chỉ được chia sẻ với Siêu thị Hòa Lạc.</p>

                            <form onSubmit={handleSubmit}>
                                {/* Full Name */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Họ và tên</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="fullName"
                                        value={formData.fullName}
                                        onChange={handleInputChange}
                                        placeholder="Nhập họ và tên của bạn"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        required
                                    />
                                </div>

                                {/* Email */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Địa chỉ email</label>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        placeholder="Nhập địa chỉ email của bạn"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        required
                                    />
                                </div>

                                {/* Phone */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Số điện thoại</label>
                                    <input
                                        type="tel"
                                        className="form-control"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        placeholder="Nhập số điện thoại của bạn"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                    />
                                </div>

                                {/* Current Job Title */}
                                <div className="mb-3">
                                    <label className="form-label fw-medium">Chức danh công việc hiện tại hoặc trước đây</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        name="currentJobTitle"
                                        value={formData.currentJobTitle}
                                        onChange={handleInputChange}
                                        placeholder="Chức danh công việc hiện tại hoặc trước đây của bạn là gì?"
                                        style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                    />
                                </div>

                                {/* Links Section */}
                                <div className="mb-4">
                                    <h6 className="fw-bold mb-3">LIÊN KẾT</h6>

                                    {/* LinkedIn */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">URL LinkedIn</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="linkedinUrl"
                                            value={formData.linkedinUrl}
                                            onChange={handleInputChange}
                                            placeholder="Liên kết đến LinkedIn của bạn"
                                            style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        />
                                    </div>

                                    {/* Portfolio */}
                                    <div className="mb-3">
                                        <label className="form-label fw-medium">URL Portfolio</label>
                                        <input
                                            type="url"
                                            className="form-control"
                                            name="portfolioUrl"
                                            value={formData.portfolioUrl}
                                            onChange={handleInputChange}
                                            placeholder="Liên kết đến portfolio của bạn"
                                            style={{ borderRadius: '8px', border: '1px solid #e9ecef', padding: '12px' }}
                                        />
                                    </div>
                                </div>

                                {/* Additional Information */}
                                <div className="mb-4">
                                    <label className="form-label fw-medium">Thông tin bổ sung</label>
                                    <textarea
                                        className="form-control"
                                        name="additionalInfo"
                                        value={formData.additionalInfo}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Thêm thư xin việc hoặc bất kỳ thông tin nào khác bạn muốn chia sẻ."
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
                                    <label className="form-label fw-medium">Đính kèm CV của bạn</label>
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
                                            <span className="text-muted ms-2">{cvFile ? cvFile.name : 'Đính kèm CV/Resume'}</span>
                                        </div>
                                        <div className="mt-2 d-flex justify-content-center gap-2">
                                            <input type="file" accept=".pdf,.doc,.docx" id="apply-cv" style={{ display: 'none' }} onChange={handleCvSelect} />
                                            <button type="button" className="btn btn-sm btn-outline-secondary" onClick={() => document.getElementById('apply-cv').click()}>Chọn tệp</button>
                                            <button type="button" className="btn btn-sm btn-outline-primary" onClick={uploadCv} disabled={!cvFile || cvUploading}>{cvUploading ? 'Đang tải...' : 'Tải lên'}</button>
                                            {cvUrl && <a className="btn btn-sm btn-outline-success" href={cvUrl} target="_blank" rel="noreferrer">Xem CV</a>}
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
                                    disabled={submitting}
                                >
                                    {submitting ? 'Đang gửi...' : 'Gửi đơn ứng tuyển'}
                                </button>

                                {submitError && (
                                    <p className="text-danger small text-center mt-2">{submitError}</p>
                                )}

                                {/* Terms */}
                                <p className="text-muted small text-center mt-3 mb-0">
                                    Bằng cách gửi yêu cầu này, bạn xác nhận rằng chấp nhận{' '}
                                    <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                        Điều khoản dịch vụ
                                    </a>{' '}
                                    và{' '}
                                    <a href="#" className="text-decoration-none" style={{ color: '#ff6b35' }}>
                                        Chính sách bảo mật
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

            <div className="job-detail-container">

                {/* Header */}
                <Header
                    onOpenCv={() => window.location.href = '/profile/cv'}
                    onOpenCompanyDashboard={() => window.location.href = '/company-dashboard'}
                    onShowLogin={onShowLogin}
                    onShowSignUp={onShowSignUp}
                    onLogout={() => logout(() => window.location.href = '/jobs')}
                />
                {/* Main Content */}
                <div className="container" style={{ paddingTop: '100px', paddingBottom: '40px' }}>

                    {/* Breadcrumb */}
                    <nav aria-label="breadcrumb" className="mb-4">
                        <ol className="breadcrumb">
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={onBackToJobs}
                                    style={{ color: '#6c757d', border: 'none', background: 'none' }}
                                >
                                    Trang chủ
                                </button>
                            </li>
                            <li className="breadcrumb-item">
                                <button
                                    className="btn btn-link p-0 text-decoration-none"
                                    onClick={onBackToJobs}
                                    style={{ color: '#6c757d', border: 'none', background: 'none' }}
                                >
                                    Tìm việc làm
                                </button>
                            </li>
                            <li className="breadcrumb-item active" aria-current="page" style={{ color: '#ff6b35' }}>
                                Nhân viên bán hàng
                            </li>
                        </ol>
                    </nav>

                    <div className="row">

                        {/* Main Content */}
                        <div className="col-lg-8">

                            {/* Job Header */}
                            <div className="job-header-card">
                                <div className="d-flex justify-content-between align-items-start">
                                    <div className="d-flex">
                                        <div
                                            className="job-logo-circle"
                                            style={{
                                                backgroundColor: jobDetail.color
                                            }}
                                        >
                                            {jobDetail.logo}
                                        </div>
                                        <div>
                                            <h1 className="job-title-detail">
                                                {jobDetail.title}
                                            </h1>
                                            <p className="job-meta">
                                                {jobDetail.company} • {jobDetail.location} • {jobDetail.type}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="d-flex gap-2">
                                        <button
                                            className="btn-apply-primary"
                                            onClick={handleApplyClick}
                                        >
                                            ✓ Ứng tuyển
                                        </button>
                                        <button
                                            className="btn-secondary-action"
                                            onClick={openMapForJob}
                                            title={geoError ? geoError : 'Xem bản đồ từ vị trí hiện tại đến nơi làm việc'}
                                        >
                                            🗺️ Xem bản đồ
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Job Description */}
                            <div className="content-card">
                                <h3 className="section-heading">📝 Mô tả công việc</h3>
                                <p className="list-item-text">
                                    {jobDetail.description}
                                </p>
                            </div>

                            {/* Responsibilities */}
                            <div className="content-card">
                                <h3 className="section-heading">✓ Trách nhiệm</h3>
                                <div>
                                    {jobDetail.responsibilities.map((item, index) => (
                                        <div key={index} className="list-item-apple">
                                            <span className="list-item-icon">✓</span>
                                            <span className="list-item-text">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Who You Are */}
                            <div className="content-card">
                                <h3 className="section-heading">👤 Bạn là ai</h3>
                                <div>
                                    {jobDetail.whoYouAre.map((item, index) => (
                                        <div key={index} className="list-item-apple">
                                            <span className="list-item-icon">✓</span>
                                            <span className="list-item-text">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Nice-To-Haves */}
                            <div className="content-card">
                                <h3 className="section-heading">⭐ Ưu tiên có</h3>
                                <div>
                                    {jobDetail.niceToHaves.map((item, index) => (
                                        <div key={index} className="list-item-apple">
                                            <span className="list-item-icon">✓</span>
                                            <span className="list-item-text">{item}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Perks & Benefits */}
                            <div className="content-card">
                                <h3 className="section-heading">🎁 Phúc lợi & Lợi ích</h3>
                                <p className="list-item-text mb-4">Công việc này đi kèm với nhiều phúc lợi và lợi ích hấp dẫn</p>

                                <div className="benefits-grid">
                                    {jobDetail.benefits.map((benefit, index) => (
                                        <div key={index} className="benefit-card">
                                            <div className="benefit-icon">
                                                {benefit.icon}
                                            </div>
                                            <h6 className="benefit-title">{benefit.title}</h6>
                                            <p className="benefit-desc">
                                                {benefit.desc}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="content-card">
                                <div className="d-flex justify-content-between align-items-center mb-4">
                                    <h3 className="section-heading mb-0">⭐ Đánh giá về công việc này</h3>
                                    <div className="d-flex align-items-center">
                                        <span style={{ color: '#ff9500', fontSize: '18px', marginRight: '8px' }}>★</span>
                                        <span style={{ fontWeight: '700', color: '#1d1d1f', fontSize: '16px' }}>{jobDetail.ratingAverage.toFixed(1)}</span>
                                        <span style={{ color: '#86868b', marginLeft: '8px', fontSize: '14px' }}>({jobDetail.ratingCount} đánh giá)</span>
                                    </div>
                                </div>

                                <div>
                                    {jobDetail.reviews.slice(0, 3).map((review, index) => (
                                        <div key={index} className="review-item">
                                            <div className="d-flex justify-content-between align-items-start mb-2">
                                                <div>
                                                    <div className="reviewer-name">{review.reviewer}</div>
                                                    <div className="review-rating">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <span key={i} style={{ color: i < review.rating ? '#ff9500' : '#d5d5d7', marginRight: '2px' }}>★</span>
                                                        ))}
                                                    </div>
                                                </div>
                                                <span style={{ color: '#a1a1a6', fontSize: '12px' }}>{review.date}</span>
                                            </div>
                                            <p className="review-content">{review.content}</p>
                                        </div>
                                    ))}
                                </div>

                                <div className="text-end mt-4">
                                    <button className="btn-secondary-action" style={{ padding: '8px 16px', fontSize: '14px' }}>Xem tất cả đánh giá →</button>
                                </div>
                            </div>

                            {/* Company Info */}
                            <div className="content-card">
                                <div className="d-flex align-items-center mb-4">
                                    <div
                                        className="job-logo-circle"
                                        style={{
                                            width: '60px',
                                            height: '60px',
                                            marginRight: '16px',
                                            backgroundColor: jobDetail.color,
                                            fontSize: '1.8rem'
                                        }}
                                    >
                                        {jobDetail.logo}
                                    </div>
                                    <div className="flex-grow-1">
                                        <h5 style={{ fontWeight: '700', color: '#1d1d1f', marginBottom: '4px' }}>{jobDetail.company}</h5>
                                        <p style={{ color: '#86868b', fontSize: '13px', marginBottom: '0' }}>Về công ty này</p>
                                    </div>
                                </div>
                                <div>
                                    <p className="list-item-text">
                                        {jobDetail.company} là một công ty uy tín tại Hòa Lạc, Hà Nội. Chúng tôi cung cấp các sản phẩm chất lượng cao và dịch vụ khách hàng tốt nhất.
                                    </p>
                                </div>
                            </div>

                        </div>

                        {/* Sidebar */}
                        <div className="col-lg-4">

                            {/* About this role */}
                            <div className="sidebar-card">
                                <h5 className="sidebar-heading">ℹ️ Về vị trí này</h5>
                                <div>
                                    <div className="info-row">
                                        <span className="info-label">Ứng tuyển trước</span>
                                        <span className="info-value">{jobDetail.about.employeeCount}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Đăng tuyển ngày</span>
                                        <span className="info-value">{jobDetail.about.industry}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Loại công việc</span>
                                        <span className="info-value">{jobDetail.about.stage}</span>
                                    </div>
                                    <div className="info-row">
                                        <span className="info-label">Mức lương</span>
                                        <span className="info-value">{jobDetail.about.salary}</span>
                                    </div>
                                    {jobDetail.fullAddress && (
                                        <div className="info-row">
                                            <span className="info-label">Địa chỉ</span>
                                            <span className="info-value text-end" style={{ maxWidth: '60%', fontSize: '13px' }}>
                                                {jobDetail.fullAddress}
                                            </span>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Categories */}
                            <div className="sidebar-card">
                                <h5 className="sidebar-heading">📂 Danh mục</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge-apple badge-category">
                                        Marketing
                                    </span>
                                    <span className="badge-apple badge-category">
                                        Bán hàng
                                    </span>
                                </div>
                            </div>

                            {/* Required Skills */}
                            <div className="sidebar-card">
                                <h5 className="sidebar-heading">🎯 Kỹ năng yêu cầu</h5>
                                <div className="d-flex flex-wrap gap-2">
                                    <span className="badge-apple badge-skill">
                                        Bán hàng
                                    </span>
                                    <span className="badge-apple badge-skill">
                                        Giao tiếp
                                    </span>
                                    <span className="badge-apple badge-skill">
                                        Tư vấn khách hàng
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    {/* Similar Jobs */}
                    <div className="mt-5">
                        <div className="d-flex justify-content-between align-items-center mb-4">
                            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1d1d1f', marginBottom: '0' }}>
                                💼 Việc làm tương tự
                            </h3>
                            <button
                                className="btn btn-link text-decoration-none p-0"
                                onClick={onBackToJobs}
                                style={{ color: '#007aff', fontWeight: '600', fontSize: '15px' }}
                            >
                                Xem tất cả việc làm →
                            </button>
                        </div>

                        <div className="row">
                            {jobDetail.similarJobs.map((job, index) => (
                                <div key={index} className="col-lg-3 col-md-6 mb-4">
                                    <div className="content-card" style={{ height: '100%', cursor: 'pointer', transition: 'all 0.3s' }}>
                                        <div className="d-flex align-items-center mb-3">
                                            <div
                                                className="me-3 d-flex align-items-center justify-content-center rounded"
                                                style={{
                                                    width: '40px',
                                                    height: '40px',
                                                    backgroundColor: job.color,
                                                    fontSize: '1.2rem',
                                                    flexShrink: 0
                                                }}
                                            >
                                                {job.logo}
                                            </div>
                                            <div className="min-width-0">
                                                <h6 style={{ fontWeight: '600', marginBottom: '0', fontSize: '14px', color: '#1d1d1f', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>{job.title}</h6>
                                                <p style={{ color: '#86868b', marginBottom: '0', fontSize: '12px' }}>{job.company}</p>
                                            </div>
                                        </div>
                                        <p style={{ color: '#a1a1a6', fontSize: '12px', marginBottom: '12px' }}>📍 {job.location}</p>
                                        <div className="d-flex flex-wrap gap-1">
                                            {job.tags.map((tag, tagIndex) => (
                                                <span
                                                    key={tagIndex}
                                                    className="badge-apple badge-skill"
                                                    style={{ fontSize: '11px', padding: '4px 10px' }}
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