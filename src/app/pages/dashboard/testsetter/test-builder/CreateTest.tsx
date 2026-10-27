import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTestBuilderOptions, createTest, listApprovedPapers } from "../../../../api/auth/testsetter/tests";
import type { TestBuilderOptions } from "../../../../api/types";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

interface ApprovedPaper {
  id: string;
  title: string;
  duration_minutes: number;
  course_id: string | null;
  batch_id: string | null;
  subject_id: string | null;
}

export default function CreateTest() {
  const navigate = useNavigate();
  const [options, setOptions] = useState<TestBuilderOptions | null>(null);
  const [papers, setPapers] = useState<ApprovedPaper[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    paper_id: "",
    course_id: "",
    batch_id: "",
    subject_ids: [] as string[],
    title: "",
    duration_minutes: 60,
    scheduled_at: "",
  });

  useEffect(() => {
    Promise.all([getTestBuilderOptions(), listApprovedPapers()])
      .then(([opts, approvedPapers]) => {
        setOptions(opts);
        setPapers(approvedPapers);
      })
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, []);

  // When a paper is selected, auto-fill the form!
  const handlePaperSelect = (paperId: string) => {
    if (!paperId) {
      setFormData({ ...formData, paper_id: "", title: "", duration_minutes: 60 });
      return;
    }
    const selected = papers.find(p => p.id === paperId);
    if (selected) {
      setFormData({
        ...formData,
        paper_id: selected.id,
        title: selected.title,
        duration_minutes: selected.duration_minutes,
        course_id: selected.course_id || "",
        batch_id: selected.batch_id || "",
        subject_ids: selected.subject_id ? [selected.subject_id] : []
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.paper_id) {
      setError("Please select a Question Paper.");
      return;
    }
    
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...formData,
        scheduled_at: formData.scheduled_at ? new Date(formData.scheduled_at).toISOString() : null,
      };
      
      const newTest = await createTest(payload);
      navigate(`/dashboard/testsetter/test-builder/sections-marking-scheme?testId=${newTest.id}`);
    } catch (err: unknown) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="default-page">Loading options...</div>;

  const availableBatches = options?.batches.filter(
    (b) => !formData.course_id || b.course_id === formData.course_id
  ) || [];

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>
          Create Test from Approved Paper
        </div>

        <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* 1. SELECT APPROVED PAPER */}
            <div className="form-group full-width">
              <label>Select Approved Question Paper *</label>
              <select
                required
                value={formData.paper_id}
                onChange={(e) => handlePaperSelect(e.target.value)}
                style={{ fontWeight: 600 }}
              >
                <option value="">-- Select a Paper --</option>
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>{p.title}</option>
                ))}
              </select>
              <p style={{ fontSize: 12, color: "#6b7488", marginTop: 4 }}>
                If you don't see your paper, go to the "Pending Review" tab and approve it first.
              </p>
            </div>

            {/* 2. AUTO-FILLED DETAILS (Read Only) */}
            {formData.paper_id && (
              <div style={{ animation: "fadeIn 0.3s ease" }}>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Paper Title</label>
                    <input disabled value={formData.title} />
                  </div>
                  <div className="form-group">
                    <label>Duration (Minutes)</label>
                    <input disabled type="number" value={formData.duration_minutes} />
                  </div>
                </div>

                <div className="form-grid" style={{ marginTop: 16 }}>
                  <div className="form-group">
                    <label>Course</label>
                    <select disabled value={formData.course_id}>
                      <option value="">N/A</option>
                      {options?.courses.map((c) => (
                        <option key={c.id} value={c.id}>{c.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Batch</label>
                    <select disabled value={formData.batch_id}>
                      <option value="">N/A</option>
                      {availableBatches.map((b) => (
                        <option key={b.id} value={b.id}>{b.name}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* 3. SCHEDULE & SUBMIT */}
            <div className="form-group full-width" style={{ marginTop: 16 }}>
              <label>Scheduled Date & Time</label>
              <input
                type="datetime-local"
                value={formData.scheduled_at}
                onChange={(e) => setFormData({ ...formData, scheduled_at: e.target.value })}
              />
            </div>

            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <button type="button" className="confirm-btn-secondary" style={{ width: "auto", padding: "0 24px" }} onClick={() => navigate(-1)}>
                Cancel
              </button>
              <button type="submit" disabled={saving || !formData.paper_id} className="confirm-btn-primary" style={{ width: "auto", padding: "0 32px" }}>
                {saving ? "Creating..." : "Create Test & Configure Sections"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}