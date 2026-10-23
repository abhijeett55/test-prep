import type { FormConfig } from "../../../components/FormLayout/types";

export const instituteFormConfig: FormConfig = {
  title: "Add Institute",
  submitLabel: "Add Institute",
  submittingLabel: "Adding…",
  sections: [
    {
      title: "Institute Details",
      fields: [
        { name: "institute_name", label: "Institute Name", type: "text", required: true },
        { name: "code", label: "Institute Code", type: "text", required: true, placeholder: "e.g. INST-001" },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "phone", label: "Phone", type: "text" },
        { name: "address", label: "Address", type: "text", required: true },

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