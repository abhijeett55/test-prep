export type Option = { id: string; name: string };

export type FieldType = "text" | "email" | "select";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  /** For type "select": key into the optionsMap passed to FormLayout. */
  optionsKey?: string;
  /** For type "select": shown when nothing is selected yet. */
  emptyOptionLabel?: string;
};

export type GeoDetectConfig = {
  /** Field names this section's "Auto-detect" button fills in. */
  ipField: string;
  latField: string;
  lngField: string;
};

export type SectionConfig = {
  title: string;
  fields: FieldConfig[];
  /** If set, renders an "Auto-detect" button that fills these fields. */
  geoDetect?: GeoDetectConfig;
};

export type FormConfig = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  sections: SectionConfig[];
};

export type FormValues = Record<string, string>;

/** Builds an all-empty-string values object from a form config. */
export function buildInitialValues(config: FormConfig): FormValues {
  const values: FormValues = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      values[field.name] = "";
    }
  }
  return values;
}