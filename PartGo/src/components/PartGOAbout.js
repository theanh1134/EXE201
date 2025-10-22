import React from 'react';

export default function PartGOAbout() {
    return (
        <div>
            <link
                href="https://cdnjs.cloudflare.com/ajax/libs/bootstrap/5.3.0/css/bootstrap.min.css"
                rel="stylesheet"
            />
            <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh' }}>
                <div className="container" style={{ paddingTop: '120px', paddingBottom: '60px' }}>
                    <div className="text-center mb-5">
                        <h1 className="fw-bold" style={{ color: '#2c3e50' }}>Giới thiệu về PartGO</h1>
                        <p className="text-muted">Nền tảng tìm việc part-time dành cho sinh viên tại Hòa Lạc</p>
                    </div>

                    <div className="row g-4 mb-4">
                        <div className="col-md-4">
                            <div className="bg-white rounded-3 p-4 shadow-sm h-100">
                                <div className="display-6 mb-3">🎯</div>
                                <h5 className="fw-bold">Sứ mệnh</h5>
                                <p className="text-muted mb-0">Kết nối sinh viên với cơ hội việc làm linh hoạt, gần khu vực Hòa Lạc, giúp phát triển kỹ năng và thu nhập.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-white rounded-3 p-4 shadow-sm h-100">
                                <div className="display-6 mb-3">🤝</div>
                                <h5 className="fw-bold">Giá trị</h5>
                                <p className="text-muted mb-0">Minh bạch, nhanh chóng, an toàn. Tập trung vào trải nghiệm ứng viên và nhà tuyển dụng.</p>
                            </div>
                        </div>
                        <div className="col-md-4">
                            <div className="bg-white rounded-3 p-4 shadow-sm h-100">
                                <div className="display-6 mb-3">🚀</div>
                                <h5 className="fw-bold">Tính năng</h5>
                                <ul className="text-muted mb-0">
                                    <li>Tìm việc theo khoảng cách và lịch học</li>
                                    <li>Tạo CV nhanh và lưu hồ sơ</li>
                                    <li>Ứng tuyển 1 chạm, theo dõi trạng thái</li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-4 rounded-3 shadow-sm mb-4">
                        <h4 className="fw-bold mb-3" style={{ color: '#2c3e50' }}>Vì sao chọn PartGO?</h4>
                        <div className="row g-3">
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <span className="me-3">📍</span>
                                    <div>
                                        <div className="fw-medium">Vị trí gần bạn</div>
                                        <div className="text-muted small">Bản đồ chỉ đường từ vị trí hiện tại đến nơi làm việc.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <span className="me-3">📝</span>
                                    <div>
                                        <div className="fw-medium">Tạo CV trong vài phút</div>
                                        <div className="text-muted small">Nhiều mẫu CV, tự động lấy thông tin từ hồ sơ.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <span className="me-3">🔔</span>
                                    <div>
                                        <div className="fw-medium">Theo dõi đơn ứng tuyển</div>
                                        <div className="text-muted small">Nhận cập nhật trạng thái và lời mời phỏng vấn.</div>
                                    </div>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <div className="d-flex align-items-start">
                                    <span className="me-3">🛡️</span>
                                    <div>
                                        <div className="fw-medium">Tin cậy & an toàn</div>
                                        <div className="text-muted small">Doanh nghiệp được xác minh và đánh giá cộng đồng.</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <button className="btn px-4 py-2" style={{ backgroundColor: '#ff6b35', color: 'white' }} onClick={() => window.location.href = '/jobs'}>
                            Khám phá việc làm
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}







