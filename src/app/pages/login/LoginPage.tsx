import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./LoginPage.css";
import { useAuth } from "../../api/AuthContext";
import { ROLE_HOME_PATH } from "../../api/roleRouting";

function Ribbon() {
  return (
    <div className="ribbon" aria-hidden="true">
      <svg
        viewBox="0 0 900 1000"
        preserveAspectRatio="xMaxYMid slice"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="r0" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#d9f6ee" />
            <stop offset="1" stopColor="#bfe6ff" />
          </linearGradient>
          <linearGradient id="r1" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#bfe6ff" />
            <stop offset="1" stopColor="#a9b9ff" />
          </linearGradient>
          <linearGradient id="r2" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#a9b9ff" />
            <stop offset="1" stopColor="#cdb0ff" />
          </linearGradient>
          <linearGradient id="r3" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#cdb0ff" />
            <stop offset="1" stopColor="#ffb9db" />
          </linearGradient>
          <linearGradient id="r4" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0" stopColor="#ffb9db" />
            <stop offset="1" stopColor="#ffd9b8" />
          </linearGradient>
          <filter id="soften" x="-10%" y="-10%" width="120%" height="120%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
        </defs>

        <g className="ribbon-drift" filter="url(#soften)">
          <path d="M80 -40 C250 210 290 570 140 1040 L300 1040 C450 570 400 210 230 -40 Z" fill="url(#r0)" />
          <path d="M220 -40 C400 210 440 570 290 1040 L450 1040 C600 570 560 210 370 -40 Z" fill="url(#r1)" />
          <path d="M360 -40 C560 210 600 570 440 1040 L600 1040 C750 570 710 210 510 -40 Z" fill="url(#r2)" />
          <path d="M500 -40 C720 210 760 570 590 1040 L750 1040 C900 570 860 210 650 -40 Z" fill="url(#r3)" />
          <path d="M640 -40 C880 210 920 570 740 1040 L950 1040 L950 -40 Z" fill="url(#r4)" />
        </g>

        <g fill="none" stroke="#fff" strokeLinecap="round" opacity="0.55">
          <path d="M230 -20 C410 230 450 580 300 1020" strokeWidth="1.2" />
          <path d="M370 -20 C570 230 610 580 450 1020" strokeWidth="1.6" />
          <path d="M510 -20 C730 230 770 580 600 1020" strokeWidth="1.2" />
          <path d="M650 -20 C890 230 930 580 750 1020" strokeWidth="1.6" />
        </g>
      </svg>
    </div>
  );
}

const EyeIcon = ({ off }: { off: boolean }) => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d="M2 12s3.6-6.5 10-6.5S22 12 22 12s-3.6 6.5-10 6.5S2 12 2 12z" />
    <circle cx="12" cy="12" r="2.8" />
    {off && <path d="M4 4l16 16" />}
  </svg>
);

export default function LoginPage() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
 
  const navigate = useNavigate();
  const { login } = useAuth();
  const canSubmit = userId.trim() !== "" && password !== "" && !submitting;

    const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
 
    setError(null);
    setSubmitting(true);
    try {
      const user = await login(userId, password);
      navigate(ROLE_HOME_PATH[user.role]);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      const detail = err?.response?.data?.detail;
      setError(detail ?? "Something went wrong — please try again.");
    } finally {
      setSubmitting(false);
    }
  };
    return (
    <div className="login-page">
      <Ribbon />
 
      <header className="login-header">
        <h1 className="app-title">TestPrep</h1>
      </header>
 
      <main className="login-main">
        <section className="login-card" aria-label="Sign in">
          <div className="login-card-body">
            <form className="login-form" onSubmit={handleSubmit}>
              {error && (
                <p className="form-error" role="alert">
                  {error}
                </p>
              )}
 
              <div className="field">
                <label htmlFor="userId">User ID</label>
                <input
                  id="userId"
                  type="text"
                  value={userId}
                  onChange={(e) => setUserId(e.target.value)}
                  autoComplete="username"
                  autoFocus
                  required
                />
              </div>
 
              <div className="field">
                <label htmlFor="password">Password</label>
 
                <div className="input-wrap">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="current-password"
                    required
                  />
                  <button
                    type="button"
                    className="eye-button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    <EyeIcon off={showPassword} />
                  </button>
                </div>
              </div>
 
              <label className="remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span className="checkbox" aria-hidden="true" />
                <span>Remember me on this device</span>
              </label>
 
              <button type="submit" className="primary-button" disabled={!canSubmit}>
                {submitting ? "Signing in…" : "Login"}
              </button>
            </form>
          </div>
        </section>
      </main>
 
      <footer className="login-footer">
        <span>© 2026 Test-Prep</span>
        <a href="/privacy">Privacy &amp; terms</a>
      </footer>
    </div>
  );
}
