import { useMemo, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, assignTeachersToBatch, getBatch } from "../../../../api/auth/admin/batches";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../../api/client";
import type { TeacherRow } from "../../../../api/types";
import "./DefaultPage.css";

export default function MapTeachers() {
  const { data: batches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: allTeachers, loading: loadingTeachers } = useApi(() => listTeachers());

  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  
  const [fetchingBatch, setFetchingBatch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const teachers: TeacherRow[] = useMemo(() => allTeachers ?? [], [allTeachers]);

  const handleBatchChange = async (batchId: string) => {
    setSelectedBatch(batchId);
    setSuccess(false);
    setError(null);
    
    if (!batchId) {
      setSelectedTeachers(new Set());
      return;
    }

    setFetchingBatch(true);
    try {
      const batchDetails = await getBatch(batchId);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      if (batchDetails && (batchDetails as any).teacher_ids) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        setSelectedTeachers(new Set((batchDetails as any).teacher_ids));
      } else {
        setSelectedTeachers(new Set());
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFetchingBatch(false);
    }
  };

  const toggleTeacher = (id: string) => {
    setSelectedTeachers((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const handleSave = async () => {
    if (!selectedBatch) return;
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      await assignTeachersToBatch(selectedBatch, Array.from(selectedTeachers));
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar">Assign Teachers to Batch</div>
        
        <div style={{ padding: 24 }}>
          {error && (
            <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="perf-success" style={{ marginBottom: 16 }}>
              Teachers assigned successfully!
            </div>
          )}

          <label style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 24, maxWidth: 400 }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>Select Batch</span>
            <select 
              className="perf-input" 
              value={selectedBatch} 
              onChange={(e) => handleBatchChange(e.target.value)}
              disabled={loadingBatches}
            >
              <option value="">Choose a batch...</option>
              {batches?.map(b => (
                <option key={b.id} value={b.id}>
                  {b.batch_name} ({b.batch_code})
                </option>
              ))}
            </select>
          </label>

          {selectedBatch && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Teachers</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedTeachers.size} selected</span>
              </div>

              {fetchingBatch || loadingTeachers ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
              ) : (
                <div style={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", 
                  gap: 12, 
                  maxHeight: 400, 
                  overflowY: "auto",
                  marginBottom: 24,
                  paddingRight: 8
                }}>
                  {teachers.map((t) => (
                    <label 
                      key={t.id} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        padding: "10px 14px", 
                        border: `1px solid ${selectedTeachers.has(t.id) ? "#3b4cca" : "#e6e9f0"}`, 
                        borderRadius: 8, 
                        cursor: "pointer",
                        background: selectedTeachers.has(t.id) ? "#e8ebfd" : "#fff"
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedTeachers.has(t.id)} 
                        onChange={() => toggleTeacher(t.id)} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{t.name}</div>
                        <div style={{ fontSize: 12, color: "#6b7488" }}>{t.teacher_id}</div>
                      </div>
                    </label>
                  ))}
                  {teachers.length === 0 && (
                    <p style={{ color: "#6b7488" }}>No teachers found in this institute.</p>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingBatch || loadingTeachers}
                >
                  {saving ? "Saving…" : "Save Mappings"}
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}