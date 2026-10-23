import { useState } from "react";
import type { FormConfig, FormValues, Option } from "./types";
import "./FormLayout.css";

type FormLayoutProps = {
  config: FormConfig;
  values: FormValues;
  onChange: (name: string, value: string) => void;
  optionsMap?: Record<string, Option[]>;
  
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function FormLayout({
  config,
  values,
  onChange,
  optionsMap = {},
  onSubmit,
  onCancel,
}: FormLayoutProps) {
  const [submitting, setSubmitting] = useState(false);
  const [locating, setLocating] = useState<string | null>(null);
  const [locateError, setLocateError] = useState<string | null>(null);

  const requiredFields = config.sections.flatMap((s) =>
    s.fields.filter((f) => f.required).map((f) => f.name)
  );
  const canSubmit = requiredFields.every((name) => values[name]?.trim() !== "");

  const handleChange =
    (name: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      onChange(name, e.target.value);
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit || submitting) return;

    setSubmitting(true);
    try {
      await onSubmit(values);
    } finally {
      setSubmitting(false);
    }
  };

  const detectLocation = async (sectionTitle: string, ipField: string, latField: string, lngField: string) => {
    setLocating(sectionTitle);
    setLocateError(null);

    try {
      const ipRes = await fetch("https://api.ipify.org?format=json");
      const ipData = await ipRes.json();
      onChange(ipField, ipData.ip ?? "");
    } catch {
      setLocateError("Couldn't fetch IP address — enter it manually.");
    }

    if (!navigator.geolocation) {
      setLocateError((prev) => prev ?? "Geolocation isn't supported — enter coordinates manually.");
      setLocating(null);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        onChange(latField, pos.coords.latitude.toFixed(8));
        onChange(lngField, pos.coords.longitude.toFixed(8));
        setLocating(null);
      },
      () => {
        setLocateError((prev) => prev ?? "Location permission denied — enter coordinates manually.");
        setLocating(null);
      }
    );
  };

  return (
    <form className="form-layout" onSubmit={handleSubmit}>
      <h2 className="form-layout-title">{config.title}</h2>

      {config.sections.map((section, i) => (
        <div className="form-layout-section" key={section.title}>
          <div className="section-header-row">
            <h3>{section.title}</h3>
            {section.geoDetect && (() => {
              // Check if the values already exist in the form state
              const isDetected = Boolean(
                values[section.geoDetect.ipField] || values[section.geoDetect.latField]
              );

              return (
                <button
                  type="button"
                  className="detect-button"
                  onClick={() =>
                    detectLocation(
                      section.title,
                      section.geoDetect!.ipField,
                      section.geoDetect!.latField,
                      section.geoDetect!.lngField
                    )
                  }
                  // Optional: disable the button if it's already detected so they can't spam it
                  disabled={locating === section.title || isDetected} 
                  style={isDetected ? { borderColor: "#16a34a", color: "#16a34a", background: "#f0fdf4" } : {}}
                >
                  {locating === section.title 
                    ? "Detecting…" 
                    : isDetected 
                      ? "Detected ✓" 
                      : "Auto-detect"}
                </button>
              );
            })()}
          </div>

          {section.geoDetect && locateError && (
            <p className="detect-error">{locateError}</p>
          )}

          <div className="form-layout-grid">
            {section.fields.map((field) => {
              // If the field is marked as hidden, render ONLY the hidden input and skip the label/UI
              if (field.type === "hidden") {
                return (
                  <input
                    key={field.name}
                    type="hidden"
                    name={field.name}
                    value={values[field.name] ?? ""}
                    onChange={handleChange(field.name)}
                  />
                );
              }

              return (
                <div className={`field${field.type === "textarea" ? " full" : ""}`} key={field.name}>
                  <label htmlFor={field.name}>{field.label}</label>

                  {field.type === "select" ? (
                    <select
                      id={field.name}
                      value={values[field.name] ?? ""}
                      onChange={handleChange(field.name)}
                      required={field.required}
                    >
                      <option value="" disabled={field.required}>
                        {field.emptyOptionLabel ?? "Select…"}
                      </option>
                      {(optionsMap[field.optionsKey ?? ""] ?? []).map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.name}
                        </option>
                      ))}
                    </select>
                  ) : (
                    <input
                      id={field.name}
                      type={field.type}
                      value={values[field.name] ?? ""}
                      onChange={handleChange(field.name)}
                      placeholder={field.placeholder}
                      required={field.required}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {i < config.sections.length - 1 && <div className="section-divider" />}
        </div>
      ))}

      <div className="form-layout-actions">
        {onCancel && (
          <button type="button" className="secondary-button" onClick={onCancel}>
            Cancel
          </button>
        )}
        <button type="submit" className="primary-button" disabled={!canSubmit || submitting}>
          {submitting ? config.submittingLabel : config.submitLabel}
        </button>
      </div>
    </form>
  );
}