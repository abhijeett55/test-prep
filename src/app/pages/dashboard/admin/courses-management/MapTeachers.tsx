import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, mapStudentsToBatch, getBatch } from "../../../../api/auth/admin/batches";
import { listStudents } from "../../../../api/auth/admin/students";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function MapStudents() {
  const { data: allBatches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: allStudents, loading: loadingStudents } = useApi(() => listStudents());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  // Batch State
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [batchSearch, setBatchSearch] = useState("");

  // Student State
  const [selectedStudents, setSelectedStudents] = useState<Set<string>>(new Set());
  const [studentSearch, setStudentSearch] = useState("");
  
  const [fetchingBatch, setFetchingBatch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter, Sort, and Search Batches
  const filteredBatches = useMemo(() => {
    if (!allBatches || !myInstitute) return [];
    let result = allBatches.filter(b => b.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.batch_name.localeCompare(b.batch_name));

    const q = batchSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (b) => b.batch_name.toLowerCase().includes(q) || b.batch_code.toLowerCase().includes(q)
    );
  }, [allBatches, myInstitute, batchSearch]);

  // Filter, Sort, and Search Students
  const filteredStudents = useMemo(() => {
    if (!allStudents || !myInstitute) return [];
    let result = allStudents.filter(s => s.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.full_name.localeCompare(b.full_name));

    const q = studentSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (s) => s.full_name.toLowerCase().includes(q) || s.student_id.toLowerCase().includes(q)
    );
  }, [allStudents, myInstitute, studentSearch]);

  const handleBatchSelect = async (batchId: string) => {
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

  const handleSelectAllStudents = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedStudents((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.add(s.id));
        return next;
      });
    } else {
      setSelectedStudents((prev) => {
        const next = new Set(prev);
        filteredStudents.forEach((s) => next.delete(s.id));
        return next;
      });
    }
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

  const isAllSelected = 
    filteredStudents.length > 0 && 
    filteredStudents.every((s) => selectedStudents.has(s.id));

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* Centered Header */}
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Students to Batch
        </div>
        
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

          {/* ================= BATCH SECTION ================= */}
          <div style={{ marginBottom: 40 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Batch</span>
                {selectedBatch && (
                  <span style={{ fontSize: 13, color: "#1a8f5a", background: "#e5f7ee", padding: "2px 8px", borderRadius: 12, fontWeight: 500 }}>
                    1 selected
                  </span>
                )}
              </div>

              <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                <Search size={15} strokeWidth={2} />
                <input
                  type="text"
                  placeholder="Search by batch name or code..."
                  value={batchSearch}
                  onChange={(e) => setBatchSearch(e.target.value)}
                />
              </div>
            </div>

            {loadingBatches ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading batches…</p>
            ) : filteredBatches.length === 0 ? (
              <p style={{ color: "#6b7488", padding: "20px 0" }}>
                {batchSearch ? `No batches match "${batchSearch}"` : "No batches found."}
              </p>
            ) : (
              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, width: "100%" }}>
                <table className="default-table" style={{ minWidth: "100%" }}>
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Batch Name</th>
                      <th>Batch Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBatches.map((b) => (
                      <tr 
                        key={b.id} 
                        style={{ 
                          background: selectedBatch === b.id ? "#e8ebfd" : undefined, 
                          cursor: "pointer" 
                        }}
                        onClick={() => handleBatchSelect(b.id)}
                      >
                        <td onClick={(e) => e.stopPropagation()}>
                          <input 
                            type="radio" 
                            name="batchSelection"
                            checked={selectedBatch === b.id} 
                            onChange={() => handleBatchSelect(b.id)} 
                          />
                        </td>
                        <td className="cell-name">{b.batch_name}</td>
                        <td>{b.batch_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* ================= STUDENT SECTION ================= */}
          {selectedBatch && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Students</span>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input 
                      type="checkbox" 
                      checked={isAllSelected} 
                      onChange={handleSelectAllStudents} 
                    />
                    Select All
                  </label>
                  
                  <span style={{ fontSize: 13, color: "#6b7488", background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>
                    {selectedStudents.size} selected
                  </span>
                </div>

                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search by student name or ID..."
                    value={studentSearch}
                    onChange={(e) => setStudentSearch(e.target.value)}
                  />
                </div>
              </div>

              {fetchingBatch || loadingStudents ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading students…</p>
              ) : filteredStudents.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>
                  {studentSearch ? `No students match "${studentSearch}"` : "No students found in this institute."}
                </p>
              ) : (
                <div className="default-table-wrap" style={{ marginBottom: 24, border: "1px solid #e6e9f0", borderRadius: 8, width: "100%" }}>
                  <table className="default-table" style={{ minWidth: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Student Name</th>
                        <th>Student ID</th>
                        <th>Batch</th>
                        <th>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredStudents.map((s) => (
                        <tr 
                          key={s.id} 
                          style={{ 
                            background: selectedStudents.has(s.id) ? "#e8ebfd" : undefined, 
                            cursor: "pointer" 
                          }}
                          onClick={() => toggleStudent(s.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedStudents.has(s.id)} 
                              onChange={() => toggleStudent(s.id)} 
                            />
                          </td>
                          <td className="cell-name">{s.full_name}</td>
                          <td>{s.student_id}</td>
                          <td>{s.batch_name || "—"}</td>
                          <td>{s.status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Save Button fixed width */}
              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingBatch || loadingStudents}
                  style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}
                >
                  {saving ? "Saving…" : "Save Mappings"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}