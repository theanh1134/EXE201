import api from './authAPI';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:5001/api';

// Job Management API
export const jobAPI = {
    // Get all jobs (public)
    getJobs: async (params = {}) => {
        const queryParams = new URLSearchParams(params).toString();
        const response = await fetch(`${API_BASE_URL}/jobs?${queryParams}`);
        return response.json();
    },

    // Get job by ID (public)
    getJobById: async (id) => {
        const response = await fetch(`${API_BASE_URL}/jobs/${id}`);
        return response.json();
    },

  // Get jobs by user (authenticated)
  getUserJobs: async (userId, params = {}) => {
    const queryParams = new URLSearchParams(params).toString();
    const response = await api.get(`/jobs/my-jobs?${queryParams}`);
    return response.data;
  },

    // Create new job (authenticated)
    createJob: async (jobData) => {
        const response = await api.post('/jobs', jobData);
        return response.data;
    },

    // Update job (authenticated)
    updateJob: async (id, jobData) => {
        const response = await api.put(`/jobs/${id}`, jobData);
        return response.data;
    },

    // Publish job (authenticated)
    publishJob: async (id) => {
        const response = await api.post(`/jobs/${id}/publish`);
        return response.data;
    },

    // Clone job (authenticated)
    cloneJob: async (id) => {
        const response = await api.post(`/jobs/${id}/clone`);
        return response.data;
    },

    // Delete job (authenticated)
    deleteJob: async (id) => {
        const response = await api.delete(`/jobs/${id}`);
        return response.data;
    },

    // Get job statistics (authenticated)
    getJobStats: async (id) => {
        const response = await api.get(`/jobs/${id}/stats`);
        return response.data;
    }
};

// Job categories and options
export const jobOptions = {
    categories: [
        'Công nghệ thông tin',
        'Kinh doanh',
        'Marketing',
        'Nhân sự',
        'Kế toán',
        'Bán hàng',
        'Dịch vụ khách hàng',
        'Sản xuất',
        'Vận chuyển',
        'Giáo dục',
        'Y tế',
        'Du lịch',
        'Bất động sản',
        'Tài chính',
        'Pháp lý',
        'Thiết kế',
        'Nghệ thuật',
        'Thể thao',
        'Khác'
    ],

    types: [
        { value: 'full-time', label: 'Toàn thời gian' },
        { value: 'part-time', label: 'Bán thời gian' },
        { value: 'freelance', label: 'Freelance' },
        { value: 'remote', label: 'Làm việc từ xa' },
        { value: 'contract', label: 'Hợp đồng' },
        { value: 'internship', label: 'Thực tập' }
    ],

    levels: [
        { value: 'intern', label: 'Thực tập sinh' },
        { value: 'fresher', label: 'Mới tốt nghiệp' },
        { value: 'junior', label: 'Junior' },
        { value: 'middle', label: 'Middle' },
        { value: 'senior', label: 'Senior' },
        { value: 'lead', label: 'Lead' },
        { value: 'manager', label: 'Quản lý' }
    ],

    experience: [
        { value: 'no-experience', label: 'Không yêu cầu kinh nghiệm' },
        { value: '1-year', label: '1 năm' },
        { value: '2-years', label: '2 năm' },
        { value: '3-years', label: '3 năm' },
        { value: '5-years', label: '5 năm' },
        { value: '5+ years', label: 'Trên 5 năm' }
    ],

    education: [
        { value: 'no-requirement', label: 'Không yêu cầu' },
        { value: 'high-school', label: 'Trung học phổ thông' },
        { value: 'college', label: 'Cao đẳng' },
        { value: 'university', label: 'Đại học' },
        { value: 'master', label: 'Thạc sĩ' },
        { value: 'phd', label: 'Tiến sĩ' }
    ],

    salaryTypes: [
        { value: 'monthly', label: 'Tháng' },
        { value: 'hourly', label: 'Giờ' },
        { value: 'project', label: 'Dự án' },
        { value: 'negotiable', label: 'Thỏa thuận' }
    ],

    statuses: [
        { value: 'draft', label: 'Nháp', color: 'gray' },
        { value: 'published', label: 'Đã đăng', color: 'green' },
        { value: 'paused', label: 'Tạm dừng', color: 'yellow' },
        { value: 'closed', label: 'Đã đóng', color: 'red' },
        { value: 'expired', label: 'Hết hạn', color: 'red' }
    ],

    priorities: [
        { value: 'normal', label: 'Bình thường', color: 'blue' },
        { value: 'premium', label: 'Cao cấp', color: 'purple' },
        { value: 'urgent', label: 'Khẩn cấp', color: 'red' },
        { value: 'hot', label: 'Nổi bật', color: 'orange' }
    ],

    cities: [
        'Hà Nội',
        'TP. Hồ Chí Minh',
        'Đà Nẵng',
        'Hải Phòng',
        'Cần Thơ',
        'An Giang',
        'Bà Rịa - Vũng Tàu',
        'Bắc Giang',
        'Bắc Kạn',
        'Bạc Liêu',
        'Bắc Ninh',
        'Bến Tre',
        'Bình Định',
        'Bình Dương',
        'Bình Phước',
        'Bình Thuận',
        'Cà Mau',
        'Cao Bằng',
        'Đắk Lắk',
        'Đắk Nông',
        'Điện Biên',
        'Đồng Nai',
        'Đồng Tháp',
        'Gia Lai',
        'Hà Giang',
        'Hà Nam',
        'Hà Tĩnh',
        'Hải Dương',
        'Hậu Giang',
        'Hòa Bình',
        'Hưng Yên',
        'Khánh Hòa',
        'Kiên Giang',
        'Kon Tum',
        'Lai Châu',
        'Lâm Đồng',
        'Lạng Sơn',
        'Lào Cai',
        'Long An',
        'Nam Định',
        'Nghệ An',
        'Ninh Bình',
        'Ninh Thuận',
        'Phú Thọ',
        'Phú Yên',
        'Quảng Bình',
        'Quảng Nam',
        'Quảng Ngãi',
        'Quảng Ninh',
        'Quảng Trị',
        'Sóc Trăng',
        'Sơn La',
        'Tây Ninh',
        'Thái Bình',
        'Thái Nguyên',
        'Thanh Hóa',
        'Thừa Thiên Huế',
        'Tiền Giang',
        'Trà Vinh',
        'Tuyên Quang',
        'Vĩnh Long',
        'Vĩnh Phúc',
        'Yên Bái'
    ]
};

export default jobAPI;
