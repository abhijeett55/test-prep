import type { FormConfig } from "../../../components/FormLayout/types";

export const studentFormConfig: FormConfig = {
  title: "Add Student",
  submitLabel: "Add Student",
  submittingLabel: "Adding…",
  sections: [
    {
      title: "Account details",
      fields: [
        { name: "firstName", label: "First name", type: "text", required: true },
        { name: "LastName", label: "Last name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "fatherFirstName", label: "Father First name", type: "text", required: true },
        { name: "fatherLastName", label: "Father Last name", type: "text", required: true },
        { name: "fatherPhone", label: "Phone", type: "text" },
        { name: "motherFirstName", label: "Mother First name", type: "text", required: true },
        { name: "motherLastName", label: "Mother Last name", type: "text", required: true },
        { name: "motherPhone", label: "Phone", type: "text" },
        { name: "address", label: "Address", type: "text", required: true },
      ],
    },
    {
      title: "Assignment",
      fields: [
        {
          name: "institute_id",
          label: "Institute",
          type: "select",
          optionsKey: "institutes",
          emptyOptionLabel: "Select institute",
        },
        {
          name: "subject_ids",
          label: "Subjects",
          type: "select",
          optionsKey: "subjects",
          emptyOptionLabel: "Not assigned yet",
        },
        {
          name: "status",
          label: "Status",
          type: "select",
          optionsKey: "statuses",
          emptyOptionLabel: "Select status",
        },
        // NEW: mirrors the `placeholder` column on the Student model.
        // Rename `name`/`label` once you decide what this field actually holds.
        {
          name: "placeholder",
          label: "Placeholder",
          type: "text",
          placeholder: "TBD — rename once defined",
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