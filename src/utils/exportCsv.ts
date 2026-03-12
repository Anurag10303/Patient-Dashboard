import { Patient } from "@/types/patient";

export function exportToCSV(patients: Patient[], filename = "patients.csv") {
  const headers = ["ID", "Name", "Age", "Medical Issue", "Email", "Phone", "Address"];

  const rows = patients.map(p => {
    const c = p.contact[0];
    return [
      p.patient_id,
      `"${p.patient_name}"`,
      p.age,
      `"${p.medical_issue}"`,
      `"${c?.email ?? ""}"`,
      `"${c?.number ?? ""}"`,
      `"${c?.address ?? ""}"`,
    ].join(",");
  });

  const csv = [headers.join(","), ...rows].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);

  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();

  URL.revokeObjectURL(url);
}