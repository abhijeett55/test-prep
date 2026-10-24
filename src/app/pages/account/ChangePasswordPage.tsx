import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../config/auth/AuthContext";
import { ROLE_API_SEGMENT } from "../../api/auth/roleRouting";
import { client, errorMessage } from "../../api/client";
import "./ChangePasswordPage.css";

export default function ChangePasswordPage() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [current, setCurrent] = useState("");
  const [next, setNext] = useState("");
  const [confirm, setConfirm] = useState("");
  const [show, setShow] = useState(false);
  const [err, setErr] = useState<string | null>(null);
  const [ok, setOk] = useState(false);
  const [busy, setBusy] = useState(false);

  if (!user) return null;

  const passwordsMatch = next === confirm;
  const longEnough = next.length >= 8;
  const canSubmit =
    current !== "" && longEnough && passwordsMatch && !busy;

 
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setErr(null);
    setBusy(true);
    try {
      const segment = ROLE_API_SEGMENT[user!.role];
      
      await client.post(`/${segment}/change-password`, {
        current_password: current,
        new_password: next,
      });

      setOk(true);
      setTimeout(() => {
        logout();
        navigate("/role", { replace: true });
      }, 1200);
    } catch (e) {
      setErr(errorMessage(e));
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="cp-page">
      <header className="cp-head">
        <h1>Change Password</h1>
        <p>
          Choose a new password for your <strong>{user.role}</strong> account.
        </p>
      </header>

      <form className="cp-form" onSubmit={handleSubmit}>
        {err && <p className="cp-error">{err}</p>}
        {ok && (
          <p className="cp-success">
            Password changed — redirecting to sign-in…
          </p>
        )}

        <div className="cp-field">
          <label htmlFor="current">Current password</label>
          <input
            id="current"
            type={show ? "text" : "password"}
            value={current}
            onChange={(e) => setCurrent(e.target.value)}
            autoComplete="current-password"
            required
          />
        </div>

        <div className="cp-field">
          <label htmlFor="next">New password</label>
          <input
            id="next"
            type={show ? "text" : "password"}
            value={next}
            onChange={(e) => setNext(e.target.value)}
            autoComplete="new-password"
            minLength={8}
            required
          />
          {next.length > 0 && !longEnough && (
            <small className="cp-hint error">At least 8 characters</small>
          )}
        </div>

        <div className="cp-field">
          <label htmlFor="confirm">Confirm new password</label>
          <input
            id="confirm"
            type={show ? "text" : "password"}
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            autoComplete="new-password"
            required
          />
          {confirm.length > 0 && !passwordsMatch && (
            <small className="cp-hint error">Passwords do not match</small>
          )}
        </div>

        <label className="cp-show">
          <input
            type="checkbox"
            checked={show}
            onChange={(e) => setShow(e.target.checked)}
          />
          <span>Show passwords</span>
        </label>

        <button className="cp-submit" disabled={!canSubmit}>
          {busy ? "Saving…" : "Change password"}
        </button>
      </form>
    </div>
  );
}