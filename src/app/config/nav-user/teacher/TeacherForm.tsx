import { useState } from "react";
import FormLayout from "../../../components/FormLayout/FormLayout";
import { teacherFormConfig } from "./teacherFormConfig";
import { buildInitialValues, type Option, type FormValues } from "../../../components/FormLayout/types";

type AddTeacherFormProps = {
  institutes: Option[];
  subjects: Option[];
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function TeacherForm({
  institutes,
  subjects,
  onSubmit,
  onCancel,
}: AddTeacherFormProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(teacherFormConfig));

  return (
    <FormLayout
      config={teacherFormConfig}
      values={values}
      onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
      optionsMap={{ institutes, subjects }}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}