import React, { useEffect, useState } from "react";
import { paymentAPI, handleAPIError } from "../utils/api";
import { useNavigate } from "react-router-dom";

const TransactionHistory = () => {
  const navigate = useNavigate();
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const limit = 10;

  // Gọi API lấy lịch sử giao dịch
  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const data = await paymentAPI.getAllTransactions({
        page,
        limit,
        searchTerm,
        status: statusFilter,
        startDate,
        endDate,
      });
      if (data && Array.isArray(data.transactions)) {
        setTransactions(data.transactions);
        setTotalPages(data.totalPages || 1);
      } else {
        setTransactions([]);
        setTotalPages(1);
      }
    } catch (error) {
      alert(handleAPIError(error));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, [page, statusFilter, startDate, endDate]);

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4">
      {/* Header */}
      <div className="flex items-center justify-between py-4 px-6 bg-white shadow mb-4 rounded-lg">
        <button
          className="bg-blue-500 text-white px-4 py-3 rounded hover:bg-blue-600"
          onClick={() => navigate("/home")}
        >
          ← Về trang chủ
        </button>
        <h2 className="text-xl font-bold">Lịch sử giao dịch</h2>
        <div className="w-20" />
      </div>

      {/* Search + Filters */}
      <div className="bg-white p-4 shadow rounded-lg mb-4 flex flex-wrap gap-4 items-center">
        {/* Search */}
        <input
          type="text"
          placeholder="Tìm kiếm mã gd, mssv..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)} // chỉ cập nhật, không fetch
          className="border px-3 py-2 rounded w-64"
        />
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          onClick={() => {
            setPage(1); // về trang 1 khi search
            fetchTransactions(); // gọi hàm fetch khi nhấn nút
          }}
        >
          Search
        </button>

        {/* Status Filter */}
        <select
          className="border px-3 py-2 rounded"
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="">Tất cả trạng thái</option>
          <option value="completed">Thành công</option>
          <option value="failed">Thất bại</option>
        </select>
        {/* Date Range Filter */}
        <div className="flex items-center gap-2">
          <label className="text-sm">Từ ngày</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
          <label className="text-sm">Đến ngày</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-3 py-2 rounded"
          />
        </div>
      </div>

      {/* Transaction List */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        {loading ? (
          <div className="p-6 text-center text-gray-500">Đang tải...</div>
        ) : transactions.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            Không có giao dịch nào.
          </div>
        ) : (
          <table className="w-full border-collapse">
            <thead className="bg-gray-200">
              <tr>
                <th className="p-3 text-left">Mã giao dịch</th>
                <th className="p-3 text-left">MSSV</th>
                <th className="p-3 text-left">Số tiền</th>
                <th className="p-3 text-left">Nội dung</th>
                <th className="p-3 text-left">Trạng thái</th>
                <th className="p-3 text-center">Ngày tạo (dd/MM/yy)</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((txn) => (
                <tr
                  key={txn.transactionCode}
                  className="border-t hover:bg-gray-50"
                >
                  <td className="p-3 ">{txn.transactionCode}</td>
                  <td className="p-3">{txn.studentId}</td>
                  <td className="p-3">{txn.amount?.toLocaleString()} ₫</td>
                  <td className="p-3">{txn.description}</td>
                  <td
                    className={`p-3 font-medium ${
                      txn.status === "completed"
                        ? "text-green-600"
                        : txn.status === "failed"
                        ? "text-red-600"
                        : "text-gray-500"
                    }`}
                  >
                    {txn.status}
                  </td>
                  <td className="p-3 text-center">
                    {(() => {
                      const d = new Date(txn.createdAt);
                      const day = d.getDate().toString().padStart(2, "0");
                      const month = (d.getMonth() + 1)
                        .toString()
                        .padStart(2, "0");
                      const year = d.getFullYear();
                      return `${day}/${month}/${year}`;
                    })()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="flex flex-col items-center mt-6 gap-2">
        <div className="flex gap-2">
          <button
            onClick={() => setPage((p) => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            ← Trước
          </button>

          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setPage(idx + 1)}
              className={`px-3 py-2 rounded-lg border ${
                page === idx + 1
                  ? "bg-blue-500 text-white"
                  : "bg-white text-gray-700"
              }`}
            >
              {idx + 1}
            </button>
          ))}

          <button
            onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-3 py-2 bg-gray-200 rounded-lg disabled:opacity-50"
          >
            Sau →
          </button>
        </div>

        <span className="text-gray-500">
          Trang {page} / {totalPages}
        </span>
      </div>

      {/* Footer */}
      <div className="bg-white rounded-lg shadow-lg p-6">
        <div className="text-center">
          <h4 className="font-semibold text-gray-800 mb-2">
            Thông tin hệ thống
          </h4>
          <div className="flex justify-center space-x-6 text-sm text-gray-600">
            <a href="#" className="hover:text-blue-600">
              Điều khoản sử dụng
            </a>
            <a href="#" className="hover:text-blue-600">
              Chính sách bảo mật
            </a>
            <a href="#" className="hover:text-blue-600">
              Hỗ trợ
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionHistory;
