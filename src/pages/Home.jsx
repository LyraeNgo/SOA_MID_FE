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
        Chào mừng {user ? user.username : "bạn"} đến Ibanking 🎉
      </h1>
      <form className="w-full max-w-md">
        <Form user={user}></Form>
        <div className="relative">
          {/* Icon search */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className="w-5 h-5 text-gray-500"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          {/* Search */}
          <input
            type="search"
            id="default-search"
            className="block w-full p-4 pl-10 text-sm text-gray-900 border border-gray-300 rounded-lg bg-gray-50 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Search Mockups, Logos..."
            required
          />
          {/* Button */}
          <button
            type="submit"
            className="absolute right-2.5 bottom-2.5 px-4 py-2 text-sm font-medium text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300"
          >
            Tim kiem
          </button>
        </div>
      </form>

      <button
        type="button"
        className="text-white bg-gradient-to-br from-green-400 to-blue-600 hover:bg-gradient-to-bl focus:ring-4 focus:outline-none focus:ring-green-200 dark:focus:ring-green-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
      >
        Green to Blue
      </button>

      <section>
        <div className="overflow-x-auto overflow-y-hidden border-b border-gray-200 dark:border-gray-700 mb-4">
          <ul className="flex flex-nowrap justify-center text-sm font-medium text-center text-gray-500">
            <li className="px-3 ">Điều Khoản</li>
            <li className="px-3 ">Thỏa thuận</li>
            <li className="px-3 ">hehehe</li> <li className="px-3 ">hehehe</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;
