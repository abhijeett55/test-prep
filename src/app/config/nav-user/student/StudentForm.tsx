import { useState } from "react";
import FormLayout from "../../../components/FormLayout/FormLayout";
import { studentFormConfig } from "./studentFormConfig";
import { buildInitialValues, type Option, type FormValues } from "../../../components/FormLayout/types";

type AddStudentFormProps = {
  institutes: Option[];
  subjects: Option[];
  statuses: Option[];
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function StudentForm({
  institutes,
  subjects,
  statuses,
  onSubmit,
  onCancel,
}: AddStudentFormProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(studentFormConfig));

  return (
    <FormLayout
      config={studentFormConfig}
      values={values}
      onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
      optionsMap={{ institutes, subjects, statuses }}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}