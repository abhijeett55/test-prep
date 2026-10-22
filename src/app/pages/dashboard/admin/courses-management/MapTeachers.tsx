import { useMemo, useState } from "react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, mapStudentsToBatch, getBatch } from "../../../../api/auth/admin/batches";
import { listStudents } from "../../../../api/auth/admin/students";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "./DefaultPage.css";

export default function MapStudents() {
  const { data: allBatches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: allStudents, loading: loadingStudents } = useApi(() => listStudents());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  
  const [fetchingBatch, setFetchingBatch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // FIX: Filter students to only show those in this institute
  const students = useMemo(() => {
    if (!allStudents || !myInstitute) return [];
    return allStudents.filter(s => s.institute_id === myInstitute.id);
  }, [allStudents, myInstitute]);

  // FIX: Filter batches to only show those in this institute
  const batches = useMemo(() => {
    if (!allBatches || !myInstitute) return [];
    return allBatches.filter(b => b.institute_id === myInstitute.id);
  }, [allBatches, myInstitute]);

  const handleBatchChange = async (batchId: string) => {
    setSelectedBatch(batchId);
    setSuccess(false);
    setError(null);
    
    if (!batchId) {
      setSelectedStudents(new Set());
      return;
    }

    setFetchingBatch(true);
    try {
      const batchDetails = await getBatch(batchId);
      if (batchDetails && batchDetails.student_ids) {
        setSelectedStudents(new Set(batchDetails.student_ids));
      } else {
        setSelectedStudents(new Set());
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFetchingBatch(false);
    }
  };

  const toggleStudent = (id: string) => {
    setSelectedStudents((prev) => {
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
      await mapStudentsToBatch(selectedBatch, Array.from(selectedStudents));
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
        <div className="section-bar">Map Students to Batch</div>
        
        <div style={{ padding: 24 }}>
          {error && (
            <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>
              {error}
            </div>
          )}
          
          {success && (
            <div className="perf-success" style={{ marginBottom: 16 }}>
              Students mapped successfully!
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
              {batches.map(b => (
                <option key={b.id} value={b.id}>
                  {b.batch_name} ({b.batch_code})
                </option>
              ))}
            </select>
          </label>

          {selectedBatch && (
            <>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>Select Students</span>
                <span style={{ fontSize: 13, color: "#6b7488" }}>{selectedStudents.size} selected</span>
              </div>

              {fetchingBatch || loadingStudents ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading students…</p>
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
                  {students.map((s) => (
                    <label 
                      key={s.id} 
                      style={{ 
                        display: "flex", 
                        alignItems: "center", 
                        gap: 10, 
                        padding: "10px 14px", 
                        border: `1px solid ${selectedStudents.has(s.id) ? "#3b4cca" : "#e6e9f0"}`, 
                        borderRadius: 8, 
                        cursor: "pointer",
                        background: selectedStudents.has(s.id) ? "#e8ebfd" : "#fff"
                      }}
                    >
                      <input 
                        type="checkbox" 
                        checked={selectedStudents.has(s.id)} 
                        onChange={() => toggleStudent(s.id)} 
                      />
                      <div>
                        <div style={{ fontWeight: 600, fontSize: 13.5 }}>{s.full_name}</div>
                        <div style={{ fontSize: 12, color: "#6b7488" }}>{s.student_id}</div>
                      </div>
                    </label>
                  ))}
                  {students.length === 0 && (
                    <p style={{ color: "#6b7488" }}>No students found in this institute.</p>
                  )}
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingBatch || loadingStudents}
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