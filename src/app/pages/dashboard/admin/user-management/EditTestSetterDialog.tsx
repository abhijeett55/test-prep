import { useState } from "react";
import { X, Pencil } from "lucide-react";
import type { TestSetterRow } from "../../../../api/types";
import { updateTestSetter } from "../../../../api/auth/testsetter/testsetter";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  testsetter: TestSetterRow;
  onClose: () => void;
  onSaved: () => void;
};

export default function EditTestSetterDialog({ testsetter, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    full_name: testsetter.name,
    email: testsetter.email ?? "",
    phone: testsetter.phone ?? "",
    employee_code: testsetter.employee_code ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await updateTestSetter(testsetter.id, {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        employee_code: form.employee_code.trim() || null,
      });
      onSaved();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="confirm-overlay" role="dialog" aria-modal="true">
      <div className="confirm-card" style={{ width: 520, maxWidth: "calc(100vw - 32px)" }}>
        <button
          type="button"
          className="confirm-close"
          onClick={onClose}
          aria-label="Close"
          disabled={saving}
        >
          <X size={16} strokeWidth={2.2} />
        </button>

        <div className="confirm-icon">
          <Pencil size={20} strokeWidth={2.4} />
        </div>

        <h3 className="confirm-title">Edit {testsetter.name}</h3>
        <p className="confirm-subtitle">
          Update the test setter's details. Changes take effect immediately.
        </p>

        {error && (
          <p className="detect-error" style={{ margin: "0 0 12px", fontSize: 13 }}>
            {error}
          </p>
        )}

        <form onSubmit={save}>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "12px 16px",
              margin: "12px 0 20px",
            }}
          >
            <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>Full name</span>
              <input
                required
                value={form.full_name}
                onChange={set("full_name")}
                style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>Email</span>
              <input
                required
                type="email"
                value={form.email}
                onChange={set("email")}
                style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
              />
            </label>

            <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>Phone</span>
              <input
                value={form.phone}
                onChange={set("phone")}
                style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
              />
            </label>

            <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ fontSize: 12.5, color: "#6b7488" }}>Employee code</span>
              <input
                value={form.employee_code}
                onChange={set("employee_code")}
                style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
              />
            </label>
          </div>

          <div className="confirm-actions">
            <button type="button" className="confirm-btn-secondary" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn-primary" disabled={saving}>
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}