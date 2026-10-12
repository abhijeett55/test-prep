import type { ReactNode } from "react";
import "./Card.css";

export type CardTone = "" | "success" | "danger" | "warning";

type CardProps = {
  title: string;
  subtitle?: string;
  /** small status pill in the top-right corner */
  badge?: { label: string; tone?: CardTone };
  children?: ReactNode;
  /** buttons / actions shown at the bottom */
  footer?: ReactNode;
};

export default function Card({ title, subtitle, badge, children, footer }: CardProps) {
  return (
    <div className="card">
      <div className="card-head">
        <div>
          <h3 className="card-title">{title}</h3>
          {subtitle && <p className="card-subtitle">{subtitle}</p>}
        </div>
        {badge && (
          <span className={`perf-badge ${badge.tone ?? ""}`}>{badge.label}</span>
        )}
      </div>

      {children && <div className="card-body">{children}</div>}
      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
}

/** One label/value line inside a card body */
export function CardRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="card-row">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}