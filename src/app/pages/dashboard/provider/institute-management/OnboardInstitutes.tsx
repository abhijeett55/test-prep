import { useState } from "react";
import {
  createInstitute,
  type InstituteCreated,
  type InstituteStatus,
} from "../../../../api/auth/institute/institute";
import { errorMessage } from "../../../../api/client";
import "./Performance.css";

interface InstituteForm {
  institute_name: string;
  code: string;
  email: string;
  phone: string;
  address: string;
  status: InstituteStatus;
  ip_address: string;
  latitude: string;
  longitude: string;
}

const emptyForm: InstituteForm = {
  institute_name: "",
  code: "",
  email: "",
  phone: "",
  address: "",
  status: "ACTIVE",
  ip_address: "",
  latitude: "",
  longitude: "",
};

const STATUS_OPTIONS: InstituteStatus[] = ["ACTIVE", "INACTIVE", "SUSPENDED"];

export default function OnboardInstitute() {
  const [form, setForm] = useState<InstituteForm>(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [created, setCreated] = useState<InstituteCreated | null>(null);
  const [copied, setCopied] = useState(false);

  const [locating, setLocating] = useState(false);
  const [locateError, setLocateError] = useState<string | null>(null);

  const update =
    (key: keyof InstituteForm) =>
    (
      e: React.ChangeEvent<
        HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
      >
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }) as InstituteForm);
      if (created) setCreated(null);
    };

  const detectLocation = async () => {
    setLocating(true);
    setLocateError(null);

    // IP first — cheap and almost always succeeds
    try {
      const res = await fetch("https://api.ipify.org?format=json");
      const data = await res.json();
      setForm((prev) => ({ ...prev, ip_address: data.ip ?? "" }));
    } catch {
      setLocateError("Couldn't fetch IP address — enter it manually.");
    }

    // Then coordinates — needs browser permission
    if (!navigator.geolocation) {
      setLocateError(
        (prev) =>
          prev ?? "Geolocation isn't supported — enter coordinates manually."
      );
      setLocating(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setForm((prev) => ({
          ...prev,
          latitude: pos.coords.latitude.toFixed(8),
          longitude: pos.coords.longitude.toFixed(8),
        }));
        setLocating(false);
      },
      () => {
        setLocateError(
          (prev) =>
            prev ?? "Location permission denied — enter coordinates manually."
        );
        setLocating(false);
      }
    );
  };

  const handleSubmit = async () => {
    const institute_name = form.institute_name.trim();
    const code = form.code.trim();
    const email = form.email.trim();

    if (!institute_name || !code || !email) {
      setError("Institute name, code, and email are required.");
      return;
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setSubmitting(true);
    try {
      const result = await createInstitute({
        institute_name,
        code,
        email,
        phone: form.phone.trim() || null,
        address: form.address.trim() || null,
        status: form.status,
        ip_address: form.ip_address.trim() || null,
        latitude: form.latitude.trim() || null,
        longitude: form.longitude.trim() || null,
      });
      setCreated(result);
      setForm(emptyForm);
      setCopied(false);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSubmitting(false);
    }
  };

  const copyCredentials = async () => {
      if (!created) return;
      const text =
        `Institute Login\n` +
        `  ID: ${created.institute_id}\n` +
        `  Password: ${created.temp_password}\n\n` +
        `Admin Login\n` +
        `  ID: ADMIN-${created.code.toUpperCase()}\n` +
        `  Password: ${created.admin_temp_password}\n\n` +
        `Login URL: /role`;
      try {
        await navigator.clipboard.writeText(text);
        setCopied(true);
        window.setTimeout(() => setCopied(false), 2000);
      } catch {
        /* clipboard blocked — user can select manually */
      }
    };

  const reset = () => {
    setForm(emptyForm);
    setError("");
    setCreated(null);
    setLocateError(null);
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Onboard Institute</h1>
          <p>Add a new institute to the platform</p>
        </div>
      </div>

      {created && (
        <div className="perf-success">
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              gap: 16,
              alignItems: "flex-start",
            }}
          >
            <div>
              <strong>{created.institute_name}</strong> has been onboarded.

              <div
                style={{
                  marginTop: 12,
                  paddingTop: 12,
                  borderTop: "1px solid rgba(0,0,0,0.08)",
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                <div style={{ marginBottom: 6, color: "#1e8a4c" }}>
                  <b>Institute Login</b>
                </div>
                <div>
                  ID: <b>{created.institute_id}</b>
                </div>
                <div>
                  Temp password: <b>{created.temp_password}</b>
                </div>
              </div>

              <div
                style={{
                  marginTop: 10,
                  fontFamily: "monospace",
                  fontSize: 13,
                }}
              >
                <div style={{ marginBottom: 6, color: "#3f4fcf" }}>
                  <b>Admin Login</b>
                </div>
                <div>
                  ID: <b>ADMIN-{created.code.toUpperCase()}</b>
                </div>
                <div>
                  Temp password: <b>{created.admin_temp_password}</b>
                </div>
              </div>

              <div style={{ marginTop: 10, fontSize: 12, opacity: 0.8 }}>
                Share both sets with the institute. The admin uses the Admin login
                to manage teachers, students, and courses. Passwords are shown only
                once — they'll be asked to change on first login.
              </div>
            </div>
            <button className="perf-btn outline" onClick={copyCredentials}>
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
        </div>
      )}

      {error && (
        <div
          className="perf-success"
          style={{ background: "#fdeaea", color: "#c62f2f" }}
        >
          {error}
        </div>
      )}

      <div className="perf-form-card">
        {/* ---------- Institute details ---------- */}
        <div className="perf-form-grid">
          <div className="perf-field full">
            <label>Institute Name *</label>
            <input
              className="perf-input"
              value={form.institute_name}
              onChange={update("institute_name")}
              placeholder="e.g. Allen Career Institute"
            />
          </div>

          <div className="perf-field">
            <label>Institute Code *</label>
            <input
              className="perf-input"
              value={form.code}
              onChange={update("code")}
              placeholder="e.g. ALLEN-DEL"
            />
          </div>

          <div className="perf-field">
            <label>Email *</label>
            <input
              type="email"
              className="perf-input"
              value={form.email}
              onChange={update("email")}
              placeholder="admin@institute.edu"
            />
          </div>

          <div className="perf-field">
            <label>Phone</label>
            <input
              type="tel"
              className="perf-input"
              value={form.phone}
              onChange={update("phone")}
              placeholder="+91 98765 43210"
            />
          </div>

          <div className="perf-field">
            <label>Status</label>
            <select
              className="perf-input"
              value={form.status}
              onChange={update("status")}
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="perf-field full">
            <label>Address</label>
            <textarea
              className="perf-input"
              value={form.address}
              onChange={update("address")}
              placeholder="Street, city, state, PIN"
              rows={3}
              style={{
                height: "auto",
                padding: "10px 12px",
                resize: "vertical",
              }}
            />
          </div>
        </div>

        {/* ---------- Location ---------- */}
        <div
          style={{
            height: 1,
            background: "#e6e9f0",
            margin: "20px 0",
          }}
        />

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: 12,
          }}
        >
          <h3
            style={{
              margin: 0,
              fontSize: 13,
              fontWeight: 600,
              textTransform: "uppercase",
              letterSpacing: "0.04em",
              color: "#6b7488",
            }}
          >
            Location
          </h3>
          <button
            type="button"
            className="perf-btn outline"
            onClick={detectLocation}
            disabled={locating}
          >
            {locating ? "Detecting…" : "Auto-detect"}
          </button>
        </div>

        {locateError && (
          <div
            style={{
              margin: "0 0 12px",
              fontSize: 12.5,
              color: "#c0392b",
            }}
          >
            {locateError}
          </div>
        )}

        <div className="perf-form-grid">
          <div className="perf-field full">
            <label>IP Address</label>
            <input
              className="perf-input"
              value={form.ip_address}
              onChange={update("ip_address")}
              placeholder="Auto-detected or enter manually"
            />
          </div>

          <div className="perf-field">
            <label>Latitude</label>
            <input
              className="perf-input"
              value={form.latitude}
              onChange={update("latitude")}
              placeholder="e.g. 28.61393910"
            />
          </div>

          <div className="perf-field">
            <label>Longitude</label>
            <input
              className="perf-input"
              value={form.longitude}
              onChange={update("longitude")}
              placeholder="e.g. 77.20902120"
            />
          </div>
        </div>

        <div className="perf-form-actions">
          <button
            className="perf-btn outline"
            onClick={reset}
            disabled={submitting}
          >
            Reset
          </button>
          <button
            className="perf-btn"
            onClick={handleSubmit}
            disabled={submitting}
          >
            {submitting ? "Onboarding…" : "Onboard Institute"}
          </button>
        </div>
      </div>
    </div>
  );
}