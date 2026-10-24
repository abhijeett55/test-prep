import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, assignTeachersToBatch, getBatch } from "../../../../api/auth/admin/batches";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignTeachers() {
  const { data: allBatches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: allTeachers, loading: loadingTeachers } = useApi(() => listTeachers());
  const { data: myInstitute } = useApi(() => getMyInstitute());

  // Batch State
  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [batchSearch, setBatchSearch] = useState("");

  // Teacher State
  const [selectedTeachers, setSelectedTeachers] = useState<Set<string>>(new Set());
  const [teacherSearch, setTeacherSearch] = useState("");
  
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

  // Filter, Sort, and Search Teachers
  const filteredTeachers = useMemo(() => {
    if (!allTeachers || !myInstitute) return [];
    let result = allTeachers.filter(t => t.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.name.localeCompare(b.name));

    const q = teacherSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(
      (t) => t.name.toLowerCase().includes(q) || t.teacher_id.toLowerCase().includes(q)
    );
  }, [allTeachers, myInstitute, teacherSearch]);

  const handleBatchSelect = async (batchId: string) => {
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
      if (batchDetails && batchDetails.teacher_ids) {
        setSelectedTeachers(new Set(batchDetails.teacher_ids));
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

  const handleSelectAllTeachers = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedTeachers((prev) => {
        const next = new Set(prev);
        filteredTeachers.forEach((t) => next.add(t.id));
        return next;
      });
    } else {
      setSelectedTeachers((prev) => {
        const next = new Set(prev);
        filteredTeachers.forEach((t) => next.delete(t.id));
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
      await assignTeachersToBatch(selectedBatch, Array.from(selectedTeachers));
      setSuccess(true);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  const isAllTeachersSelected = 
    filteredTeachers.length > 0 && 
    filteredTeachers.every((t) => selectedTeachers.has(t.id));

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* Centered Header */}
        <div className="section-bar" style={{ textAlign: "center" }}>
          Assign Teachers to Batch
        </div>
        
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

          {/* ================= TEACHER SECTION ================= */}
          {selectedBatch && (
            <div style={{ animation: "fadeIn 0.3s ease" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Teachers</span>
                  
                  <label style={{ display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontSize: 13 }}>
                    <input 
                      type="checkbox" 
                      checked={isAllTeachersSelected} 
                      onChange={handleSelectAllTeachers} 
                    />
                    Select All
                  </label>
                  
                  <span style={{ fontSize: 13, color: "#6b7488", background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>
                    {selectedTeachers.size} selected
                  </span>
                </div>

                <div className="search-control" style={{ maxWidth: 300, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input
                    type="text"
                    placeholder="Search by teacher name or ID..."
                    value={teacherSearch}
                    onChange={(e) => setTeacherSearch(e.target.value)}
                  />
                </div>
              </div>

              {fetchingBatch || loadingTeachers ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>Loading teachers…</p>
              ) : filteredTeachers.length === 0 ? (
                <p style={{ color: "#6b7488", padding: "20px 0" }}>
                  {teacherSearch ? `No teachers match "${teacherSearch}"` : "No teachers found in this institute."}
                </p>
              ) : (
                <div className="default-table-wrap" style={{ marginBottom: 24, border: "1px solid #e6e9f0", borderRadius: 8, width: "100%" }}>
                  <table className="default-table" style={{ minWidth: "100%" }}>
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Teacher Name</th>
                        <th>Teacher ID</th>
                        <th>Employee Code</th>
                        <th>Qualification</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTeachers.map((t) => (
                        <tr 
                          key={t.id}
                          style={{ 
                            background: selectedTeachers.has(t.id) ? "#e8ebfd" : undefined, 
                            cursor: "pointer" 
                          }}
                          onClick={() => toggleTeacher(t.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input 
                              type="checkbox" 
                              checked={selectedTeachers.has(t.id)} 
                              onChange={() => toggleTeacher(t.id)} 
                            />
                          </td>
                          <td className="cell-name">{t.name}</td>
                          <td>{t.teacher_id}</td>
                          <td>{t.employee_code || "—"}</td>
                          <td>{t.qualification || "—"}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end" }}>
                <button 
                  className="confirm-btn-primary" 
                  onClick={handleSave} 
                  disabled={saving || fetchingBatch || loadingTeachers}
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