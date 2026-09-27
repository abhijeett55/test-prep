import type { SessionRow } from "./types";
import "./Profile.css";

type SessionsSectionProps = {
  sessions: SessionRow[];
  onSignOutOthers: () => void;
};

export default function Sessions({ sessions, onSignOutOthers }: SessionsSectionProps) {
  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div className="profile-section-title-group">
          <h2 className="profile-section-title">Sessions</h2>
        </div>
        <button type="button" className="profile-edit-button" onClick={onSignOutOthers}>
          Sign out all other sessions
        </button>
      </div>
      <p className="profile-section-subtitle">Places where you're signed in.</p>

      <div className="sessions-table-wrap">
        <table className="sessions-table">
          <thead>
            <tr>
              <th>Location</th>
              <th>Device</th>
              <th>IP address</th>
              <th>Time</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {sessions.map((s) => (
              <tr key={s.id}>
                <td className="cell-strong">{s.location}</td>
                <td>{s.device}</td>
                <td>{s.ipAddress}</td>
                <td>{s.time}</td>
                <td className="cell-current">{s.isCurrent && "Current session"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}