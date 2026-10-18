import { useState } from "react";
import Card, { CardRow } from "../../../../components/Card/Card";
import { useApi } from "../../../../hooks/useApi";
import { listSubjects, deleteSubject, type SubjectRow } from "../../../../api/auth/admin/subjects";
import { errorMessage } from "../../../../api/client";
import CreateSubjectDialog from "./CreateSubjectDialog";
import "../student-management/Performance.css";

export default function SubjectsPage() {
  // We pass an empty object to listSubjects for default params
  const { data, loading, error, reload } = useApi(() => listSubjects({}));
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this subject?")) return;
    try {
      await deleteSubject(id);
      await reload();
    } catch (e) {
      setActionError(errorMessage(e));
    }
  };

  return (
    <div className="perf-page">
      <div className="perf-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <h1>All Subjects</h1>
          <p>Manage the subjects available in your institute</p>
        </div>
        <button className="perf-btn" onClick={() => setIsCreateOpen(true)}>
          + Create Subject
        </button>
      </div>

      {(error || actionError) && (
        <div className="perf-success" style={{ background: "#fdeaea", color: "#c62f2f" }}>
          {error ?? actionError}
        </div>
      )}

      {loading && <p className="profile-loading">Loading…</p>}

      <div className="card-grid">
        {data?.map((sub: SubjectRow) => (
          <Card
            key={sub.id}
            title={sub.subject_name}
            subtitle={sub.subject_code}
            footer={
              <button className="perf-btn danger-outline" onClick={() => handleDelete(sub.id)}>
                Delete
              </button>
            }
          >
            <CardRow label="Subject ID" value={sub.id} />
            <CardRow label="Created On" value={new Date(sub.created_at).toLocaleDateString()} />
          </Card>
        ))}

        {!loading && (data?.length ?? 0) === 0 && (
          <div className="card-empty">No subjects found. Create one!</div>
        )}
      </div>

      {isCreateOpen && (
        <CreateSubjectDialog 
          onClose={() => setIsCreateOpen(false)} 
          onSuccess={reload} 
        />
      )}
    </div>
  );
}