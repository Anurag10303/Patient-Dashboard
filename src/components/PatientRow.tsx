import { Patient } from "@/types/patient";

const ISSUE_CONFIG: Record<string, { bg: string; text: string; dot: string; border: string }> = {
  fever:              { bg: "#fff1f2", text: "#e11d48", dot: "#fb7185", border: "#fecdd3" },
  headache:           { bg: "#fff7ed", text: "#c2410c", dot: "#fb923c", border: "#fed7aa" },
  rash:               { bg: "#fefce8", text: "#a16207", dot: "#facc15", border: "#fef08a" },
  "sore throat":      { bg: "#fdf2f8", text: "#be185d", dot: "#f472b6", border: "#fbcfe8" },
  "sprained ankle":   { bg: "#eff6ff", text: "#1d4ed8", dot: "#60a5fa", border: "#bfdbfe" },
  "broken arm":       { bg: "#f5f3ff", text: "#6d28d9", dot: "#a78bfa", border: "#ddd6fe" },
  sinusitis:          { bg: "#f0fdf4", text: "#166534", dot: "#4ade80", border: "#bbf7d0" },
  "stomach ache":     { bg: "#f7fee7", text: "#3f6212", dot: "#a3e635", border: "#d9f99d" },
  "ear infection":    { bg: "#ecfeff", text: "#0e7490", dot: "#22d3ee", border: "#a5f3fc" },
  "allergic reaction":{ bg: "#fff1f2", text: "#9f1239", dot: "#fb7185", border: "#fecdd3" },
};

const AVATAR_GRADIENTS = [
  "linear-gradient(135deg, #9b6dff, #c084fc)",
  "linear-gradient(135deg, #43cfa8, #34d399)",
  "linear-gradient(135deg, #ff7eb3, #f472b6)",
  "linear-gradient(135deg, #60a5fa, #818cf8)",
  "linear-gradient(135deg, #fb923c, #fbbf24)",
];

export default function PatientRow({ patient, index = 0 }: { patient: Patient; index?: number }) {
  const contact = patient.contact[0];
  const initials = patient.patient_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const cfg = ISSUE_CONFIG[patient.medical_issue] ?? { bg: "#f5f5f5", text: "#555", dot: "#999", border: "#ddd" };
  const grad = AVATAR_GRADIENTS[patient.patient_id % AVATAR_GRADIENTS.length];
  const delay = `${(index % 20) * 30}ms`;

  return (
    <tr
      className="card-enter"
      style={{
        borderBottom: "1px solid #f0ebff",
        transition: "background 0.15s",
        animationDelay: delay,
        opacity: 0,
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#faf7ff")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <td style={{ padding: "14px 20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: grad, display: "flex",
            alignItems: "center", justifyContent: "center",
            fontWeight: 800, color: "#fff", fontSize: "12px",
            flexShrink: 0, fontFamily: "'Nunito', sans-serif",
          }}>{initials}</div>
          <div>
            <p style={{ fontSize: "14px", fontWeight: 700, color: "#2d2440", margin: 0, fontFamily: "'Playfair Display', serif" }}>
              {patient.patient_name}
            </p>
            <p style={{ fontSize: "11px", color: "#b3a8cc", margin: "2px 0 0" }}>#{patient.patient_id}</p>
          </div>
        </div>
      </td>
      <td style={{ padding: "14px 20px", fontSize: "14px", fontWeight: 600, color: "#7c6f99" }}>{patient.age}</td>
      <td style={{ padding: "14px 20px" }}>
        <span style={{
          display: "inline-flex", alignItems: "center", gap: "5px",
          padding: "4px 10px", borderRadius: "999px",
          background: cfg.bg, color: cfg.text,
          border: `1px solid ${cfg.border}`,
          fontSize: "11px", fontWeight: 700, textTransform: "capitalize",
        }}>
          <span style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.dot }} />
          {patient.medical_issue}
        </span>
      </td>
      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7c6f99" }}>{contact?.email ?? <span style={{ color: "#d8cff0" }}>—</span>}</td>
      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7c6f99" }}>{contact?.number ?? <span style={{ color: "#d8cff0" }}>—</span>}</td>
      <td style={{ padding: "14px 20px", fontSize: "13px", color: "#7c6f99", maxWidth: "180px" }}>
        <span style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
          {contact?.address ?? <span style={{ color: "#d8cff0" }}>—</span>}
        </span>
      </td>
    </tr>
  );
}