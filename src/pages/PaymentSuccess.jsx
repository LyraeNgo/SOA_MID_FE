import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";

const PaymentSuccess = () => {
  const [user, setUser] = useState(null);
  const [countdown, setCountdown] = useState(10);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin giao dịch từ state
  const { transactionId, studentId, studentName, amount, transactionCode } = location.state || {};

  useEffect(() => {
    if (!transactionId) {
      navigate("/home");
      return;
    }

    // Lấy thông tin user mới nhất
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/");
          return;
        }

        const res = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data);
        }
      } catch (err) {
        console.error("❌ Lỗi khi lấy thông tin user:", err);
      }
    };

    fetchUser();

    // Đếm ngược để tự động chuyển về trang chủ
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          navigate("/home");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [transactionId, navigate]);

  const handleBackToHome = () => {
    navigate("/home");
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleViewHistory = () => {
    navigate("/home"); // Có thể tạo trang riêng cho lịch sử giao dịch
  };

  if (!transactionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          {/* Header thành công */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-green-600 mb-2">
              Giao dịch thành công!
            </h1>
            <p className="text-gray-600">
              Thanh toán học phí đã được thực hiện thành công
            </p>
          </div>

          {/* Thông tin giao dịch */}
          <div className="bg-green-50 rounded-lg p-6 mb-6">
            <h3 className="font-semibold text-green-800 mb-4 text-center">
              Thông tin giao dịch
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-green-700 font-medium">Mã giao dịch:</span>
                <span className="font-mono text-sm bg-white px-2 py-1 rounded">
                  {transactionCode || transactionId}
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-green-700 font-medium">MSSV:</span>
                <span className="font-semibold">{studentId}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-green-700 font-medium">Tên sinh viên:</span>
                <span className="font-semibold">{studentName}</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-green-700 font-medium">Số tiền thanh toán:</span>
                <span className="font-bold text-green-600 text-lg">
                  {amount?.toLocaleString('vi-VN')} VND
                </span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-green-200">
                <span className="text-green-700 font-medium">Thời gian:</span>
                <span className="font-semibold">
                  {new Date().toLocaleString('vi-VN')}
                </span>
              </div>
              {user && (
                <div className="flex justify-between items-center py-2">
                  <span className="text-green-700 font-medium">Số dư còn lại:</span>
                  <span className="font-bold text-blue-600">
                    {user.balance?.toLocaleString('vi-VN')} VND
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Thông báo email */}
          <div className="bg-blue-50 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-blue-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <p className="text-blue-800 text-sm">
                Email xác nhận giao dịch đã được gửi đến địa chỉ email của bạn
              </p>
            </div>
          </div>

          {/* Nút hành động */}
          <div className="space-y-4">
            <button
              onClick={handleBackToHome}
              className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition duration-200 font-semibold"
            >
              Về trang chủ ({countdown}s)
            </button>
            
            <div className="grid grid-cols-2 gap-4">
              <button
                onClick={handlePrintReceipt}
                className="bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 transition duration-200"
              >
                In biên lai
              </button>
              <button
                onClick={handleViewHistory}
                className="bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition duration-200"
              >
                Xem lịch sử
              </button>
            </div>
          </div>

          {/* Thông tin bổ sung */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-800 mb-2">Lưu ý quan trọng:</h4>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• Giao dịch đã được xử lý thành công</li>
              <li>• Học phí đã được ghi nhận vào hệ thống</li>
              <li>• Vui lòng lưu lại mã giao dịch để tra cứu sau này</li>
              <li>• Nếu có thắc mắc, liên hệ bộ phận hỗ trợ</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Print styles */}
      <style jsx>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: white !important;
          }
          .bg-gray-100 {
            background: white !important;
          }
        }
      `}</style>
    </div>
  );
};

export default PaymentSuccess;
