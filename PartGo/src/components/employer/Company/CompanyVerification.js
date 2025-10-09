import React from 'react';

const CompanyVerification = ({ data, onSave, loading }) => {
    return (
        <div className="company-verification">
            <div className="section-header">
                <h2>Xác thực công ty</h2>
                <p>Xác thực để tăng độ tin cậy với ứng viên</p>
            </div>

            <div className="verification-status">
                <div className="status-card">
                    <div className="status-icon">
                        {data.isVerified ? '✅' : '⏳'}
                    </div>
                    <div className="status-content">
                        <h3>
                            {data.isVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                        </h3>
                        <p>
                            {data.isVerified 
                                ? 'Công ty của bạn đã được xác thực thành công'
                                : 'Gửi tài liệu để xác thực công ty'
                            }
                        </p>
                    </div>
                </div>
            </div>

            <div className="coming-soon">
                <div className="coming-soon-icon">📋</div>
                <h3>Tính năng đang phát triển</h3>
                <p>Hệ thống xác thực sẽ sớm được bổ sung</p>
                <ul className="feature-list">
                    <li>✨ Upload giấy phép kinh doanh</li>
                    <li>✨ Xác thực thông tin pháp lý</li>
                    <li>✨ Badge xác thực</li>
                    <li>✨ Quy trình duyệt tự động</li>
                </ul>
            </div>
        </div>
    );
};

export default CompanyVerification;
