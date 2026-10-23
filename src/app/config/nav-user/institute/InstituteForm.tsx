import { useState } from "react";
import FormLayout from "../../../components/FormLayout/FormLayout";
import { instituteFormConfig } from "./instituteFormConfig";
import { buildInitialValues, type FormValues } from "../../../components/FormLayout/types";

type InstituteFormProps = {
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function InstituteForm({ onSubmit, onCancel }: InstituteFormProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(instituteFormConfig));

  return (
    <FormLayout
      config={instituteFormConfig}
      values={values}
      onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}