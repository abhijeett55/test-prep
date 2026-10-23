export type Option = { id: string; name: string };

export type FieldType = "text" | "email" | "select" | "textarea" | "hidden";

export type FieldConfig = {
  name: string;
  label: string;
  type: FieldType;
  required?: boolean;
  placeholder?: string;
  optionsKey?: string;
  emptyOptionLabel?: string;
};

export type GeoDetectConfig = {
  ipField: string;
  latField: string;
  lngField: string;
};

export type SectionConfig = {
  title: string;
  fields: FieldConfig[];
  geoDetect?: GeoDetectConfig;
};

export type FormConfig = {
  title: string;
  submitLabel: string;
  submittingLabel: string;
  sections: SectionConfig[];
};

export type FormValues = Record<string, string>;
export function buildInitialValues(config: FormConfig): FormValues {
  const values: FormValues = {};
  for (const section of config.sections) {
    for (const field of section.fields) {
      values[field.name] = "";
    }
  }
  return values;
}