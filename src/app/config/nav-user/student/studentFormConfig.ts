import type { FormConfig } from "../../../components/FormLayout/types";

export const studentFormConfig: FormConfig = {
  title: "Add Student",
  submitLabel: "Add Student",
  submittingLabel: "Adding…",
  sections: [
    {
      title: "Account details",
      fields: [
        { name: "fullName", label: "Full name", type: "text", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text", required: true },
        { name: "fatherFullName", label: "Father Full name", type: "text", required: true },
        { name: "fatherPhone", label: "Phone", type: "text" },
        { name: "motherFullName", label: "Mother Full name", type: "text", required: true },
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
          name: "status",
          label: "Status",
          type: "select",
          optionsKey: "statuses",
          emptyOptionLabel: "Select status",
        },
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
          type: "hidden",
          placeholder: "Auto-filled on detect",
        },
        {
          name: "latitude",
          label: "Latitude",
          type: "hidden",
          placeholder: "Auto-filled on detect",
        },
        {
          name: "longitude",
          label: "Longitude",
          type: "hidden",
          placeholder: "Auto-filled on detect",
        },
      ],
    },
  ],
};