import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Login với:", { email, password });
    navigate("/home", { state: { email: email } });
  };

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center bg-light">
      <div className="card shadow p-4" style={{ width: "24rem" }}>
        <h2 className="text-center mb-3">Đăng nhập</h2>
        <p className="text-center text-muted small mb-4">
          Vui lòng nhập thông tin để tiếp tục
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="you@example.com"
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="••••••••"
            />
          </div>

          <button type="submit" className="btn btn-primary w-100">
            Đăng nhập
          </button>
        </form>

        <p className="text-center small mt-3 mb-0">
          Chưa có tài khoản?{" "}
          <a href="/register" className="text-primary text-decoration-none">
            Đăng ký
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
