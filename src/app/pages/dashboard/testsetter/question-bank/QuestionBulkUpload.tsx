import { useState } from "react";
import { Upload, FileText, CheckCircle, Brain, Code } from "lucide-react";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects } from "../../../../api/auth/admin/subjects";
import { uploadQuestionPaper } from "../../../../api/auth/testsetter/questions";
import { listCourses } from "../../../../api/auth/admin/courses";
import { listBatches } from "../../../../api/auth/admin/batches";
import { listTeachers } from "../../../../api/auth/teacher/teacher";
import { errorMessage } from "../../../../api/client";
import "../DefaultPage.css"; 

export default function QuestionBulkUpload() {
  const { data: subjects } = useApi(() => listSubjects({}));
  const { data: courses } = useApi(() => listCourses());
  const { data: batches } = useApi(() => listBatches());
  const { data: teachers } = useApi(() => listTeachers());

  const [file, setFile] = useState<File | null>(null);
  const [parserType, setParserType] = useState<"AI" | "REGEX">("AI");
  
  // Form state
  const [title, setTitle] = useState("");
  const [duration, setDuration] = useState(180);
  const [subjectId, setSubjectId] = useState("");
  const [courseId, setCourseId] = useState("");
  const [batchId, setBatchId] = useState("");
  const [teacherId, setTeacherId] = useState("");

  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file || !subjectId || !title || !courseId || !batchId || !teacherId) {
      setError("Please fill all required fields.");
      return;
    }

    setUploading(true);
    setError(null);
    setSuccess(false);

    try {
      await uploadQuestionPaper(file, parserType, {
        title,
        subject_id: subjectId,
        course_id: courseId,
        batch_id: batchId,
        teacher_id: teacherId,
        duration_minutes: duration,
      });

      setSuccess(true);
      // Reset form
      setFile(null);
      setTitle("");
      setSubjectId("");
      setCourseId("");
      setBatchId("");
      setTeacherId("");
    } catch (err) {
      setError(errorMessage(err));
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="default-page">
      <div className="default-panel">
        <div className="section-bar" style={{ textAlign: "center" }}>Upload Question Paper</div>
        
        <div style={{ padding: 40, maxWidth: 800, margin: "0 auto" }}>
          {error && <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f", marginBottom: 16 }}>{error}</div>}
          {success && (
            <div className="perf-success" style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <CheckCircle size={18} />
              Paper uploaded successfully! You can review it in the "Pending Review" tab.
            </div>
          )}

          <form onSubmit={handleUpload} style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            
            {/* ROW 1: Title & Duration */}
            <div className="form-grid">
              <div className="form-group">
                <label>Paper Title *</label>
                <input 
                  required 
                  type="text" 
                  placeholder="e.g., JEE Main Mock Test 1" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                />
              </div>
              <div className="form-group">
                <label>Duration (Minutes) *</label>
                <input 
                  required 
                  type="number" 
                  min="1" 
                  value={duration} 
                  onChange={(e) => setDuration(Number(e.target.value))} 
                />
              </div>
            </div>

            {/* ROW 2: Course, Batch, Teacher */}
            <div className="form-grid" style={{ gridTemplateColumns: "1fr 1fr 1fr" }}>
              <div className="form-group">
                <label>Course *</label>
                <select required value={courseId} onChange={(e) => setCourseId(e.target.value)}>
                  <option value="">Select Course</option>
                  {courses?.map((c) => (
                    <option key={c.id} value={c.id}>{c.course_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Batch *</label>
                <select required value={batchId} onChange={(e) => setBatchId(e.target.value)}>
                  <option value="">Select Batch</option>
                  {batches?.map((b) => (
                    <option key={b.id} value={b.id}>{b.batch_name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>Teacher *</label>
                <select required value={teacherId} onChange={(e) => setTeacherId(e.target.value)}>
                  <option value="">Select Teacher</option>
                  {teachers?.map((t) => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* ROW 3: Subject */}
            <div className="form-group">
              <label>Subject *</label>
              <select required value={subjectId} onChange={(e) => setSubjectId(e.target.value)}>
                <option value="">Select Subject...</option>
                {subjects?.map((s) => (
                  <option key={s.id} value={s.id}>{s.subject_name} ({s.subject_code})</option>
                ))}
              </select>
            </div>

            {/* ROW 4: Parsing Engine */}
            <div className="form-group">
              <label>Parsing Engine *</label>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginTop: 8 }}>
                
                <div 
                  onClick={() => setParserType("AI")}
                  style={{ 
                    padding: 16, border: `2px solid ${parserType === "AI" ? "#3b4cca" : "#e6e9f0"}`, 
                    borderRadius: 8, cursor: "pointer", background: parserType === "AI" ? "#e8ebfd" : "#fff",
                    display: "flex", flexDirection: "column", gap: 8
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: parserType === "AI" ? "#3b4cca" : "#1a2040" }}>
                    <Brain size={18} /> AI (Recommended)
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>
                    Uses OpenAI to read math, diagrams, and messy PDFs.
                  </div>
                </div>

                <div 
                  onClick={() => setParserType("REGEX")}
                  style={{ 
                    padding: 16, border: `2px solid ${parserType === "REGEX" ? "#3b4cca" : "#e6e9f0"}`, 
                    borderRadius: 8, cursor: "pointer", background: parserType === "REGEX" ? "#e8ebfd" : "#fff",
                    display: "flex", flexDirection: "column", gap: 8
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 600, color: parserType === "REGEX" ? "#3b4cca" : "#1a2040" }}>
                    <Code size={18} /> Standard (Free)
                  </div>
                  <div style={{ fontSize: 12, color: "#6b7488" }}>
                    Fast and free. Best for perfectly formatted text PDFs.
                  </div>
                </div>

              </div>
            </div>

            {/* ROW 5: File Dropzone */}
            <div 
              style={{ 
                border: "2px dashed #d5d9e6", borderRadius: 12, padding: 40, 
                textAlign: "center", background: "#fafbfd", cursor: "pointer",
                transition: "border-color 0.2s", marginTop: 8
              }}
              onClick={() => document.getElementById("file-upload")?.click()}
            >
              <input 
                id="file-upload" 
                type="file" 
                accept=".pdf,.docx,.png,.jpg" 
                style={{ display: "none" }} 
                onChange={(e) => setFile(e.target.files?.[0] || null)}
              />
              <FileText size={48} color="#3b4cca" style={{ margin: "0 auto 16px" }} />
              <h3 style={{ margin: "0 0 8px", fontSize: 18, color: "#1a2040" }}>
                {file ? file.name : "Click to upload or drag and drop"}
              </h3>
              <p style={{ margin: 0, color: "#6b7488", fontSize: 14 }}>
                PDF, DOCX, PNG, or JPG (Max 10MB)
              </p>
            </div>

            {/* ROW 6: Submit */}
            <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 16 }}>
              <button 
                type="submit" 
                className="confirm-btn-primary" 
                style={{ width: "auto", padding: "0 32px", display: "flex", alignItems: "center", gap: 8 }} 
                disabled={uploading || !file || !subjectId || !title}
              >
                <Upload size={18} />
                {uploading ? "Uploading..." : `Upload & Parse (${parserType})`}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}