import { useState } from "react";
import FormLayout from "../../../components/FormLayout/FormLayout";
import { testsetterFormConfig } from "./testsetterFormConfig";
import { buildInitialValues, type Option, type FormValues } from "../../../components/FormLayout/types";

type AddTestSetterFormProps = {
  institutes: Option[];
  subjects: Option[];
  onSubmit: (values: FormValues) => void | Promise<void>;
  onCancel?: () => void;
};

export default function TestSetterForm({
  institutes,
  subjects,
  onSubmit,
  onCancel,
}: AddTestSetterFormProps) {
  const [values, setValues] = useState<FormValues>(() => buildInitialValues(testsetterFormConfig));

  return (
    <FormLayout
      config={testsetterFormConfig}
      values={values}
      onChange={(name, value) => setValues((prev) => ({ ...prev, [name]: value }))}
      optionsMap={{ institutes, subjects }}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
}