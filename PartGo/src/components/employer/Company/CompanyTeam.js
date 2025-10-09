import React from 'react';

const CompanyTeam = ({ data, onSave, loading }) => {
    return (
        <div className="company-team">
            <div className="section-header">
                <h2>Đội ngũ nhân sự</h2>
                <p>Quản lý thông tin về đội ngũ và phòng ban</p>
            </div>

            <div className="coming-soon">
                <div className="coming-soon-icon">👥</div>
                <h3>Tính năng đang phát triển</h3>
                <p>Chức năng quản lý đội ngũ sẽ sớm được bổ sung</p>
                <ul className="feature-list">
                    <li>✨ Thêm thành viên đội ngũ</li>
                    <li>✨ Quản lý phòng ban</li>
                    <li>✨ Phân quyền truy cập</li>
                    <li>✨ Orgchart tương tác</li>
                </ul>
            </div>
        </div>
    );
};

export default CompanyTeam;
