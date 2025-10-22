// Mapping danh mục công việc với icon và màu sắc
export const jobCategoryIcons = {
  'Bán hàng': {
    icon: '🛍️',
    emoji: '🛍️',
    color: '#FF6B6B',
    bgColor: '#FFE5E5'
  },
  'Phục vụ': {
    icon: '🍽️',
    emoji: '🍽️',
    color: '#FFA500',
    bgColor: '#FFE8CC'
  },
  'Giáo dục': {
    icon: '📚',
    emoji: '📚',
    color: '#4ECDC4',
    bgColor: '#E0F7F6'
  },
  'Văn phòng': {
    icon: '📋',
    emoji: '📋',
    color: '#95E1D3',
    bgColor: '#E8F8F5'
  },
  'Giao hàng': {
    icon: '🚚',
    emoji: '🚚',
    color: '#F38181',
    bgColor: '#FFE5E5'
  },
  'Công nghệ': {
    icon: '💻',
    emoji: '💻',
    color: '#007AFF',
    bgColor: '#E3F2FD'
  },
  'Marketing': {
    icon: '📱',
    emoji: '📱',
    color: '#FF1493',
    bgColor: '#FFE5F0'
  },
  'Kho hàng': {
    icon: '📦',
    emoji: '📦',
    color: '#8B4513',
    bgColor: '#F5E6D3'
  },
  'Bảo vệ': {
    icon: '👮',
    emoji: '👮',
    color: '#2C3E50',
    bgColor: '#ECF0F1'
  },
  'Thiết kế': {
    icon: '🎨',
    emoji: '🎨',
    color: '#9B59B6',
    bgColor: '#F4E4F7'
  },
  'Lập trình': {
    icon: '💻',
    emoji: '💻',
    color: '#007AFF',
    bgColor: '#E3F2FD'
  },
  'Tiếng Anh': {
    icon: '🌍',
    emoji: '🌍',
    color: '#1ABC9C',
    bgColor: '#E8F8F5'
  },
  'Toán học': {
    icon: '🔢',
    emoji: '🔢',
    color: '#E74C3C',
    bgColor: '#FADBD8'
  }
};

// Hàm lấy icon cho danh mục
export const getCategoryIcon = (category) => {
  return jobCategoryIcons[category] || {
    icon: '💼',
    emoji: '💼',
    color: '#34C759',
    bgColor: '#E8F5E9'
  };
};

// Hàm lấy icon dựa trên loại công việc
export const getJobTypeIcon = (type) => {
  const typeIcons = {
    'full-time': '⏰',
    'part-time': '⏱️',
    'freelance': '🎯',
    'remote': '🏠',
    'contract': '📄',
    'internship': '🎓'
  };
  return typeIcons[type] || '💼';
};

// Hàm lấy icon dựa trên cấp độ công việc
export const getJobLevelIcon = (level) => {
  const levelIcons = {
    'intern': '🎓',
    'fresher': '🌱',
    'junior': '📈',
    'middle': '⭐',
    'senior': '🌟',
    'lead': '👑',
    'manager': '🎖️'
  };
  return levelIcons[level] || '💼';
};

// Hàm lấy màu dựa trên priority
export const getPriorityColor = (priority) => {
  const priorityColors = {
    'normal': '#34C759',
    'premium': '#FF9500',
    'urgent': '#FF3B30',
    'hot': '#FF1493'
  };
  return priorityColors[priority] || '#34C759';
};

// Hàm lấy badge text dựa trên priority
export const getPriorityBadge = (priority) => {
  const badges = {
    'normal': 'Bình thường',
    'premium': '⭐ Premium',
    'urgent': '🔥 Gấp',
    'hot': '🔥 Nổi bật'
  };
  return badges[priority] || 'Bình thường';
};

