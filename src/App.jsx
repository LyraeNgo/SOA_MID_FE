import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProtectedRoute from "./utils/protectedRoute";
import Layout from "./components/layout/Layout";
import Login from "./pages/Login";
import Home from "./pages/Home";
import { History } from "./pages/History";

export default function App() {
  return (
    <Router>
      <Routes>
        {/* Login không dùng layout */}
        <Route path="/" element={<Login />} />

        {/* Các route cần layout */}
        <Route
          element={
            <ProtectedRoute>
              <Layout />
            </ProtectedRoute>
          }
        >
          <Route path="/home" element={<Home />} />
          <Route path="/history" element={<History />}></Route>
          {/* Có thể thêm nhiều route khác ở đây */}
        </Route>
      </Routes>
    </Router>
  );
}
