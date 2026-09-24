import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";

export default function LoginPage() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    console.log({
      username,
      password,
      rememberMe,
    });

    navigate("/dashboard");
  };

  return (
    <div className="login-page">
      <main className="login-container">

        {/* Brand */}
        <div className="login-brand">
          <div className="brand-mark">
            <svg
              width="42"
              height="42"
              viewBox="0 0 42 42"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="21"
                cy="21"
                r="19"
                stroke="#4F6BFF"
                strokeWidth="2"
              />

              <path
                d="M12.5 21.5L18.5 27.5L30 15"
                stroke="#4F6BFF"
                strokeWidth="2.7"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="brand-name">
            Your<span>App</span>
          </div>
        </div>

        {/* Card */}
        <div className="login-card">

          <form
            className="login-form"
            onSubmit={handleSubmit}
          >

            {/* Username */}
            <div className="login-field">
              <label htmlFor="username">
                Username
              </label>

              <input
                id="username"
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            {/* Password */}
            <div className="login-field">
              <div className="password-label-row">
                <label htmlFor="password">
                  Password
                </label>

                <button
                  type="button"
                  className="forgot-password"
                  onClick={() => console.log("Forgot password")}
                >
                  Forgot password?
                </button>
              </div>

              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {/* Remember Me */}
            <div className="remember-row">

              <label className="remember-label">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) =>
                    setRememberMe(e.target.checked)
                  }
                />

                <span className="custom-checkbox"></span>

                <span>Remember me</span>
              </label>

            </div>

            {/* Button */}
            <button
              type="submit"
              className="login-button"
            >
              Log in
            </button>

          </form>

        </div>

      </main>

      {/* Footer */}
      <footer className="login-footer">
        © 2026 YourApp. All rights reserved.
      </footer>

    </div>
  );
}