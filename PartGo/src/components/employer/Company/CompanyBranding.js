import React, { useState, useEffect } from 'react';
import './CompanyBranding.css';

const CompanyBranding = ({ data, onSave, loading }) => {
    const [formData, setFormData] = useState({
        logo: '',
        coverImage: '',
        brandColors: {
            primary: '#3b82f6',
            secondary: '#64748b'
        }
    });

    useEffect(() => {
        if (data) {
            setFormData({
                logo: data.logo || '',
                coverImage: data.coverImage || '',
                brandColors: {
                    primary: data.brandColors?.primary || '#3b82f6',
                    secondary: data.brandColors?.secondary || '#64748b'
                }
            });
        }
    }, [data]);

    const handleColorChange = (colorType, value) => {
        setFormData(prev => ({
            ...prev,
            brandColors: {
                ...prev.brandColors,
                [colorType]: value
            }
        }));
    };

    const handleFileUpload = (field, file) => {
        if (file) {
            // TODO: Implement file upload to server
            const reader = new FileReader();
            reader.onload = (e) => {
                setFormData(prev => ({
                    ...prev,
                    [field]: e.target.result
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
    };

    return (
        <div className="company-branding">
            <div className="section-header">
                <h2>Thương hiệu công ty</h2>
                <p>Tùy chỉnh hình ảnh và màu sắc thương hiệu</p>
            </div>

            <form onSubmit={handleSubmit} className="branding-form">
                {/* Logo */}
                <div className="form-section">
                    <h3>Logo công ty</h3>
                    <div className="logo-upload">
                        <div className="logo-preview">
                            {formData.logo ? (
                                <img src={formData.logo} alt="Logo" />
                            ) : (
                                <div className="logo-placeholder">
                                    <span>📷</span>
                                    <p>Chưa có logo</p>
                                </div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <input
                                type="file"
                                id="logo-upload"
                                accept="image/*"
                                onChange={(e) => handleFileUpload('logo', e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="logo-upload" className="upload-btn">
                                📁 Chọn logo
                            </label>
                            <p className="upload-hint">PNG, JPG tối đa 2MB</p>
                        </div>
                    </div>
                </div>

                {/* Cover Image */}
                <div className="form-section">
                    <h3>Ảnh bìa</h3>
                    <div className="cover-upload">
                        <div className="cover-preview">
                            {formData.coverImage ? (
                                <img src={formData.coverImage} alt="Cover" />
                            ) : (
                                <div className="cover-placeholder">
                                    <span>🖼️</span>
                                    <p>Chưa có ảnh bìa</p>
                                </div>
                            )}
                        </div>
                        <div className="upload-controls">
                            <input
                                type="file"
                                id="cover-upload"
                                accept="image/*"
                                onChange={(e) => handleFileUpload('coverImage', e.target.files[0])}
                                style={{ display: 'none' }}
                            />
                            <label htmlFor="cover-upload" className="upload-btn">
                                📁 Chọn ảnh bìa
                            </label>
                            <p className="upload-hint">PNG, JPG tối đa 5MB, tỷ lệ 16:9</p>
                        </div>
                    </div>
                </div>

                {/* Brand Colors */}
                <div className="form-section">
                    <h3>Màu sắc thương hiệu</h3>
                    <div className="color-picker-grid">
                        <div className="color-picker-item">
                            <label>Màu chính</label>
                            <div className="color-input-group">
                                <input
                                    type="color"
                                    value={formData.brandColors.primary}
                                    onChange={(e) => handleColorChange('primary', e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={formData.brandColors.primary}
                                    onChange={(e) => handleColorChange('primary', e.target.value)}
                                    placeholder="#3b82f6"
                                />
                            </div>
                        </div>

                        <div className="color-picker-item">
                            <label>Màu phụ</label>
                            <div className="color-input-group">
                                <input
                                    type="color"
                                    value={formData.brandColors.secondary}
                                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                                />
                                <input
                                    type="text"
                                    value={formData.brandColors.secondary}
                                    onChange={(e) => handleColorChange('secondary', e.target.value)}
                                    placeholder="#64748b"
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Preview */}
                <div className="form-section">
                    <h3>Xem trước</h3>
                    <div className="brand-preview">
                        <div 
                            className="preview-card"
                            style={{ 
                                borderColor: formData.brandColors.primary,
                                background: `linear-gradient(135deg, ${formData.brandColors.primary}20, ${formData.brandColors.secondary}20)`
                            }}
                        >
                            <div className="preview-header" style={{ backgroundColor: formData.brandColors.primary }}>
                                <div className="preview-logo">
                                    {formData.logo ? (
                                        <img src={formData.logo} alt="Logo" />
                                    ) : (
                                        <span>Logo</span>
                                    )}
                                </div>
                                <h4 style={{ color: 'white' }}>{data.name || 'Tên công ty'}</h4>
                            </div>
                            <div className="preview-content">
                                <p>Đây là cách thương hiệu của bạn sẽ hiển thị</p>
                                <button 
                                    type="button"
                                    style={{ 
                                        backgroundColor: formData.brandColors.primary,
                                        borderColor: formData.brandColors.primary
                                    }}
                                >
                                    Ứng tuyển ngay
                                </button>
                            </div>
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
                            '🎨 Lưu thương hiệu'
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default CompanyBranding;
