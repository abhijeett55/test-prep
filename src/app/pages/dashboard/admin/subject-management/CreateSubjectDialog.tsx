import { useState } from "react";
import { createSubject, type SubjectCreate } from "../../../../api/auth/admin/subjects";
import { errorMessage } from "../../../../api/client";

interface Props {
  onClose: () => void;
  onSuccess: () => void;
}

export default function CreateSubjectDialog({ onClose, onSuccess }: Props) {
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
      onSuccess();
      onClose();
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dialog-overlay">
      <div className="dialog-content" style={{ padding: '24px', background: 'white', borderRadius: '8px' }}>
        <h2>Create Subject</h2>
        {error && <p style={{ color: 'red', fontSize: '14px', marginBottom: '10px' }}>{error}</p>}
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <input
            required
            type="text"
            placeholder="Subject Name (e.g. Mathematics)"
            value={formData.subject_name}
            onChange={(e) => setFormData({ ...formData, subject_name: e.target.value })}
            className="perf-input"
          />
          <input
            required
            type="text"
            placeholder="Subject Code (e.g. MATH101)"
            value={formData.subject_code}
            onChange={(e) => setFormData({ ...formData, subject_code: e.target.value })}
            className="perf-input"
          />
          
          <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '16px' }}>
            <button type="button" onClick={onClose} className="perf-btn danger-outline">
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