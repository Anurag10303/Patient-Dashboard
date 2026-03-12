import { Patient } from "@/types/patient";

const ISSUE_COLORS: Record<string, string> = {
  fever: "bg-red-100 text-red-700",
  headache: "bg-orange-100 text-orange-700",
  rash: "bg-yellow-100 text-yellow-700",
  "sore throat": "bg-pink-100 text-pink-700",
  "sprained ankle": "bg-blue-100 text-blue-700",
  "broken arm": "bg-purple-100 text-purple-700",
  sinusitis: "bg-teal-100 text-teal-700",
  "stomach ache": "bg-lime-100 text-lime-700",
  "ear infection": "bg-cyan-100 text-cyan-700",
  "allergic reaction": "bg-rose-100 text-rose-700",
};

interface PatientRowProps {
  patient: Patient;
}

export default function PatientRow({ patient }: PatientRowProps) {
  const contact = patient.contact[0];
  const initials = patient.patient_name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const badgeClass =
    ISSUE_COLORS[patient.medical_issue] ?? "bg-gray-100 text-gray-700";

  return (
    <tr className="border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Patient */}
      <td className="px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-xs flex-shrink-0">
            {initials}
          </div>
          <div>
            <p className="font-medium text-gray-900 text-sm">
              {patient.patient_name}
            </p>
            <p className="text-xs text-gray-400">#{patient.patient_id}</p>
          </div>
        </div>
      </td>

      {/* Age */}
      <td className="px-4 py-3 text-sm text-gray-600">{patient.age}</td>

      {/* Medical Issue */}
      <td className="px-4 py-3">
        <span
          className={`px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeClass}`}
        >
          {patient.medical_issue}
        </span>
      </td>

      {/* Email */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {contact?.email ?? <span className="text-gray-300">—</span>}
      </td>

      {/* Phone */}
      <td className="px-4 py-3 text-sm text-gray-500">
        {contact?.number ?? <span className="text-gray-300">—</span>}
      </td>

      {/* Address */}
      <td className="px-4 py-3 text-sm text-gray-500 max-w-[180px] truncate">
        {contact?.address ?? <span className="text-gray-300">—</span>}
      </td>
    </tr>
  );
}