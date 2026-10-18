import { useApi } from "../../../../hooks/useApi";
import { getMyInstitute } from "../../../../api/auth/admin/institute";
import "../student-management/Performance.css"; // or your preferred styling

export default function InstituteProfilePage() {
  const { data: institute, loading, error } = useApi(() => getMyInstitute());

  if (loading) return <div className="default-page">Loading institute details…</div>;
  if (error) return <div className="default-page" style={{ color: "red" }}>{error}</div>;
  if (!institute) return null;

  return (
    <div className="default-page">
      <div className="section-bar">Institute Details</div>
      <div className="default-panel" style={{ padding: 24 }}>
        
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px 16px" }}>
          
          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Institute Name</div>
            <div style={{ fontSize: 16, fontWeight: 500 }}>{institute.institute_name}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Institute ID</div>
            <div style={{ fontSize: 16 }}>{institute.institute_id}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Code</div>
            <div style={{ fontSize: 16 }}>{institute.code}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Status</div>
            <span className={`status-badge ${institute.status === "ACTIVE" ? "active" : "inactive"}`}>
              {institute.status}
            </span>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Contact Email</div>
            <div style={{ fontSize: 16 }}>{institute.email}</div>
          </div>

          <div>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Phone</div>
            <div style={{ fontSize: 16 }}>{institute.phone || "—"}</div>
          </div>

          <div style={{ gridColumn: "1 / -1" }}>
            <div style={{ fontSize: 12, color: "#6b7488", textTransform: "uppercase", fontWeight: 600, marginBottom: 4 }}>Address</div>
            <div style={{ fontSize: 16 }}>{institute.address || "—"}</div>
          </div>

        </div>
      </div>
    </div>
  );
}
