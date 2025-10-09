import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNotification } from '../contexts/NotificationContext';
import { jobAPI, jobOptions } from '../services/jobAPI';
import './CreateJobModal.css';

const CreateJobModal = ({ isOpen, onClose, onJobCreated, editJob = null }) => {
    const { user } = useAuth();
    const { success, error: showError, warning } = useNotification();

    const [formData, setFormData] = useState({
        // Thông tin cơ bản
        title: '',
        description: '',
        requirements: [],
        responsibilities: [],
        benefits: [],

        // Phân loại
        category: '',
        type: 'full-time',
        level: 'junior',

        // Địa điểm
        location: {
            address: '',
            city: '',
            district: '',
            coordinates: { lat: 0, lng: 0 }
        },

        // Lương
        salary: {
            type: 'monthly',
            min: '',
            max: '',
            currency: 'VND',
            isPublic: true
        },

        // Số lượng và thời gian
        capacity: '1',
        deadline: '',

        // Trạng thái và ưu tiên
        status: 'draft',
        priority: 'normal',

        // Tính năng nâng cao
        isUrgent: false,
        isHot: false,
        autoClose: false,
        maxApplications: '',

        // Tags và kỹ năng
        tags: [],
        skills: [],

        // Thông tin bổ sung
        experience: 'no-experience',
        education: 'no-requirement',

        // SEO
        keywords: []
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [errors, setErrors] = useState({});
    const [newRequirement, setNewRequirement] = useState('');
    const [newResponsibility, setNewResponsibility] = useState('');
    const [newBenefit, setNewBenefit] = useState('');
    const [newTag, setNewTag] = useState('');
    const [newSkill, setNewSkill] = useState('');
    const [newKeyword, setNewKeyword] = useState('');

    const totalSteps = 4;

    useEffect(() => {
        if (editJob) {
            setFormData({
                ...editJob,
                deadline: editJob.deadline ? new Date(editJob.deadline).toISOString().split('T')[0] : '',
                maxApplications: editJob.maxApplications || ''
            });
        }
    }, [editJob]);

    const handleInputChange = (field, value) => {
        if (field.includes('.')) {
            const [parent, child] = field.split('.');
            setFormData(prev => ({
                ...prev,
                [parent]: {
                    ...prev[parent],
                    [child]: value
                }
            }));
        } else {
            setFormData(prev => ({
                ...prev,
                [field]: value
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

    const addArrayItem = (field, value, setter) => {
        if (value.trim()) {
            setFormData(prev => ({
                ...prev,
                [field]: [...prev[field], value.trim()]
            }));
            setter('');
        }
    };

    const removeArrayItem = (field, index) => {
        setFormData(prev => ({
            ...prev,
            [field]: prev[field].filter((_, i) => i !== index)
        }));
    };

    const validateStep = (step) => {
        const newErrors = {};

        switch (step) {
            case 1:
                if (!formData.title.trim()) newErrors.title = 'Tiêu đề công việc là bắt buộc';
                if (!formData.description.trim()) newErrors.description = 'Mô tả công việc là bắt buộc';
                if (!formData.category) newErrors.category = 'Ngành nghề là bắt buộc';
                break;
            case 2:
                if (!formData.location.address.trim()) newErrors['location.address'] = 'Địa chỉ là bắt buộc';
                if (!formData.location.city) newErrors['location.city'] = 'Thành phố là bắt buộc';
                if (!formData.salary.min) newErrors['salary.min'] = 'Mức lương tối thiểu là bắt buộc';
                if (!formData.salary.max) newErrors['salary.max'] = 'Mức lương tối đa là bắt buộc';
                break;
            case 3:
                // Optional validation for step 3
                break;
            case 4:
                // Final validation
                break;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleNext = () => {
        if (validateStep(currentStep)) {
            setCurrentStep(prev => Math.min(prev + 1, totalSteps));
        }
    };

    const handlePrevious = () => {
        setCurrentStep(prev => Math.max(prev - 1, 1));
    };

    const handleSaveDraft = async () => {
        try {
            setIsSaving(true);
            const jobData = {
                ...formData,
                status: 'draft',
                capacity: parseInt(formData.capacity) || 1,
                salary: {
                    ...formData.salary,
                    min: parseInt(formData.salary.min),
                    max: parseInt(formData.salary.max)
                },
                deadline: formData.deadline ? new Date(formData.deadline) : null,
                maxApplications: formData.maxApplications ? parseInt(formData.maxApplications) : null
            };

            if (editJob) {
                await jobAPI.updateJob(editJob._id, jobData);
                success('Đã lưu nháp thành công!', 'Lưu nháp');
            } else {
                await jobAPI.createJob(jobData);
                success('Đã tạo nháp thành công!', 'Lưu nháp');
            }
        } catch (error) {
            showError('Lỗi khi lưu nháp: ' + (error.message || 'Unknown error'), 'Lỗi');
        } finally {
            setIsSaving(false);
        }
    };

    const handlePublish = async () => {
        if (!validateStep(currentStep)) {
            warning('Vui lòng kiểm tra lại thông tin trước khi đăng tin', 'Thiếu thông tin');
            return;
        }

        try {
            setIsLoading(true);
            const jobData = {
                ...formData,
                status: 'published',
                capacity: parseInt(formData.capacity) || 1,
                salary: {
                    ...formData.salary,
                    min: parseInt(formData.salary.min),
                    max: parseInt(formData.salary.max)
                },
                deadline: formData.deadline ? new Date(formData.deadline) : null,
                maxApplications: formData.maxApplications ? parseInt(formData.maxApplications) : null
            };

            let result;
            if (editJob) {
                result = await jobAPI.updateJob(editJob._id, jobData);
                success('Đã cập nhật và đăng tin thành công!', 'Đăng tin');
            } else {
                result = await jobAPI.createJob(jobData);
                success('Đã đăng tin tuyển dụng thành công!', 'Đăng tin');
            }

            if (onJobCreated) {
                onJobCreated(result);
            }
            onClose();
        } catch (error) {
            showError('Lỗi khi đăng tin: ' + (error.message || 'Unknown error'), 'Lỗi');
        } finally {
            setIsLoading(false);
        }
    };

    const renderStep1 = () => (
        <div className="create-job-step">
            <h3>Thông tin cơ bản</h3>

            <div className="form-group">
                <label>Tiêu đề công việc *</label>
                <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="VD: Lập trình viên Frontend React"
                    className={errors.title ? 'error' : ''}
                />
                {errors.title && <span className="error-text">{errors.title}</span>}
            </div>

            <div className="form-group">
                <label>Mô tả công việc *</label>
                <textarea
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    placeholder="Mô tả chi tiết về công việc, môi trường làm việc..."
                    rows={6}
                    className={errors.description ? 'error' : ''}
                />
                {errors.description && <span className="error-text">{errors.description}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Ngành nghề *</label>
                    <select
                        value={formData.category}
                        onChange={(e) => handleInputChange('category', e.target.value)}
                        className={errors.category ? 'error' : ''}
                    >
                        <option value="">Chọn ngành nghề</option>
                        {jobOptions.categories.map(cat => (
                            <option key={cat} value={cat}>{cat}</option>
                        ))}
                    </select>
                    {errors.category && <span className="error-text">{errors.category}</span>}
                </div>

                <div className="form-group">
                    <label>Loại hình công việc</label>
                    <select
                        value={formData.type}
                        onChange={(e) => handleInputChange('type', e.target.value)}
                    >
                        {jobOptions.types.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Cấp bậc</label>
                    <select
                        value={formData.level}
                        onChange={(e) => handleInputChange('level', e.target.value)}
                    >
                        {jobOptions.levels.map(level => (
                            <option key={level.value} value={level.value}>{level.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Số lượng cần tuyển</label>
                    <input
                        type="number"
                        min="1"
                        value={formData.capacity}
                        onChange={(e) => handleInputChange('capacity', e.target.value)}
                    />
                </div>
            </div>
        </div>
    );

    const renderStep2 = () => (
        <div className="create-job-step">
            <h3>Địa điểm và lương</h3>

            <div className="form-group">
                <label>Địa chỉ làm việc *</label>
                <input
                    type="text"
                    value={formData.location.address}
                    onChange={(e) => handleInputChange('location.address', e.target.value)}
                    placeholder="VD: 123 Nguyễn Văn A, Quận 1"
                    className={errors['location.address'] ? 'error' : ''}
                />
                {errors['location.address'] && <span className="error-text">{errors['location.address']}</span>}
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Thành phố *</label>
                    <select
                        value={formData.location.city}
                        onChange={(e) => handleInputChange('location.city', e.target.value)}
                        className={errors['location.city'] ? 'error' : ''}
                    >
                        <option value="">Chọn thành phố</option>
                        {jobOptions.cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                    {errors['location.city'] && <span className="error-text">{errors['location.city']}</span>}
                </div>

                <div className="form-group">
                    <label>Quận/Huyện</label>
                    <input
                        type="text"
                        value={formData.location.district}
                        onChange={(e) => handleInputChange('location.district', e.target.value)}
                        placeholder="VD: Quận 1"
                    />
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Mức lương tối thiểu *</label>
                    <input
                        type="number"
                        value={formData.salary.min}
                        onChange={(e) => handleInputChange('salary.min', e.target.value)}
                        placeholder="VD: 10000000"
                        className={errors['salary.min'] ? 'error' : ''}
                    />
                    {errors['salary.min'] && <span className="error-text">{errors['salary.min']}</span>}
                </div>

                <div className="form-group">
                    <label>Mức lương tối đa *</label>
                    <input
                        type="number"
                        value={formData.salary.max}
                        onChange={(e) => handleInputChange('salary.max', e.target.value)}
                        placeholder="VD: 20000000"
                        className={errors['salary.max'] ? 'error' : ''}
                    />
                    {errors['salary.max'] && <span className="error-text">{errors['salary.max']}</span>}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Đơn vị lương</label>
                    <select
                        value={formData.salary.type}
                        onChange={(e) => handleInputChange('salary.type', e.target.value)}
                    >
                        {jobOptions.salaryTypes.map(type => (
                            <option key={type.value} value={type.value}>{type.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.salary.isPublic}
                            onChange={(e) => handleInputChange('salary.isPublic', e.target.checked)}
                        />
                        Hiển thị mức lương công khai
                    </label>
                </div>
            </div>

            <div className="form-group">
                <label>Hạn nộp hồ sơ</label>
                <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                />
            </div>
        </div>
    );

    const renderStep3 = () => (
        <div className="create-job-step">
            <h3>Yêu cầu và quyền lợi</h3>

            <div className="form-group">
                <label>Yêu cầu ứng viên</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newRequirement}
                        onChange={(e) => setNewRequirement(e.target.value)}
                        placeholder="VD: Có kinh nghiệm React 2+ năm"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('requirements', newRequirement, setNewRequirement)}
                    />
                    <button type="button" onClick={() => addArrayItem('requirements', newRequirement, setNewRequirement)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.requirements.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('requirements', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Trách nhiệm công việc</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newResponsibility}
                        onChange={(e) => setNewResponsibility(e.target.value)}
                        placeholder="VD: Phát triển giao diện người dùng"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('responsibilities', newResponsibility, setNewResponsibility)}
                    />
                    <button type="button" onClick={() => addArrayItem('responsibilities', newResponsibility, setNewResponsibility)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.responsibilities.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('responsibilities', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Quyền lợi</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newBenefit}
                        onChange={(e) => setNewBenefit(e.target.value)}
                        placeholder="VD: Bảo hiểm sức khỏe, nghỉ phép có lương"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('benefits', newBenefit, setNewBenefit)}
                    />
                    <button type="button" onClick={() => addArrayItem('benefits', newBenefit, setNewBenefit)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.benefits.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('benefits', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-row">
                <div className="form-group">
                    <label>Kinh nghiệm</label>
                    <select
                        value={formData.experience}
                        onChange={(e) => handleInputChange('experience', e.target.value)}
                    >
                        {jobOptions.experience.map(exp => (
                            <option key={exp.value} value={exp.value}>{exp.label}</option>
                        ))}
                    </select>
                </div>

                <div className="form-group">
                    <label>Trình độ học vấn</label>
                    <select
                        value={formData.education}
                        onChange={(e) => handleInputChange('education', e.target.value)}
                    >
                        {jobOptions.education.map(edu => (
                            <option key={edu.value} value={edu.value}>{edu.label}</option>
                        ))}
                    </select>
                </div>
            </div>
        </div>
    );

    const renderStep4 = () => (
        <div className="create-job-step">
            <h3>Tính năng nâng cao</h3>

            <div className="form-group">
                <label>Kỹ năng yêu cầu</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newSkill}
                        onChange={(e) => setNewSkill(e.target.value)}
                        placeholder="VD: React, JavaScript, CSS"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('skills', newSkill, setNewSkill)}
                    />
                    <button type="button" onClick={() => addArrayItem('skills', newSkill, setNewSkill)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.skills.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('skills', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Tags</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newTag}
                        onChange={(e) => setNewTag(e.target.value)}
                        placeholder="VD: startup, remote, flexible"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('tags', newTag, setNewTag)}
                    />
                    <button type="button" onClick={() => addArrayItem('tags', newTag, setNewTag)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.tags.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('tags', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Từ khóa SEO</label>
                <div className="array-input">
                    <input
                        type="text"
                        value={newKeyword}
                        onChange={(e) => setNewKeyword(e.target.value)}
                        placeholder="VD: lập trình viên, frontend, react"
                        onKeyPress={(e) => e.key === 'Enter' && addArrayItem('keywords', newKeyword, setNewKeyword)}
                    />
                    <button type="button" onClick={() => addArrayItem('keywords', newKeyword, setNewKeyword)}>
                        Thêm
                    </button>
                </div>
                <div className="array-list">
                    {formData.keywords.map((item, index) => (
                        <div key={index} className="array-item">
                            <span>{item}</span>
                            <button type="button" onClick={() => removeArrayItem('keywords', index)}>×</button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="form-group">
                <label>Tính năng đặc biệt</label>
                <div className="checkbox-group">
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.isUrgent}
                            onChange={(e) => handleInputChange('isUrgent', e.target.checked)}
                        />
                        Tuyển gấp (Urgent) - Có phí
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.isHot}
                            onChange={(e) => handleInputChange('isHot', e.target.checked)}
                        />
                        Tin nổi bật (Hot Job) - Có phí
                    </label>
                    <label>
                        <input
                            type="checkbox"
                            checked={formData.autoClose}
                            onChange={(e) => handleInputChange('autoClose', e.target.checked)}
                        />
                        Tự động đóng khi đủ ứng viên
                    </label>
                </div>
            </div>

            {formData.autoClose && (
                <div className="form-group">
                    <label>Số lượng ứng tuyển tối đa</label>
                    <input
                        type="number"
                        value={formData.maxApplications}
                        onChange={(e) => handleInputChange('maxApplications', e.target.value)}
                        placeholder="VD: 50"
                    />
                </div>
            )}

            <div className="form-group">
                <label>Độ ưu tiên</label>
                <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                >
                    {jobOptions.priorities.map(priority => (
                        <option key={priority.value} value={priority.value}>{priority.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="create-job-modal">
                <div className="modal-header">
                    <h2>{editJob ? 'Chỉnh sửa tin tuyển dụng' : 'Đăng tin tuyển dụng'}</h2>
                    <button className="close-btn" onClick={onClose}>×</button>
                </div>

                <div className="modal-body">
                    <div className="step-indicator">
                        {Array.from({ length: totalSteps }, (_, i) => (
                            <div
                                key={i + 1}
                                className={`step ${i + 1 <= currentStep ? 'active' : ''}`}
                            >
                                {i + 1}
                            </div>
                        ))}
                    </div>

                    <div className="step-content">
                        {currentStep === 1 && renderStep1()}
                        {currentStep === 2 && renderStep2()}
                        {currentStep === 3 && renderStep3()}
                        {currentStep === 4 && renderStep4()}
                    </div>
                </div>

                <div className="modal-footer">
                    <div className="footer-left">
                        <button
                            type="button"
                            onClick={handleSaveDraft}
                            disabled={isSaving}
                            className="btn-secondary"
                        >
                            {isSaving ? 'Đang lưu...' : 'Lưu nháp'}
                        </button>
                    </div>

                    <div className="footer-right">
                        {currentStep > 1 && (
                            <button
                                type="button"
                                onClick={handlePrevious}
                                className="btn-secondary"
                            >
                                Trước
                            </button>
                        )}

                        {currentStep < totalSteps ? (
                            <button
                                type="button"
                                onClick={handleNext}
                                className="btn-primary"
                            >
                                Tiếp theo
                            </button>
                        ) : (
                            <button
                                type="button"
                                onClick={handlePublish}
                                disabled={isLoading}
                                className="btn-primary"
                            >
                                {isLoading ? 'Đang đăng...' : 'Đăng tin'}
                            </button>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateJobModal;
