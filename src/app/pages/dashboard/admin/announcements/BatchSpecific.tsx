import { useApi } from "../../../../hooks/useApi";
import { listAnnouncements, publishAnnouncement } from "../../../../api/auth/admin/announcements";
import { errorMessage } from "../../../../api/client";
import "../courses-management/DefaultPage.css";

export default function BatchSpecific() {
  const { data: announcements, loading, reload } = useApi(() => listAnnouncements({ scope: "BATCH" }));

  const handlePublish = async (id: string) => {
    try {
      await publishAnnouncement(id);
      reload();
    } catch (e) {
      alert(errorMessage(e));
    }
  };

  if (loading) return <div className="default-page">Loading…</div>;

  return (
    <div className="default-page">
      <div className="courses-header">
        <div>
          <h1>Batch-specific Announcements</h1>
          <p>Messages sent to specific batches</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
        {(announcements ?? []).map((a) => (
          <div key={a.id} className="confirm-card" style={{ width: "100%", maxWidth: "100%" }}>
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <h3 className="confirm-title">{a.title}</h3>
              <span className="perf-badge">{a.batch_name || "Unknown Batch"}</span>
            </div>
            <p className="confirm-subtitle" style={{ whiteSpace: "pre-wrap" }}>{a.body}</p>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 16, borderTop: "1px solid #e6e9f0", paddingTop: 16 }}>
              <span style={{ fontSize: 13, color: a.published_at ? "#1a8f5a" : "#6b7488" }}>
                {a.published_at ? `Published: ${new Date(a.published_at).toLocaleDateString()}` : "Draft"}
              </span>
              {!a.published_at && (
                <button className="perf-btn" onClick={() => handlePublish(a.id)}>Publish Now</button>
              )}
            </div>
          </div>
        ))}
        {announcements?.length === 0 && <p>No batch announcements yet.</p>}
      </div>
    </div>
  );
}