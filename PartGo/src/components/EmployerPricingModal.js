import React from 'react';

export default function EmployerPricingModal({ isOpen, onClose }) {
    if (!isOpen) return null;
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog">
                <div className="modal-content" style={{ borderRadius: '12px' }}>
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Bảng giá nhà tuyển dụng</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <ul className="list-group">
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Gói Cơ bản (1 tin/30 ngày)
                                <span className="badge bg-primary rounded-pill">0đ</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Gói Nổi bật (3 tin/30 ngày)
                                <span className="badge bg-primary rounded-pill">199.000đ</span>
                            </li>
                            <li className="list-group-item d-flex justify-content-between align-items-center">
                                Gói Doanh nghiệp (10 tin/60 ngày)
                                <span className="badge bg-primary rounded-pill">599.000đ</span>
                            </li>
                        </ul>
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-outline-secondary" onClick={onClose}>Đóng</button>
                    </div>
                </div>
            </div>
        </div>
    );
}










