import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, mapStudentsToBatch } from "../../../../api/auth/admin/batches";
import { listStudents } from "../../../../api/auth/admin/students";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

export default function MapStudents() {
  const { data: batches, loading, reload } = useApi(() => listBatches());
  const { data: students } = useApi(() => listStudents());
  
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedBatch) return;
    setSaving(true);
    try {
      await mapStudentsToBatch(selectedBatch, Array.from(selectedStudents));
      alert("Students mapped successfully!");
      setSelectedBatch(null);
      reload();
    } catch (err) {
      alert(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="default-page">Loading…</div>;

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar">Map Students to Batch</div>
        <div style={{ padding: 24 }}>
          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24 }}>
            <span style={{ fontWeight: 600 }}>Select Batch</span>
            <select 
              className="courses-select" 
              value={selectedBatch || ""} 
              onChange={(e) => setSelectedBatch(e.target.value)}
            >
              <option value="">Choose a batch…</option>
              {batches?.map(b => (
                <option key={b.id} value={b.id}>{b.batch_name} ({b.batch_code})</option>
              ))}
            </select>
          </label>

          {selectedBatch && (
            <>
              <span style={{ fontWeight: 600 }}>Select Students</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, marginBottom: 24, maxHeight: 300, overflowY: "auto" }}>
                {students?.map(s => (
                  <label key={s.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input 
                      type="checkbox" 
                      checked={selectedStudents.has(s.id)}
                      onChange={(e) => {
                        const next = new Set(selectedStudents);
                        if (e.target.checked) next.add(s.id);
                        else next.delete(s.id);
                        setSelectedStudents(next);
                      }} 
                    />
                    {s.full_name} ({s.email})
                  </label>
                ))}
              </div>
              <button className="confirm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Mappings"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}