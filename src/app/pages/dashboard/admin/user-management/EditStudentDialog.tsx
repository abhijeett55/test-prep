import { useState } from "react";
import { X, Pencil } from "lucide-react";
import {
  updateStudent,
  type StudentDetail,
  type StudentUpdate,
} from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

type Props = {
  student: StudentDetail;
  onClose: () => void;
  onSaved: (updated: StudentDetail) => void;
};

export default function EditStudentDialog({ student, onClose, onSaved }: Props) {
  const [form, setForm] = useState({
    full_name: student.full_name,
    email: student.email,
    self_phone: student.self_phone ?? "",
    father_name: student.father_name,
    father_phone: student.father_phone ?? "",
    mother_name: student.mother_name,
    mother_phone: student.mother_phone ?? "",
    address: student.address,
    status: student.status as "ACTIVE" | "INACTIVE" | "BLOCKED",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const set =
    (key: keyof typeof form) =>
    (
      e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
      setForm((prev) => ({ ...prev, [key]: e.target.value }));
    };

  const save = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload: StudentUpdate = {
        full_name: form.full_name.trim(),
        email: form.email.trim(),
        self_phone: form.self_phone.trim() || null,
        father_name: form.father_name.trim(),
        father_phone: form.father_phone.trim() || null,
        mother_name: form.mother_name.trim(),
        mother_phone: form.mother_phone.trim() || null,
        address: form.address.trim(),
        status: form.status,
      };
      const updated = await updateStudent(student.id, payload);
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
      <div
        className="confirm-card"
        style={{ width: 520, maxWidth: "calc(100vw - 32px)" }}
      >
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

        <h3 className="confirm-title">Edit {student.full_name}</h3>
        <p className="confirm-subtitle">
          Update the student's details. Changes take effect immediately.
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
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Self phone</span>
            <input
              value={form.self_phone}
              onChange={set("self_phone")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Father's name</span>
            <input
              value={form.father_name}
              onChange={set("father_name")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Father's phone</span>
            <input
              value={form.father_phone}
              onChange={set("father_phone")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Mother's name</span>
            <input
              value={form.mother_name}
              onChange={set("mother_name")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Mother's phone</span>
            <input
              value={form.mother_phone}
              onChange={set("mother_phone")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            />
          </label>

          <label style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Address</span>
            <textarea
              value={form.address}
              onChange={set("address")}
              rows={2}
              style={{ padding: "8px 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5, resize: "vertical" }}
            />
          </label>

          <label style={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <span style={{ fontSize: 12.5, color: "#6b7488" }}>Status</span>
            <select
              value={form.status}
              onChange={set("status")}
              style={{ height: 38, padding: "0 10px", border: "1px solid #d5d9e6", borderRadius: 8, fontSize: 13.5 }}
            >
              <option value="ACTIVE">Active</option>
              <option value="INACTIVE">Inactive</option>
              <option value="BLOCKED">Blocked</option>
            </select>
          </label>
        </div>

        <div className="confirm-actions">
          <button
            type="button"
            className="confirm-btn-secondary"
            onClick={onClose}
            disabled={saving}
          >
            Cancel
          </button>
          <button
            type="button"
            className="confirm-btn-primary"
            onClick={save}
            disabled={saving}
          >
            {saving ? "Saving…" : "Save changes"}
          </button>
        </div>
      </div>
    </div>
  );
}