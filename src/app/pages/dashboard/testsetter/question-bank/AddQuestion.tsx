import { useState } from "react";
import { Plus, Trash2, Save } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { createQuestion, type QuestionCreate } from "../../../../api/auth/testsetter/questions";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css";

export default function AddQuestion() {
  const { data: subjects } = useApi(() => listSubjects({}));
  
  const [form, setForm] = useState<QuestionCreate>({
    subject_id: "",
    question_text: "",
    question_type: "MCQ",
    difficulty: "MEDIUM",
    options: ["", "", "", ""],
    correct_answer: "",
    marks: 1,
  });

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleOptionChange = (index: number, value: string) => {
    const newOptions = [...(form.options || [])];
    newOptions[index] = value;
    setForm({ ...form, options: newOptions });
  };

  const addOption = () => {
    setForm({ ...form, options: [...(form.options || []), ""] });
  };

  const removeOption = (index: number) => {
    const newOptions = form.options?.filter((_, i) => i !== index);
    setForm({ ...form, options: newOptions });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
      // Clean up empty options
      const payload = { ...form };
      if (payload.question_type === "MCQ") {
        payload.options = payload.options?.filter(o => o.trim() !== "");
      } else {
        payload.options = null;
        payload.correct_answer = null;
      }

      await createQuestion(payload);
      setSuccess(true);
      
      // Reset form but keep the subject and type
      setForm({
        ...form,
        question_text: "",
        options: ["", "", "", ""],
        correct_answer: "",
      });
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>Add New Question</div>
        
        <div style={{ padding: 32, maxWidth: 900, margin: "0 auto" }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && <div className="perf-success" style={{ marginBottom: 16 }}>Question added successfully!</div>}

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* Top Row: Subject, Type, Difficulty, Marks */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 100px", gap: 16 }}>
              <div className="form-group">
                <label>Subject *</label>
                <select required value={form.subject_id} onChange={(e) => setForm({ ...form, subject_id: e.target.value })}>
                  <option value="">Select Subject...</option>
                  {subjects?.map((s) => (
                    <option key={s.id} value={s.id}>{s.subject_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Question Type</label>
                <select value={form.question_type} onChange={(e) => setForm({ ...form, question_type: e.target.value as "MCQ" | "SUBJECTIVE" })}>
                  <option value="MCQ">Multiple Choice (MCQ)</option>
                  <option value="SUBJECTIVE">Subjective</option>
                </select>
              </div>

              <div className="form-group">
                <label>Difficulty</label>
                <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value as "EASY" | "MEDIUM" | "HARD" })}>
                  <option value="EASY">Easy</option>
                  <option value="MEDIUM">Medium</option>
                  <option value="HARD">Hard</option>
                </select>
              </div>

              <div className="form-group">
                <label>Marks *</label>
                <input required type="number" min="1" value={form.marks} onChange={(e) => setForm({ ...form, marks: Number(e.target.value) })} />
              </div>
            </div>

            {/* Question Text */}
            <div className="form-group">
              <label>Question Text *</label>
              <textarea 
                required 
                rows={4} 
                placeholder="Type your question here..."
                value={form.question_text} 
                onChange={(e) => setForm({ ...form, question_text: e.target.value })} 
              />
            </div>

            {/* MCQ Options */}
            {form.question_type === "MCQ" && (
              <div style={{ background: "#fafbfd", padding: 20, borderRadius: 10, border: "1px solid #e6e9f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 16 }}>
                  <label style={{ fontWeight: 600, fontSize: 14, color: "#1a2040" }}>Options</label>
                  <button type="button" onClick={addOption} className="icon-button" title="Add Option">
                    <Plus size={16} />
                  </button>
                </div>
                
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  {form.options?.map((opt, i) => (
                    <div key={i} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                      <span style={{ fontWeight: 600, width: 24, color: "#6b7488" }}>{String.fromCharCode(65 + i)}.</span>
                      <input 
                        required
                        placeholder={`Option ${String.fromCharCode(65 + i)}`}
                        value={opt} 
                        onChange={(e) => handleOptionChange(i, e.target.value)} 
                        style={{ flex: 1 }}
                      />
                      <button type="button" onClick={() => removeOption(i)} disabled={form.options!.length <= 2} className="icon-button" style={{ color: "#c62f2f", borderColor: "#fdeaea" }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>

                <div className="form-group" style={{ marginTop: 20 }}>
                  <label>Correct Answer (e.g. "A", "B", "C") *</label>
                  <input 
                    required
                    placeholder="Enter the letter of the correct option"
                    value={form.correct_answer || ""} 
                    onChange={(e) => setForm({ ...form, correct_answer: e.target.value.toUpperCase() })} 
                  />
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <button type="button" className="confirm-btn-secondary" style={{ width: "auto", padding: "0 24px" }} onClick={() => window.history.back()}>
                Cancel
              </button>
              <button type="submit" className="confirm-btn-primary" style={{ width: "auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 8 }} disabled={saving}>
                <Save size={18} />
                {saving ? "Saving..." : "Save Question"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}