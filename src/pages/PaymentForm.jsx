import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { userAPI, paymentAPI, handleAPIError
  
 } from "../utils/api";

const PaymentForm = () => {
  const [user, setUser] = useState(null);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [tuitionFee, setTuitionFee] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await userAPI.getProfile();
        setUser(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user:", err);
        const errorMessage = handleAPIError(err);
        setError(errorMessage);
        if (err.message.includes("401")) {
          navigate("/");
        }
      }
    };

    fetchUser();
  }, [navigate]);

  // Tìm kiếm thông tin sinh viên
  const handleStudentIdChange = async (e) => {
    const id = e.target.value;
    setStudentId(id);
    setStudentName("");
    setTuitionFee(0);
    setError("");

    if (id.length === 8) {
      // Giả sử MSSV có 8 ký tự
      setIsValidating(true);

      try {
        const data = await paymentAPI.searchStudent(id);
        if (data.success) {
          setStudentName(data.student.name);
          setTuitionFee(data.student.fee);
        } else {
          setError(
            data.message || "Không tìm thấy thông tin sinh viên với MSSV này"
          );
        }
      } catch (err) {
        setError("Lỗi khi tìm kiếm thông tin sinh viên: " + err.message);
      } finally {
        setIsValidating(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = await paymentAPI.createTransaction({
        studentId,
        studentName,
        amount: tuitionFee,
      });

      if (data.success) {
        navigate("/otp-verification", {
          state: {
            transactionId: data.transactionId,
            studentId,
            studentName,
            amount: tuitionFee,
            userEmail: user.email,
          },
        });
      } else {
        setError(data.message || "Có lỗi xảy ra khi tạo giao dịch");
      }
    } catch (err) {
      setError("Lỗi kết nối server: " + err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid =
    studentId && studentName && tuitionFee > 0 && tuitionFee <= user?.balance;

  if (!user) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-lg">Đang tải...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-center text-gray-800 mb-8">
            Thanh Toán Học Phí
          </h1>

          {error && (
            <div className="mb-6 p-4 bg-red-100 border border-red-400 text-red-700 rounded-lg">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Phần 1: Thông tin người nộp tiền */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                1. Thông tin người nộp tiền
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ và tên
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={user.username || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số điện thoại
                  </label>
                  <input
                    type="tel"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={user.phoneNumber || ""}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email
                  </label>
                  <input
                    type="email"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={user.email || ""}
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Phần 2: Thông tin học phí */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                2. Thông tin học phí
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Mã số sinh viên *
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    value={studentId}
                    onChange={handleStudentIdChange}
                    placeholder="Nhập MSSV (8 ký tự)"
                    maxLength="8"
                    required
                  />
                  {isValidating && (
                    <p className="text-sm text-blue-600 mt-1">
                      Đang tìm kiếm...
                    </p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Họ tên sinh viên
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={studentName}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền học phí
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={
                      tuitionFee > 0
                        ? `${tuitionFee.toLocaleString("vi-VN")} VND`
                        : ""
                    }
                    disabled
                  />
                </div>
              </div>
            </div>

            {/* Phần 3: Thông tin thanh toán */}
            <div className="pb-6">
              <h2 className="text-xl font-semibold text-gray-700 mb-4">
                3. Thông tin thanh toán
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số dư khả dụng
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed"
                    value={`${
                      user.balance?.toLocaleString("vi-VN") || "0"
                    } VND`}
                    disabled
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Số tiền cần thanh toán
                  </label>
                  <input
                    type="text"
                    className={`w-full px-3 py-2 border rounded-lg bg-gray-50 text-gray-500 cursor-not-allowed ${
                      tuitionFee > user.balance
                        ? "border-red-300 bg-red-50"
                        : "border-gray-300"
                    }`}
                    value={
                      tuitionFee > 0
                        ? `${tuitionFee.toLocaleString("vi-VN")} VND`
                        : ""
                    }
                    disabled
                  />
                  {tuitionFee > user.balance && tuitionFee > 0 && (
                    <p className="text-sm text-red-600 mt-1">
                      Số dư không đủ để thanh toán
                    </p>
                  )}
                </div>
              </div>

              {/* Điều khoản và thỏa thuận */}
              <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                <div className="flex items-start">
                  <input
                    type="checkbox"
                    id="terms"
                    className="mt-1 mr-3"
                    required
                  />
                  <label htmlFor="terms" className="text-sm text-gray-700">
                    Tôi đã đọc và đồng ý với{" "}
                    <a href="#" className="text-blue-600 hover:underline">
                      Điều khoản và Điều kiện
                    </a>{" "}
                    của dịch vụ thanh toán học phí. Tôi hiểu rằng giao dịch này
                    không thể hoàn tác.
                  </label>
                </div>
              </div>
            </div>

            {/* Nút xác nhận */}
            <div className="flex justify-center">
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting}
                className={`px-8 py-3 rounded-lg font-semibold text-white transition duration-200 ${
                  isFormValid && !isSubmitting
                    ? "bg-blue-600 hover:bg-blue-700"
                    : "bg-gray-400 cursor-not-allowed"
                }`}
              >
                {isSubmitting ? "Đang xử lý..." : "Xác nhận giao dịch"}
              </button>
            </div>
          </form>

          {/* Nút quay lại */}
          <div className="mt-6 text-center">
            <button
              onClick={() => navigate("/home")}
              className="text-blue-600 hover:underline"
            >
              ← Quay lại trang chủ
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
