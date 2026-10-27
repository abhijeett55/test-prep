import { useEffect, useState } from "react";
import { Edit3, Save, ArrowLeft, Trash2, FileText } from "lucide-react";
import { 
  listPendingPapers, 
  getPaperQuestions, 
  updateQuestion, 
  approvePaper,
  deletePaper,
  deleteQuestion,
} from "../../../../api/auth/testsetter/questions";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export interface PaperPending {
  id: string;
  title: string;
  questions_count: number;
  total_marks: number;
}

export interface QuestionData {
  id: string;
  question_text: string;
  options: string[];
  correct_answer: string;
}

export default function PendingReview() {
  const [papers, setPapers] = useState<PaperPending[]>([]);
  const [selectedPaper, setSelectedPaper] = useState<PaperPending | null>(null);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<QuestionData>>({});

  const fetchPapers = async () => {
    try {
      const data = await listPendingPapers();
      setPapers(data);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { fetchPapers(); }, []);

  const handleOpenPaper = async (paper: PaperPending) => {
    setSelectedPaper(paper);
    setLoading(true);
    try {
      const qData = await getPaperQuestions(paper.id);
      setQuestions(qData);
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setLoading(false);
    }
  };

  const saveQuestion = async (id: string) => {
    if (!selectedPaper) return;
    try {
      await updateQuestion(id, editForm);
      setEditingId(null);
      const qData = await getPaperQuestions(selectedPaper.id);
      setQuestions(qData);
    } catch (err) {
      alert("Failed to save: " + errorMessage(err));
    }
  };

  const handleApprovePaper = async () => {
    if (!selectedPaper) return;
    if (!window.confirm("Approve this entire paper? It will be available for tests.")) return;
    try {
      await approvePaper(selectedPaper.id);
      setSelectedPaper(null);
      fetchPapers();
    } catch (err) {
      alert("Failed to approve paper: " + errorMessage(err));
    }
  };

  const handleDeletePaper = async () => {
    if (!selectedPaper) return;
    if (!window.confirm("Are you sure you want to delete this entire paper and all its questions? This cannot be undone.")) return;
    try {
      await deletePaper(selectedPaper.id);
      setSelectedPaper(null);
      fetchPapers();
    } catch (err) {
      alert("Failed to delete paper: " + errorMessage(err));
    }
  };

  const handleDeleteQuestion = async (id: string) => {
    if (!selectedPaper) return;
    if (!window.confirm("Delete this question?")) return;
    try {
      await deleteQuestion(id);
      const qData = await getPaperQuestions(selectedPaper.id);
      setQuestions(qData);
    } catch (err) {
      alert("Failed to delete question: " + errorMessage(err));
    }
  };

  if (loading) return <div className="default-page">Loading...</div>;

  return (
    <div className="default-page">
      <div className="default-panel">
        
        {/* HEADER */}
        <div className="section-bar" style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          
          {/* FIXED: Back Button UI */}
          <div>
            {selectedPaper ? (
              <button 
                onClick={() => setSelectedPaper(null)} 
                style={{ background: "transparent", border: "none", color: "white", display: "flex", alignItems: "center", gap: 6, cursor: "pointer", fontWeight: 600 }}
              >
                <ArrowLeft size={18} /> Back to Papers
              </button>
            ) : (
              <span>Pending Question Papers</span>
            )}
          </div>

          {selectedPaper && <span style={{ fontWeight: 700, fontSize: 16 }}>{selectedPaper.title}</span>}

          {/* ACTION BUTTONS */}
          <div style={{ display: "flex", gap: 12 }}>
            {selectedPaper && (
              <>
                <button onClick={handleDeletePaper} className="perf-btn" style={{ background: "#c62f2f", display: "flex", alignItems: "center", gap: 6 }}>
                  <Trash2 size={16} /> Delete Paper
                </button>
                <button onClick={handleApprovePaper} className="perf-btn" style={{ background: "#1a9a4a", display: "flex", alignItems: "center", gap: 6 }}>
                  <FileText size={16} /> Approve Paper
                </button>
              </>
            )}
          </div>
        </div>

        <div style={{ padding: 24 }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}

          {/* VIEW 1: LIST OF PAPERS */}
          {!selectedPaper ? (
            papers.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7488", padding: 40 }}>No papers pending review.</p>
            ) : (
              <table className="default-table">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Questions</th>
                    <th>Total Marks</th>
                    <th className="col-actions">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {papers.map(p => (
                    <tr key={p.id}>
                      <td className="cell-name">{p.title}</td>
                      <td>{p.questions_count}</td>
                      <td>{p.total_marks}</td>
                      <td className="col-actions">
                        <button onClick={() => handleOpenPaper(p)} className="perf-btn">Review Questions</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )
          ) : (
            /* VIEW 2: QUESTIONS INSIDE THE PAPER */
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              
              {/* FIXED: Empty State if 0 questions parsed */}
              {questions.length === 0 ? (
                <div style={{ textAlign: "center", padding: 60, background: "#fafbfd", borderRadius: 12, border: "1px dashed #d5d9e6" }}>
                  <FileText size={48} color="#a3aabb" style={{ margin: "0 auto 16px" }} />
                  <h3 style={{ margin: "0 0 8px", color: "#1a2040" }}>No questions found in this paper</h3>
                  <p style={{ color: "#6b7488", marginBottom: 24 }}>The parser may have failed, or the PDF was empty. Please delete this paper and try uploading again.</p>
                  <button onClick={handleDeletePaper} className="perf-btn" style={{ background: "#c62f2f" }}>
                    Delete Empty Paper
                  </button>
                </div>
              ) : (
                questions.map((q, index) => (
                  <div key={q.id} style={{ border: "1px solid #e6e9f0", borderRadius: 12, padding: 20 }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 12 }}>
                      <span style={{ fontWeight: 600, color: "#3b4cca" }}>Q{index + 1}</span>
                      <span style={{ fontSize: 12, background: "#fef3c7", color: "#b45309", padding: "2px 8px", borderRadius: 12 }}>Pending</span>
                    </div>

                    {editingId === q.id ? (
                      <div>
                        <textarea 
                          className="perf-input" style={{ width: "100%", minHeight: 80, marginBottom: 12 }}
                          value={editForm.question_text} onChange={(e) => setEditForm({...editForm, question_text: e.target.value})}
                        />
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
                          {editForm.options?.map((opt: string, i: number) => (
                            <input 
                              key={i} className="perf-input" value={opt} 
                              onChange={(e) => {
                                const newOpts = [...(editForm.options || [])];
                                newOpts[i] = e.target.value;
                                setEditForm({...editForm, options: newOpts});
                              }}
                            />
                          ))}
                        </div>
                        <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                          <label>Correct Ans:</label>
                          <select className="perf-input" style={{ width: 100 }} value={editForm.correct_answer} onChange={(e) => setEditForm({...editForm, correct_answer: e.target.value})}>
                            <option value="A">A</option><option value="B">B</option><option value="C">C</option><option value="D">D</option>
                          </select>
                          <button onClick={() => saveQuestion(q.id)} className="confirm-btn-primary" style={{ width: "auto" }}><Save size={16}/> Save</button>
                          <button onClick={() => setEditingId(null)} className="confirm-btn-secondary" style={{ width: "auto" }}>Cancel</button>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <p style={{ fontSize: 16, marginBottom: 16, fontWeight: 500 }}>{q.question_text}</p>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 16 }}>
                          {q.options?.map((opt: string, i: number) => (
                            <div key={i} style={{ padding: 10, border: "1px solid #e6e9f0", borderRadius: 8, background: opt.startsWith(q.correct_answer) ? "#e5f7ee" : "#fafbfd" }}>
                              {opt}
                            </div>
                          ))}
                        </div>
                        
                        {/* ACTION BUTTONS FOR SINGLE QUESTION */}
                        <div style={{ display: "flex", gap: 12 }}>
                          <button 
                            onClick={() => { setEditingId(q.id); setEditForm(q); }}
                            className="perf-btn outline" style={{ display: "flex", alignItems: "center", gap: 6 }}
                          >
                            <Edit3 size={16} /> Edit Question
                          </button>
                          <button 
                            onClick={() => handleDeleteQuestion(q.id)}
                            className="perf-btn danger-outline" style={{ display: "flex", alignItems: "center", gap: 6 }}
                          >
                            <Trash2 size={16} /> Delete
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}