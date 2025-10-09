import React, { useState } from 'react';

export default function PostJobModal({ isOpen, onClose, onSubmit }) {
    const [form, setForm] = useState({
        title: '', company: '', location: 'Hòa Lạc, Hà Nội', type: 'Part-Time',
        hourlyRateMin: 30000, hourlyRateMax: 50000, schedule: 'Linh hoạt', description: ''
    });
    if (!isOpen) return null;
    const change = (e) => setForm({ ...form, [e.target.name]: e.target.value });
    const submit = () => { onSubmit?.(form); onClose?.(); };
    return (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
            <div className="modal-dialog modal-lg">
                <div className="modal-content" style={{ borderRadius: '12px' }}>
                    <div className="modal-header border-0">
                        <h5 className="modal-title fw-bold">Đăng tuyển việc làm</h5>
                        <button className="btn-close" onClick={onClose}></button>
                    </div>
                    <div className="modal-body">
                        <div className="row g-3">
                            <div className="col-md-6">
                                <label className="form-label">Chức danh</label>
                                <input name="title" className="form-control" value={form.title} onChange={change} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Công ty</label>
                                <input name="company" className="form-control" value={form.company} onChange={change} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Địa điểm</label>
                                <input name="location" className="form-control" value={form.location} onChange={change} />
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Loại hình</label>
                                <select name="type" className="form-select" value={form.type} onChange={change}>
                                    <option>Part-Time</option>
                                    <option>Full-Time</option>
                                    <option>Remote</option>
                                </select>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Mức lương (VNĐ/giờ)</label>
                                <div className="input-group">
                                    <input type="number" name="hourlyRateMin" className="form-control" value={form.hourlyRateMin} onChange={change} />
                                    <span className="input-group-text">-</span>
                                    <input type="number" name="hourlyRateMax" className="form-control" value={form.hourlyRateMax} onChange={change} />
                                </div>
                            </div>
                            <div className="col-md-6">
                                <label className="form-label">Lịch làm việc</label>
                                <select name="schedule" className="form-select" value={form.schedule} onChange={change}>
                                    <option>Linh hoạt</option>
                                    <option>Ca sáng (6h-12h)</option>
                                    <option>Ca chiều (12h-18h)</option>
                                    <option>Ca tối (18h-22h)</option>
                                    <option>Ca đêm (22h-6h)</option>
                                    <option>Cuối tuần</option>
                                </select>
                            </div>
                            <div className="col-12">
                                <label className="form-label">Mô tả</label>
                                <textarea name="description" className="form-control" rows="4" value={form.description} onChange={change}></textarea>
                            </div>
                        </div>
                    </div>
                    <div className="modal-footer border-0">
                        <button className="btn btn-outline-secondary" onClick={onClose}>Hủy</button>
                        <button className="btn" style={{ backgroundColor: '#ff6b35', color: 'white' }} onClick={submit}>Đăng tuyển</button>
                    </div>
                </div>
            </div>
        </div>
    );
}











