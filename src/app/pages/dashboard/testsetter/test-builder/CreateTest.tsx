import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { 
  getTestBuilderOptions, 
  createTest 
} from "../../../../api/auth/testsetter/tests";
import type { TestBuilderOptions, CreateTestPayload } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";

export default function CreateTest() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<TestBuilderOptions | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<CreateTestPayload>({
    course_id: "",
    batch_id: "",
    subject_id: "",
    teacher_id: "",
    title: "",
    description: "",
    duration_minutes: 60,
  });

  useEffect(() => {
    getTestBuilderOptions()
      .then(setOptions)
      .catch(() => setError("Failed to load options"))
      .finally(() => setLoading(false));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const newTest = await createTest(formData);
      // Redirect to Sections page with the new test ID
      navigate(`/dashboard/testsetter/test-builder/sections-marking-scheme?testId=${newTest.id}`);
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div>Loading options...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  // Filter batches based on selected course
  const availableBatches = options?.batches.filter(
    (b) => !formData.course_id || b.course_id === formData.course_id
  ) || [];

  return (
    <div className="page-container">
      <h1>Create Test</h1>
      <form onSubmit={handleSubmit} className="form-layout">
        
        {/* Cascading Dropdowns */}
        <div className="form-row">
          <div className="field">
            <label>Course</label>
            <select
              required
              value={formData.course_id}
              onChange={(e) => setFormData({ ...formData, course_id: e.target.value, batch_id: "" })}
            >
              <option value="">Select Course</option>
              {options?.courses.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Batch</label>
            <select
              required
              value={formData.batch_id}
              onChange={(e) => setFormData({ ...formData, batch_id: e.target.value })}
              disabled={!formData.course_id}
            >
              <option value="">Select Batch</option>
              {availableBatches.map((b) => (
                <option key={b.id} value={b.id}>{b.name}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="form-row">
          <div className="field">
            <label>Subject</label>
            <select
              required
              value={formData.subject_id}
              onChange={(e) => setFormData({ ...formData, subject_id: e.target.value })}
            >
              <option value="">Select Subject</option>
              {options?.subjects.map((s) => (
                <option key={s.id} value={s.id}>{s.name}</option>
              ))}
            </select>
          </div>

          <div className="field">
            <label>Teacher</label>
            <select
              required
              value={formData.teacher_id}
              onChange={(e) => setFormData({ ...formData, teacher_id: e.target.value })}
            >
              <option value="">Select Teacher</option>
              {options?.teachers.map((t) => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Test Details */}
        <div className="field">
          <label>Test Title</label>
          <input
            required
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g. Midterm Examination"
          />
        </div>

        <div className="field">
          <label>Duration (Minutes)</label>
          <input
            required
            type="number"
            min="1"
            value={formData.duration_minutes}
            onChange={(e) => setFormData({ ...formData, duration_minutes: Number(e.target.value) })}
          />
        </div>

        <div className="form-actions">
          <button type="button" onClick={() => navigate(-1)}>Cancel</button>
          <button type="submit" disabled={saving} className="primary">
            {saving ? "Creating..." : "Create & Add Sections"}
          </button>
        </div>
      </form>
    </div>
  );
}