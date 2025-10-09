import React, { useState, useEffect } from 'react';
import './CompanyBasicInfo.css';

const CompanyBasicInfo = ({ data, onSave, loading }) => {
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        website: '',
        industry: '',
        size: '',
        founded: '',
        location: {
            address: '',
            city: '',
            country: 'Vietnam'
        },
        contact: {
            phone: '',
            email: '',
            socialMedia: {
                linkedin: '',
                facebook: '',
                twitter: ''
            }
        }
    });

    const [errors, setErrors] = useState({});

    const industries = [
        'Công nghệ thông tin',
        'Tài chính - Ngân hàng',
        'Y tế - Dược phẩm',
        'Giáo dục - Đào tạo',
        'Bán lẻ - Thương mại',
        'Sản xuất - Chế tạo',
        'Xây dựng - Bất động sản',
        'Du lịch - Khách sạn',
        'Truyền thông - Quảng cáo',
        'Logistics - Vận tải',
        'Năng lượng - Môi trường',
        'Khác'
    ];

    const companySizes = [
        '1-10',
        '11-50',
        '51-100',
        '101-500',
        '501-1000',
        '1000+'
    ];

    const cities = [
        'Hà Nội',
        'Hồ Chí Minh',
        'Đà Nẵng',
        'Hải Phòng',
        'Cần Thơ',
        'Biên Hòa',
        'Nha Trang',
        'Huế',
        'Vũng Tàu',
        'Khác'
    ];

    useEffect(() => {
        if (data) {
            setFormData({
                name: data.name || '',
                description: data.description || '',
                website: data.website || '',
                industry: data.industry || '',
                size: data.size || '',
                founded: data.founded || '',
                location: {
                    address: data.location?.address || '',
                    city: data.location?.city || '',
                    country: data.location?.country || 'Vietnam'
                },
                contact: {
                    phone: data.contact?.phone || '',
                    email: data.contact?.email || '',
                    socialMedia: {
                        linkedin: data.contact?.socialMedia?.linkedin || '',
                        facebook: data.contact?.socialMedia?.facebook || '',
                        twitter: data.contact?.socialMedia?.twitter || ''
                    }
                }
            });
        }
    }, [data]);

    const handleInputChange = (field, value) => {
        const keys = field.split('.');
        if (keys.length === 1) {
            setFormData(prev => ({
                ...prev,
                [field]: value
            }));
        } else if (keys.length === 2) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: value
                }
            }));
        } else if (keys.length === 3) {
            setFormData(prev => ({
                ...prev,
                [keys[0]]: {
                    ...prev[keys[0]],
                    [keys[1]]: {
                        ...prev[keys[0]][keys[1]],
                        [keys[2]]: value
                    }
                }
            }));
        }

        // Clear error when user starts typing
        if (errors[field]) {
            setErrors(prev => ({
                ...prev,
                [field]: ''
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Tên công ty là bắt buộc';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Mô tả công ty là bắt buộc';
        } else if (formData.description.length < 50) {
            newErrors.description = 'Mô tả phải có ít nhất 50 ký tự';
        }

        if (formData.website && !isValidUrl(formData.website)) {
            newErrors.website = 'Website không hợp lệ';
        }

        if (!formData.industry) {
            newErrors.industry = 'Vui lòng chọn lĩnh vực hoạt động';
        }

        if (!formData.size) {
            newErrors.size = 'Vui lòng chọn quy mô công ty';
        }

        if (!formData.location.city) {
            newErrors['location.city'] = 'Vui lòng chọn thành phố';
        }

        if (formData.contact.phone && !isValidPhone(formData.contact.phone)) {
            newErrors['contact.phone'] = 'Số điện thoại không hợp lệ';
        }

        if (formData.contact.email && !isValidEmail(formData.contact.email)) {
            newErrors['contact.email'] = 'Email không hợp lệ';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const isValidUrl = (url) => {
        try {
            new URL(url);
            return true;
        } catch {
            return false;
        }
    };

    const isValidEmail = (email) => {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    };

    const isValidPhone = (phone) => {
        return /^[0-9+\-\s()]{10,15}$/.test(phone);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (validateForm()) {
            onSave(formData);
        }
    };

    return (
        <div className="company-basic-info">
            <div className="section-header">
                <h2>Thông tin cơ bản</h2>
                <p>Cập nhật thông tin cơ bản về công ty của bạn</p>
            </div>

            <form onSubmit={handleSubmit} className="basic-info-form">
                {/* Company Name & Description */}
                <div className="form-section">
                    <h3>Thông tin chung</h3>
                    
                    <div className="form-group">
                        <label>Tên công ty *</label>
                        <input
                            type="text"
                            value={formData.name}
                            onChange={(e) => handleInputChange('name', e.target.value)}
                            placeholder="Nhập tên công ty"
                            className={errors.name ? 'error' : ''}
                        />
                        {errors.name && <span className="error-text">{errors.name}</span>}
                    </div>

                    <div className="form-group">
                        <label>Mô tả công ty *</label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleInputChange('description', e.target.value)}
                            placeholder="Mô tả về công ty, văn hóa, sứ mệnh..."
                            rows={6}
                            className={errors.description ? 'error' : ''}
                        />
                        <div className="char-count">
                            {formData.description.length}/1000 ký tự
                        </div>
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label>Website</label>
                        <input
                            type="url"
                            value={formData.website}
                            onChange={(e) => handleInputChange('website', e.target.value)}
                            placeholder="https://example.com"
                            className={errors.website ? 'error' : ''}
                        />
                        {errors.website && <span className="error-text">{errors.website}</span>}
                    </div>
                </div>

                {/* Industry & Size */}
                <div className="form-section">
                    <h3>Thông tin doanh nghiệp</h3>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Lĩnh vực hoạt động *</label>
                            <select
                                value={formData.industry}
                                onChange={(e) => handleInputChange('industry', e.target.value)}
                                className={errors.industry ? 'error' : ''}
                            >
                                <option value="">Chọn lĩnh vực</option>
                                {industries.map(industry => (
                                    <option key={industry} value={industry}>
                                        {industry}
                                    </option>
                                ))}
                            </select>
                            {errors.industry && <span className="error-text">{errors.industry}</span>}
                        </div>

                        <div className="form-group">
                            <label>Quy mô công ty *</label>
                            <select
                                value={formData.size}
                                onChange={(e) => handleInputChange('size', e.target.value)}
                                className={errors.size ? 'error' : ''}
                            >
                                <option value="">Chọn quy mô</option>
                                {companySizes.map(size => (
                                    <option key={size} value={size}>
                                        {size} nhân viên
                                    </option>
                                ))}
                            </select>
                            {errors.size && <span className="error-text">{errors.size}</span>}
                        </div>

                        <div className="form-group">
                            <label>Năm thành lập</label>
                            <input
                                type="number"
                                value={formData.founded}
                                onChange={(e) => handleInputChange('founded', e.target.value)}
                                placeholder="2020"
                                min="1900"
                                max={new Date().getFullYear()}
                            />
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div className="form-section">
                    <h3>Địa chỉ</h3>
                    
                    <div className="form-group">
                        <label>Thành phố *</label>
                        <select
                            value={formData.location.city}
                            onChange={(e) => handleInputChange('location.city', e.target.value)}
                            className={errors['location.city'] ? 'error' : ''}
                        >
                            <option value="">Chọn thành phố</option>
                            {cities.map(city => (
                                <option key={city} value={city}>
                                    {city}
                                </option>
                            ))}
                        </select>
                        {errors['location.city'] && <span className="error-text">{errors['location.city']}</span>}
                    </div>

                    <div className="form-group">
                        <label>Địa chỉ chi tiết</label>
                        <input
                            type="text"
                            value={formData.location.address}
                            onChange={(e) => handleInputChange('location.address', e.target.value)}
                            placeholder="Số nhà, tên đường, quận/huyện"
                        />
                    </div>
                </div>

                {/* Contact */}
                <div className="form-section">
                    <h3>Thông tin liên hệ</h3>
                    
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input
                                type="tel"
                                value={formData.contact.phone}
                                onChange={(e) => handleInputChange('contact.phone', e.target.value)}
                                placeholder="0123456789"
                                className={errors['contact.phone'] ? 'error' : ''}
                            />
                            {errors['contact.phone'] && <span className="error-text">{errors['contact.phone']}</span>}
                        </div>

                        <div className="form-group">
                            <label>Email liên hệ</label>
                            <input
                                type="email"
                                value={formData.contact.email}
                                onChange={(e) => handleInputChange('contact.email', e.target.value)}
                                placeholder="contact@company.com"
                                className={errors['contact.email'] ? 'error' : ''}
                            />
                            {errors['contact.email'] && <span className="error-text">{errors['contact.email']}</span>}
                        </div>
                    </div>

                    <div className="form-grid">
                        <div className="form-group">
                            <label>LinkedIn</label>
                            <input
                                type="url"
                                value={formData.contact.socialMedia.linkedin}
                                onChange={(e) => handleInputChange('contact.socialMedia.linkedin', e.target.value)}
                                placeholder="https://linkedin.com/company/..."
                            />
                        </div>

                        <div className="form-group">
                            <label>Facebook</label>
                            <input
                                type="url"
                                value={formData.contact.socialMedia.facebook}
                                onChange={(e) => handleInputChange('contact.socialMedia.facebook', e.target.value)}
                                placeholder="https://facebook.com/..."
                            />
                        </div>
                    </div>
                </div>

                {/* Submit */}
                <div className="form-actions">
                    <button 
                        type="submit" 
                        className="save-btn"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <span className="loading-spinner small"></span>
                                Đang lưu...
                            </>
                        ) : (
                            '💾 Lưu thông tin'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyBasicInfo;
