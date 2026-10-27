import { useState, useMemo } from "react";
import { Search } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listBatches, getBatch } from "../../../../api/auth/admin/batches";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import { errorMessage } from "../../../../api/client";
import { client } from "../../../../api/client";
import "../DefaultPage.css";

export default function AssignSubjectsToBatch() {
  const { data: allBatches, loading: loadingBatches } = useApi(() => listBatches());
  const { data: subjects } = useApi(() => listSubjects({}));
  const { data: myInstitute } = useApi(() => getMyInstitute());

  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedSubjects, setSelectedSubjects] = useState<Set<string>>(new Set());
  
  const [batchSearch, setBatchSearch] = useState("");
  const [subjectSearch, setSubjectSearch] = useState("");
  
  const [fetchingBatch, setFetchingBatch] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Filter Batches
  const filteredBatches = useMemo(() => {
    if (!allBatches || !myInstitute) return [];
    let result = allBatches.filter(b => b.institute_id === myInstitute.id);
    result = result.sort((a, b) => a.batch_name.localeCompare(b.batch_name));
    const q = batchSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(b => b.batch_name.toLowerCase().includes(q) || b.batch_code.toLowerCase().includes(q));
  }, [allBatches, myInstitute, batchSearch]);

  // Filter Subjects
  const filteredSubjects = useMemo(() => {
    if (!subjects) return [];
    const result = [...subjects].sort((a, b) => a.subject_name.localeCompare(b.subject_name));
    const q = subjectSearch.trim().toLowerCase();
    if (!q) return result;
    return result.filter(s => s.subject_name.toLowerCase().includes(q) || s.subject_code.toLowerCase().includes(q));
  }, [subjects, subjectSearch]);

  const handleBatchSelect = async (batchId: string) => {
    setSelectedBatch(batchId);
    setSuccess(false);
    setError(null);
    
    if (!batchId) {
      setSelectedSubjects(new Set());
      return;
    }

    setFetchingBatch(true);
    try {
      // Fetch the batch details to see which subjects are already mapped
      const batchDetails = await getBatch(batchId);
      if (batchDetails && batchDetails.subject_ids) {
        setSelectedSubjects(new Set(batchDetails.subject_ids));
      } else {
        setSelectedSubjects(new Set());
      }
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setFetchingBatch(false);
    }
  };

  const toggleSubject = (id: string) => {
    setSelectedSubjects((prev) => {
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
      await client.post(`/batches/${selectedBatch}/subjects`, {
        subject_ids: Array.from(selectedSubjects)
      });
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
        <div className="section-bar" style={{ textAlign: "center" }}>
          Map Subjects to Batch
        </div>
        
        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Subjects mapped successfully!</div>}

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            
            {/* BATCH SECTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <span style={{ fontWeight: 600, fontSize: 14 }}>1. Select Batch</span>
                <div className="search-control" style={{ maxWidth: 200, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input type="text" placeholder="Search batch..." value={batchSearch} onChange={(e) => setBatchSearch(e.target.value)} />
                </div>
              </div>

              <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, maxHeight: 400, overflowY: "auto" }}>
                <table className="default-table">
                  <thead>
                    <tr>
                      <th style={{ width: 40 }}></th>
                      <th>Batch Name</th>
                      <th>Code</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loadingBatches ? (
                      <tr><td colSpan={3} style={{ textAlign: "center", padding: 20 }}>Loading...</td></tr>
                    ) : filteredBatches.map((b) => (
                      <tr 
                        key={b.id} 
                        style={{ background: selectedBatch === b.id ? "#e8ebfd" : undefined, cursor: "pointer" }}
                        onClick={() => handleBatchSelect(b.id)}
                      >
                        <td><input type="radio" name="batch" checked={selectedBatch === b.id} readOnly /></td>
                        <td className="cell-name">{b.batch_name}</td>
                        <td>{b.batch_code}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* SUBJECT SECTION */}
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>2. Select Subjects</span>
                  <span style={{ fontSize: 12, background: "#e6e9f0", padding: "2px 8px", borderRadius: 12 }}>{selectedSubjects.size}</span>
                </div>
                <div className="search-control" style={{ maxWidth: 200, margin: 0 }}>
                  <Search size={15} strokeWidth={2} />
                  <input type="text" placeholder="Search subject..." value={subjectSearch} onChange={(e) => setSubjectSearch(e.target.value)} />
                </div>
              </div>

              {!selectedBatch ? (
                <div style={{ padding: 24, textAlign: "center", background: "#fafbfd", border: "1px dashed #e6e9f0", borderRadius: 8, color: "#6b7488" }}>
                  Select a batch on the left to start mapping subjects.
                </div>
              ) : fetchingBatch ? (
                <div style={{ padding: 24, textAlign: "center", color: "#6b7488" }}>Loading mappings...</div>
              ) : (
                <div className="default-table-wrap" style={{ border: "1px solid #e6e9f0", borderRadius: 8, maxHeight: 400, overflowY: "auto" }}>
                  <table className="default-table">
                    <thead>
                      <tr>
                        <th style={{ width: 40 }}></th>
                        <th>Subject Name</th>
                        <th>Code</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubjects.map((s) => (
                        <tr 
                          key={s.id} 
                          style={{ background: selectedSubjects.has(s.id) ? "#e8ebfd" : undefined, cursor: "pointer" }}
                          onClick={() => toggleSubject(s.id)}
                        >
                          <td onClick={(e) => e.stopPropagation()}>
                            <input type="checkbox" checked={selectedSubjects.has(s.id)} onChange={() => toggleSubject(s.id)} />
                          </td>
                          <td className="cell-name">{s.subject_name}</td>
                          <td>{s.subject_code}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>

          {/* Action Button */}
          <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 24 }}>
            <button 
              className="confirm-btn-primary" 
              onClick={handleSave} 
              disabled={saving || !selectedBatch || fetchingBatch}
              style={{ width: "auto", minWidth: "200px", padding: "0 32px" }}
            >
              {saving ? "Saving…" : "Save Mappings"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}