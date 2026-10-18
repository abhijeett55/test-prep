import { useState } from "react";
import { X, Pencil } from "lucide-react";
import {
  updateTeacher,
  type TeacherDetail,
  type TeacherUpdate,
} from "../../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

type Props = {
  teacher: TeacherDetail;
  onClose: () => void;
  onSaved: (updated: TeacherDetail) => void;
};

export default function EditTeacherDialog({ teacher, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    full_name: teacher.name,
    email: teacher.email ?? "",
    phone: teacher.phone ?? "",
    employee_code: teacher.employee_code ?? "",
    qualification: teacher.qualification ?? "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (e: React.ChangeEvent<HTMLInputElement>) =>
      setForm((prev) => ({ ...prev, [key]: e.target.value }));

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: TeacherUpdate = {
        full_name: form.full_name.trim(),
        email: form.email.trim() || null,
        phone: form.phone.trim() || null,
        employee_code: form.employee_code.trim() || null,
        qualification: form.qualification.trim() || null,
      };
      const updated = (await updateTeacher(teacher.id, payload)) as TeacherDetail;
      onSaved(updated);
      onClose();
    } catch (e) {
      setError(errorMessage(e));
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

        <h3 className="confirm-title">Edit {teacher.name}</h3>
        <p className="confirm-subtitle">
          Update the teacher's details. Changes take effect immediately.
        </p>

        {error && (
          <p className="detect-error" style={{ margin: "0 0 12px", fontSize: 13 }}>
            {error}
          </p>
        )}

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
              value={form.full_name}
              onChange={set("full_name")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Email</span>
            <input
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

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Employee code</span>
            <input
              value={form.employee_code}
              onChange={set("employee_code")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Qualification</span>
            <input
              value={form.qualification}
              onChange={set("qualification")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>
        </div>

        <div className="confirm-actions">
          <button className="confirm-btn-secondary" onClick={onClose} disabled={saving}>
            Cancel
          </button>
          <button className="confirm-btn-primary" onClick={save} disabled={saving}>
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}