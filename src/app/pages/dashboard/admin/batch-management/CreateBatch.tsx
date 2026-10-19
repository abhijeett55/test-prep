import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { createBatch } from "../../../../api/auth/admin/batches";
import { listCourses } from "../../../../api/auth/admin/courses";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

export default function CreateBatch() {
  const navigate = useNavigate();
  const { data: courses } = useApi(() => listCourses());
  
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    
    const form = e.currentTarget;
    const name = (form.elements.namedItem("name") as HTMLInputElement).value;
    const code = (form.elements.namedItem("code") as HTMLInputElement).value;
    const courseId = (form.elements.namedItem("course") as HTMLSelectElement).value;

    try {
      await createBatch({
        institute_id: courses?.[0]?.institute_id || "", // Automatically grabs from course
        course_id: courseId,
        batch_name: name,
        batch_code: code,
      });
      navigate("/dashboard/admin/batch-management/all");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="confirm-card" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h3 className="confirm-title">Create Batch</h3>
        <p className="confirm-subtitle">Add a new batch to a course.</p>

        {error && <p className="detect-error" style={{ marginBottom: 16 }}>{error}</p>}

        <form onSubmit={handleSubmit} className="courses-form-grid">
          <label className="courses-field full">
            <span>Batch Name *</span>
            <input name="name" className="courses-input" required placeholder="e.g. Class 10 - Morning" />
          </label>
          
          <label className="courses-field full">
            <span>Batch Code *</span>
            <input name="code" className="courses-input" required placeholder="e.g. C10-MRN-01" />
          </label>

          <label className="courses-field full">
            <span>Course *</span>
            <select name="course" className="courses-select" required>
              <option value="">Select a course…</option>
              {courses?.map((c) => (
                <option key={c.id} value={c.id}>{c.course_name} ({c.course_code})</option>
              ))}
            </select>
          </label>

          <div className="confirm-actions" style={{ marginTop: 16 }}>
            <button type="button" className="confirm-btn-secondary" onClick={() => navigate(-1)} disabled={saving}>
              Cancel
            </button>
            <button type="submit" className="confirm-btn-primary" disabled={saving}>
              {saving ? "Creating…" : "Create Batch"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}