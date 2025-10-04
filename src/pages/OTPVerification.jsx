import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { paymentAPI } from "../utils/api";

const OTPVerification = () => {
  const [otp, setOtp] = useState("");
  const [timeLeft, setTimeLeft] = useState(300); // 5 phút = 300 giây
  const [error, setError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Lấy thông tin giao dịch từ state
  const { transactionId, studentId, studentName, amount, userEmail } = location.state || {};

  useEffect(() => {
    if (!transactionId) {
      navigate("/home");
      return;
    }

    // Đếm ngược thời gian
    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [transactionId, navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (e) => {
    const value = e.target.value.replace(/\D/g, ''); // Chỉ cho phép số
    if (value.length <= 6) {
      setOtp(value);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (otp.length !== 6) {
      setError("Mã OTP phải có 6 chữ số");
      return;
    }

    if (timeLeft === 0) {
      setError("Mã OTP đã hết hạn. Vui lòng yêu cầu mã mới.");
      return;
    }

    setIsVerifying(true);
    setError("");

    try {
      const data = await paymentAPI.verifyOTP(transactionId, otp);
      
      if (data.success) {
        navigate("/payment-success", {
          state: {
            transactionId,
            studentId,
            studentName,
            amount,
            transactionCode: data.transactionCode,
          },
        });
      } else {
        setError(data.message || "Mã OTP không chính xác");
      }
    } catch (err) {
      setError("Lỗi kết nối server: " + err.message);
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResendOTP = async () => {
    if (!canResend) return;

    try {
      const data = await paymentAPI.resendOTP(transactionId);
      
      if (data.success) {
        setTimeLeft(300);
        setCanResend(false);
        setOtp("");
        setError("");
        alert("Mã OTP mới đã được gửi đến email của bạn");
      } else {
        setError(data.message || "Không thể gửi lại mã OTP");
      }
    } catch (err) {
      setError("Lỗi kết nối server: " + err.message);
    }
  };

  const handleCancel = () => {
    if (window.confirm("Bạn có chắc chắn muốn hủy giao dịch này?")) {
      navigate("/home");
    }
  };

  if (!transactionId) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Xác thực giao dịch
            </h1>
            <p className="text-gray-600">
              Chúng tôi đã gửi mã OTP đến email của bạn
            </p>
            <p className="text-sm text-gray-500 mt-1">
              {userEmail}
            </p>
          </div>

          {/* Thông tin giao dịch */}
          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-700 mb-3">Thông tin giao dịch:</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">MSSV:</span>
                <span className="font-medium">{studentId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tên sinh viên:</span>
                <span className="font-medium">{studentName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số tiền:</span>
                <span className="font-medium text-green-600">
                  {amount?.toLocaleString('vi-VN')} VND
                </span>
              </div>
            </div>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nhập mã OTP (6 chữ số)
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 text-center text-2xl font-mono border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={otp}
                onChange={handleOtpChange}
                placeholder="000000"
                maxLength="6"
                required
              />
            </div>

            {/* Đếm ngược thời gian */}
            <div className="text-center">
              {timeLeft > 0 ? (
                <p className="text-sm text-gray-600">
                  Mã OTP sẽ hết hạn sau:{" "}
                  <span className={`font-semibold ${timeLeft <= 60 ? 'text-red-600' : 'text-blue-600'}`}>
                    {formatTime(timeLeft)}
                  </span>
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">
                  Mã OTP đã hết hạn
                </p>
              )}
            </div>

            {/* Nút gửi lại OTP */}
            {canResend && (
              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  className="text-blue-600 hover:underline text-sm"
                >
                  Gửi lại mã OTP
                </button>
              </div>
            )}

            {/* Nút xác nhận */}
            <div className="flex space-x-4">
              <button
                type="button"
                onClick={handleCancel}
                className="flex-1 px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition duration-200"
              >
                Hủy giao dịch
              </button>
              <button
                type="submit"
                disabled={otp.length !== 6 || isVerifying || timeLeft === 0}
                className={`flex-1 px-6 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                  otp.length === 6 && !isVerifying && timeLeft > 0
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isVerifying ? "Đang xác thực..." : "Xác nhận"}
              </button>
            </div>
          </form>

          {/* Hướng dẫn */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-800 mb-2">Hướng dẫn:</h4>
            <ul className="text-sm text-blue-700 space-y-1">
              <li>• Kiểm tra hộp thư email của bạn</li>
              <li>• Mã OTP có hiệu lực trong 5 phút</li>
              <li>• Không chia sẻ mã OTP với bất kỳ ai</li>
              <li>• Nếu không nhận được email, kiểm tra thư mục spam</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OTPVerification;
