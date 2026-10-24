import type { FormConfig } from "../../../components/FormLayout/types";

export const testsetterFormConfig: FormConfig = {
  title: "Add Test Setter",
  submitLabel: "Add Test Setter",
  submittingLabel: "Adding…",
  sections: [
    {
      title: "Account details",
      fields: [
        { name: "fullName", label: "Full name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone number", type: "text", required: false },
        { name: "testsetter_id", label: "Test Setter ID", type: "text", required: true },
      ],
    },
    {
      title: "Assignment",
      fields: [
        {
          name: "institute_id",
          label: "Institute",
          type: "select",
          required: true,
          optionsKey: "institutes",
          emptyOptionLabel: "Select institute",
        },
        { name: "employee_code", label: "Employee code", type: "text" },
      ],
    },
  ],
};