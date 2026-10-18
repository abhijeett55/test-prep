import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createSubject, type SubjectCreate } from "../../../../api/auth/admin/subjects";
import { errorMessage } from "../../../../api/client";
import "../student-management/Performance.css";

export default function CreateSubjectPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SubjectCreate>({ 
    subject_name: "", 
    subject_code: "" 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await createSubject(formData);
      // Redirect back to the "All Subjects" page after creation
      navigate("/dashboard/admin/subjects/all");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header">
        <div>
          <h1>Create Subject</h1>
          <p>Add a new subject to your institute</p>
        </div>
      </div>

      <div style={{ maxWidth: '500px', background: 'white', padding: '24px', borderRadius: '8px', border: '1px solid #e5e7eb' }}>
        {error && (
          <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: '16px' }}>
            {error}
          </div>
        )}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Subject Name</label>
            <input
              required
              type="text"
              placeholder="e.g. Mathematics"
              value={formData.subject_name}
              onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
              className="perf-input"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          <div>
            <label style={{ display: 'block', marginBottom: '4px', fontSize: '14px', fontWeight: 500 }}>Subject Code</label>
            <input
              required
              type="text"
              placeholder="e.g. MATH101"
              value={formData.subject_code}
              onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
              className="perf-input"
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button 
              type="button" 
              onClick={() => navigate("/dashboard/admin/subjects/all")} 
              className="perf-btn danger-outline"
            >
              Cancel
            </button>
            <button type="submit" disabled={loading} className="perf-btn">
              {loading ? "Saving..." : "Create Subject"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}