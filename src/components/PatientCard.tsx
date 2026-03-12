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

interface PatientCardProps {
  patient: Patient;
}

export default function PatientCard({ patient }: PatientCardProps) {
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
    <div className="bg-white rounded-xl border border-gray-200 p-5 flex flex-col gap-4 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-center gap-3">
        {patient.photo_url ? (
          <img
            src={patient.photo_url}
            alt={patient.patient_name}
            onError={(e) => {
              // Fallback to initials if image fails
              (e.target as HTMLImageElement).style.display = "none";
            }}
            className="w-12 h-12 rounded-full object-cover bg-gray-100"
          />
        ) : (
          <div className="w-12 h-12 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-semibold text-sm">
            {initials}
          </div>
        )}

        <div>
          <p className="font-semibold text-gray-900">{patient.patient_name}</p>
          <p className="text-sm text-gray-500">Age {patient.age}</p>
        </div>
      </div>

      {/* Medical Issue Badge */}
      <span
        className={`self-start px-2.5 py-1 rounded-full text-xs font-medium capitalize ${badgeClass}`}
      >
        {patient.medical_issue}
      </span>

      {/* Contact Info */}
      <div className="text-sm text-gray-500 flex flex-col gap-1">
        {contact?.email && (
          <p className="truncate">✉️ {contact.email}</p>
        )}
        {contact?.number && (
          <p>📞 {contact.number}</p>
        )}
        {contact?.address && (
          <p className="truncate">📍 {contact.address}</p>
        )}
      </div>
    </div>
  );
}