import Form from "../components/Form";
import { useState, useEffect } from "react";

const Home = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          console.error("❌ Chưa có token, user chưa đăng nhập");
          return;
        }

        const res = await fetch("http://localhost:5000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // ✅ gửi token
          },
        });

        if (!res.ok) {
          throw new Error("Fetch failed: " + res.status);
        }

        const data = await res.json();
        setUser(data);
      } catch (err) {
        console.error("❌ Lỗi khi lấy user:", err);
      }
    };

    fetchUser();
  }, []);

  return (
    <div className="flex flex-col justify-center items-center h-screen bg-gray-100 px-4">
      <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">
        Chào mừng bạn đến Ibanking 🎉
      </h1>

      <div className="w-full max-w-md">
        <Form user={user} />
      </div>

      {/* Các phần khác giữ nguyên */}
    </div>
  );
};

export default Home;
