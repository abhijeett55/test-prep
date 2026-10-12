import { useMemo, useState } from "react";
import FormLayout from "../../../components/FormLayout/FormLayout";
import { teacherFormConfig } from "./teacherFormConfig";
import {
  buildInitialValues,
  type Option,
  type FormValues,
} from "../../../components/FormLayout/types";

/** Subjects carry their institute so the form can scope the dropdown. */
export type SubjectOption = Option & { institute_id: string };

type AddTeacherFormProps = {
  institutes: Option[];
  subjects: SubjectOption[];
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function TeacherForm({
  institutes,
  subjects,
  onSubmit,
  onCancel,
}: AddTeacherFormProps) {
  const [values, setValues] = useState<FormValues>(() =>
    buildInitialValues(teacherFormConfig)
  );

  // Only show subjects that belong to the selected institute.
  const filteredSubjects = useMemo(() => {
    const instId = values.institute_id;
    if (!instId) return [];
    return subjects.filter((s) => s.institute_id === instId);
  }, [values.institute_id, subjects]);

  const handleChange = (name: string, value: string) => {
    setValues((prev) => {
      const next = { ...prev, [name]: value };
      // Changing institute invalidates the chosen subject.
      if (name === "institute_id" && prev.institute_id !== value) {
        next.subject_id = "";
      }
      return next;
    });
  };

  return (
    <FormLayout
      config={teacherFormConfig}
      values={values}
      onChange={handleChange}
      optionsMap={{ institutes, subjects: filteredSubjects }}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}