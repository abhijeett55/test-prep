import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useApi } from "../../../../hooks/useApi";
import { listBatches } from "../../../../api/auth/admin/batches";
import { createAnnouncement } from "../../../../api/auth/admin/announcements";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css"; 

export default function NewAnnouncement() {
  const navigate = useNavigate();
  const { data: batches } = useApi(() => listBatches());

  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
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
      {/* Header Section */}
      <div className="courses-header" style={{ marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 28, fontWeight: 700, color: "#1a2040", marginBottom: 8 }}>
            New Announcement
          </h1>
          <p style={{ fontSize: 15, color: "#6b7488" }}>
            Send a message to the entire institute or a specific batch
          </p>
        </div>
      </div>

      {/* Form Card */}
      <div 
        className="confirm-card" 
        style={{ 
          maxWidth: 800, 
          margin: 0, 
          padding: "40px 48px", 
          borderRadius: 16,
          boxShadow: "0 12px 40px rgba(23, 32, 51, 0.08)",
          animation: "fadeSlideUp 0.4s ease-out" // Smooth entrance
        }}
      >
        <form onSubmit={handleSubmit}>
          {error && (
            <div 
              style={{ 
                background: "#fdeaea", color: "#c62f2f", padding: "14px 20px", 
                borderRadius: 10, marginBottom: 24, fontSize: 14, fontWeight: 500
              }}
            >
              {error}
            </div>
          )}
          
          {/* Grid Layout for form fields */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "28px 32px" }}>
            
            {/* Title Field - Full Width */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 13, fontWeight: 600, color: "#1a2040" }}>Title *</label>
              <input 
                style={inputStyle}
                placeholder="e.g. Schedule Update for Final Exams"
                value={title} 
                onChange={(e) => setTitle(e.target.value)} 
                required 
              />
            </div>

            {/* Message Field - Full Width */}
            <div style={{ gridColumn: "1 / -1", display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#1a2040" }}>Message *</label>
              <textarea 
                style={{ ...inputStyle, minHeight: 160, resize: "vertical" }}
                placeholder="Write your announcement details here..."
                rows={6} 
                value={body} 
                onChange={(e) => setBody(e.target.value)} 
                required 
              />
            </div>

            {/* Audience Field */}
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              <label style={{ fontSize: 14, fontWeight: 600, color: "#1a2040" }}>Audience *</label>
              <select 
                style={inputStyle}
                value={scope} 
                onChange={(e) => setScope(e.target.value as "INSTITUTE" | "BATCH")}
              >
                <option value="INSTITUTE">Institute-wide</option>
                <option value="BATCH">Specific Batch</option>
              </select>
            </div>

            {/* Batch Selection (Conditional) */}
            {scope === "BATCH" && (
              <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeIn 0.3s ease-in" }}>
                <label style={{ fontSize: 14, fontWeight: 600, color: "#1a2040" }}>Select Batch *</label>
                <select 
                  style={inputStyle}
                  value={batchId} 
                  onChange={(e) => setBatchId(e.target.value)} 
                  required
                >
                  <option value="">Choose a batch…</option>
                  {batches?.map(b => (
                    <option key={b.id} value={b.id}>{b.batch_name}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", gap: 16, marginTop: 40, justifyContent: "flex-end" }}>
            <button 
              type="button" 
              onClick={() => navigate(-1)} 
              disabled={saving}
              style={{
                padding: "0 28px", height: 48, borderRadius: 10, border: "1px solid #d5d9e6",
                background: "#fff", color: "#1a2040", fontSize: 15, fontWeight: 600,
                cursor: saving ? "not-allowed" : "pointer", transition: "all 0.2s"
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.background = "#f7f8fc")}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.background = "#fff")}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={saving}
              style={{
                padding: "0 32px", height: 48, borderRadius: 10, border: "none",
                background: saving ? "#b3bfff" : "#3b4cca", color: "#fff", 
                fontSize: 15, fontWeight: 600, cursor: saving ? "not-allowed" : "pointer", 
                boxShadow: saving ? "none" : "0 4px 14px rgba(59, 76, 202, 0.3)",
                transition: "all 0.2s"
              }}
              onMouseEnter={(e) => !saving && (e.currentTarget.style.transform = "translateY(-1px)")}
              onMouseLeave={(e) => !saving && (e.currentTarget.style.transform = "none")}
            >
              {saving ? "Posting…" : "Post Announcement"}
            </button>
          </div>
        </form>
      </div>

      {/* Inline styles for the inputs to keep it smooth and big */}
      <style>{`
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </div>
  );
}

// Reusable style object for all inputs/selects
const inputStyle = {
  width: "100%",
  height: 52,
  padding: "0 16px",
  borderRadius: 10,
  border: "1px solid #d5d9e6",
  fontSize: 15,
  color: "#1a2040",
  background: "#fcfcfd",
  outline: "none",
  transition: "border-color 0.2s, box-shadow 0.2s, background 0.2s",
};