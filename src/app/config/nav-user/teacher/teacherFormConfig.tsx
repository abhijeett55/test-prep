import type { FormConfig } from "../../../components/FormLayout/types";

export const teacherFormConfig: FormConfig = {
  title: "Add Teacher",
  submitLabel: "Add Teacher",
  submittingLabel: "Adding…",
  sections: [
    {
      title: "Account details",
      fields: [
        { name: "fullName", label: "Full name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text", placeholder: "e.g. +91 98765 43210" },
        { name: "teacher_id", label: "Teacher ID", type: "text", required: true, placeholder: "e.g. TCH-001" },
      ],
    },
    {
      title: "Assignment",
      fields: [
        { name: "institute_id", label: "Institute", type: "select", required: true, optionsKey: "institutes", emptyOptionLabel: "Select institute" },
        { name: "subject_id", label: "Subject", type: "select", optionsKey: "subjects", emptyOptionLabel: "Not assigned yet" },
        { name: "employee_code", label: "Employee code", type: "text", placeholder: "e.g. EMP-1042" },
        { name: "qualification", label: "Qualification", type: "text", placeholder: "e.g. M.Sc. Physics" },
      ],
    },
    {
      title: "Location",
      geoDetect: {
        ipField: "ip_address",
        latField: "latitude",
        lngField: "longitude",
      },
      fields: [
        { name: "ip_address", label: "IP address", type: "hidden", placeholder: "Auto-detected or enter manually" },
        { name: "latitude", label: "Latitude", type: "hidden", placeholder: "e.g. 28.61393910" },
        { name: "longitude", label: "Longitude", type: "hidden", placeholder: "e.g. 77.20902120" },
      ],
    },
  ],
};