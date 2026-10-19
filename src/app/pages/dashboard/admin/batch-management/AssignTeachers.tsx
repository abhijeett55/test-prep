import { useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, assignTeachersToBatch } from "../../../../api/auth/admin/batches";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

export default function AssignTeachers() {
  const { data: batches, loading, reload } = useApi(() => listBatches());
  const { data: teachers } = useApi(() => listTeachers());
  
  const [selectedBatch, setSelectedBatch] = useState<string | null>(null);
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!selectedBatch) return;
    setSaving(true);
    try {
      await assignTeachersToBatch(selectedBatch, Array.from(selectedTeachers));
      alert("Teachers assigned successfully!");
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
        <div className="section-bar">Assign Teachers to Batch</div>
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
              <span style={{ fontWeight: 600 }}>Select Teachers</span>
              <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12, marginBottom: 24, maxHeight: 300, overflowY: "auto" }}>
                {teachers?.map(t => (
                  <label key={t.id} style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <input 
                      type="checkbox" 
                      checked={selectedTeachers.has(t.id)}
                      onChange={(e) => {
                        const next = new Set(selectedTeachers);
                        if (e.target.checked) next.add(t.id);
                        else next.delete(t.id);
                        setSelectedTeachers(next);
                      }} 
                    />
                    {t.name} ({t.email})
                  </label>
                ))}
              </div>
              <button className="confirm-btn-primary" onClick={handleSave} disabled={saving}>
                {saving ? "Saving…" : "Save Assignments"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}