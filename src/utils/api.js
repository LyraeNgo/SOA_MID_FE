// API Configuration
const API_BASE_URL = "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  let data = null;
  try {
    data = await response.json();
  } catch (err) {
    console.error("Lỗi parse JSON từ API:", err);
    data = null;
  }
  if (!response.ok) {
    throw new Error(
      (data && data.message) || `HTTP error! status: ${response.status}`
    );
  }
  return data;
};

// Auth API
export const authAPI = {
  login: async (email, password) => {
    const response = await fetch(`${API_BASE_URL}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    });
    return handleResponse(response);
  },

  logout: async () => {
    const response = await fetch(`${API_BASE_URL}/auth/logout`, {
      method: "POST",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },
};

// User API
export const userAPI = {
  getProfile: async () => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    return handleResponse(response);
  },

  updateProfile: async (userData) => {
    const response = await fetch(`${API_BASE_URL}/users/me`, {
      method: "PUT",
      headers: getAuthHeaders(),
      body: JSON.stringify(userData),
    });
    return handleResponse(response);
  },
};

// Payment API
export const paymentAPI = {
  /**
   * Lấy tất cả transaction từ BE với filter/search/pagination
   * @param {Object} params - { page, limit, searchTerm, status, startDate, endDate }
   * @returns {Promise<Object|null>} - { transactions, totalPages } hoặc null nếu lỗi
   */
  getAllTransactions: async ({
    page = 1,
    limit = 10,
    searchTerm,
    status,
    startDate,
    endDate,
  }) => {
    const params = { page, limit, searchTerm, status, startDate, endDate };
    const queryString = Object.entries(params)
      .filter(([_, v]) => v !== undefined && v !== "") // Bỏ qua giá trị rỗng
      .map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`)
      .join("&");

    try {
      const response = await fetch(
        `${API_BASE_URL}/transactions?${queryString}`,
        {
          method: "GET",
          headers: getAuthHeaders(),
        }
      );
      return await handleResponse(response);
    } catch (error) {
      console.error("getAllTransactions error:", error);
      return null;
    }
  },

  // Tạo giao dịch và gửi OTP
  createTransaction: async (transactionData) => {
    const response = await fetch(`${API_BASE_URL}/payment/create-transaction`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(transactionData),
    });
    return handleResponse(response);
  },

  // Xác thực OTP
  verifyOTP: async (transactionId, otp) => {
    const response = await fetch(`${API_BASE_URL}/payment/verify-otp`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ transactionId, otp }),
    });
    return handleResponse(response);
  },

  // Gửi lại OTP
  resendOTP: async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/payment/resend-otp`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ transactionId }),
    });
    return handleResponse(response);
  },

  // Lấy lịch sử giao dịch
  getTransactionHistory: async (page = 1, limit = 10) => {
    const response = await fetch(
      `${API_BASE_URL}/payment/history?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );
    return handleResponse(response);
  },

  // Hủy giao dịch
  cancelTransaction: async (transactionId) => {
    const response = await fetch(`${API_BASE_URL}/payment/cancel`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ transactionId }),
    });
    return handleResponse(response);
  },
};

// Student API (for TDTU students)
export const studentAPI = {
  // Lấy thông tin học phí của sinh viên
  getTuitionInfo: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/tuition-info`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId }),
    });
    return handleResponse(response);
  },

  // Lấy lịch sử học phí
  getTuitionHistory: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/student/tuition-history`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify({ studentId }),
    });
    return handleResponse(response);
  },
};

// Error handling utility
export const handleAPIError = (error) => {
  console.error("API Error:", error);

  if (error.message.includes("401") || error.message.includes("Unauthorized")) {
    // Token expired or invalid
    localStorage.removeItem("token");
    window.location.href = "/";
    return "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.";
  }

  if (error.message.includes("Network error")) {
    return "Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.";
  }

  return error.message || "Có lỗi xảy ra. Vui lòng thử lại sau.";
};

// Utility functions
export const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const generateTransactionCode = () => {
  const timestamp = Date.now().toString(36);
  const random = Math.random().toString(36).substr(2, 5);
  return `TXN${timestamp}${random}`.toUpperCase();
};

export default {
  authAPI,
  userAPI,
  paymentAPI,
  studentAPI,
  handleAPIError,
  generateOTP,
  generateTransactionCode,
};
