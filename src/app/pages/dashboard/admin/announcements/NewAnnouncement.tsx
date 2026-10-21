import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { listBatches } from "../../../../api/auth/admin/batches";
import { createAnnouncement } from "../../../../api/auth/admin/announcements";
import { errorMessage } from "../../../../api/client";
// Note: make sure your CSS path is correct for this file location
import "../courses-management/DefaultPage.css"; 

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const { data: batches } = useApi(() => listBatches());

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  // 1. Define the exact type here
  const [scope, setScope] = useState<"INSTITUTE" | "BATCH">("INSTITUTE");
  const [batchId, setBatchId] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !body) return;
    if (scope === "BATCH" && !batchId) {
      setError("Please select a batch.");
      return;
    }

    setSaving(true);
    setError(null);
    try {
      await createAnnouncement({
        title,
        body,
        scope,
        batch_id: scope === "BATCH" ? batchId : null,
      });
      navigate(-1);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>New Announcement</h1>
          <p>Send a message to the entire institute or a specific batch</p>
        </div>
      </div>

      <div className="confirm-card" style={{ maxWidth: 720, margin: 0 }}>
        <form onSubmit={handleSubmit}>
          {error && <p className="detect-error" style={{ marginBottom: 16 }}>{error}</p>}
          
          <div className="courses-form-grid">
            <label className="courses-field full">
              <span>Title *</span>
              <input 
                className="courses-input" 
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </label>

            <label className="courses-field full">
              <span>Message *</span>
              <textarea 
                className="courses-textarea" 
                rows={5} 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                required 
              />
            </label>

            <label className="courses-field">
              <span>Audience *</span>
              {/* 2. Cast the string to the exact union type */}
              <select 
                className="courses-select" 
                value={scope} 
                onChange={(e) => setScope(e.target.value as "INSTITUTE" | "BATCH")}
              >
                <option value="INSTITUTE">Institute-wide</option>
                <option value="BATCH">Specific Batch</option>
              </select>
            </label>

            {scope === "BATCH" && (
              <label className="courses-field">
                <span>Select Batch *</span>
                <select 
                  className="courses-select" 
                  value={batchId} 
                  onChange={(e) => setBatchId(e.target.value)} 
                  required
                >
                  <option value="">Choose a batch…</option>
                  {batches?.map(b => (
                    <option key={b.id} value={b.id}>{b.batch_name}</option>
                  ))}
                </select>
              </label>
            )}
          </div>

          <div className="confirm-actions" style={{ marginTop: 24 }}>
            <button 
              type="button" 
              className="confirm-btn-secondary" 
              onClick={() => navigate(-1)} 
              disabled={saving}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              className="confirm-btn-primary" 
              disabled={saving}
            >
              {saving ? "Posting…" : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}