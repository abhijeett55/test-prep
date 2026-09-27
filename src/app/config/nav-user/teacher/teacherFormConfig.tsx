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
        {
          name: "subject_id",
          label: "Subject",
          type: "select",
          optionsKey: "subjects",
          emptyOptionLabel: "Not assigned yet",
        },
        { name: "employee_code", label: "Employee code", type: "text" },
        {
          name: "qualification",
          label: "Qualification",
          type: "text",
          placeholder: "e.g. M.Sc. Physics",
        },
      ],
    },
    {
      title: "Device & location",
      geoDetect: {
        ipField: "ip_address",
        latField: "latitude",
        lngField: "longitude",
      },
      fields: [
        {
          name: "ip_address",
          label: "IP address",
          type: "text",
          placeholder: "Auto-filled on detect",
        },
        {
          name: "latitude",
          label: "Latitude",
          type: "text",
          placeholder: "Auto-filled on detect",
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "text",
          placeholder: "Auto-filled on detect",
        },
      ],
    },
  ],
};