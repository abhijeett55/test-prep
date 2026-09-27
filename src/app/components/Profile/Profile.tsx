import { Pencil, Info } from "lucide-react";
import type { ProfileSection } from "./types";
import "./Profile.css";

type InfoSectionProps = {
  section: ProfileSection;
};


export default function Profile({ section }: InfoSectionProps) {
  return (
    <div className="profile-section">
      <div className="profile-section-header">
        <div className="profile-section-title-group">
          <h2 className="profile-section-title">{section.title}</h2>
          {section.badge && (
            <span className="profile-badge">
              {section.badge}
              <Info size={12} strokeWidth={2} />
            </span>
          )}
        </div>
        {section.editable && (
          <button type="button" className="profile-edit-button" onClick={section.onEdit}>
            <Pencil size={13} strokeWidth={2.2} />
            Edit
          </button>
        )}
      </div>

      <div className="profile-rows">
        {section.rows.map((row) => (
          <div className="profile-row" key={row.key}>
            <span className="profile-row-label">{row.label}</span>
            <div className="profile-row-value">
              {row.action ? (
                <button type="button" className="profile-row-action" onClick={row.action.onClick}>
                  {row.action.label}
                </button>
              ) : (
                <span>{row.value || "—"}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}