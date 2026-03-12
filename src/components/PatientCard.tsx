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

export default function PatientCard({ patient, index = 0 }: { patient: Patient; index?: number }) {
  const contact = patient.contact[0];
  const initials = patient.patient_name.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const cfg = ISSUE_CONFIG[patient.medical_issue] ?? { bg: "#f5f5f5", text: "#555", dot: "#999", border: "#ddd" };
  const grad = AVATAR_GRADIENTS[patient.patient_id % AVATAR_GRADIENTS.length];
  const delay = `${(index % 12) * 50}ms`;

  return (
    <div
      className="card-enter"
      style={{
        animationDelay: delay,
        background: "rgba(255,255,255,0.85)",
        backdropFilter: "blur(12px)",
        border: "1px solid #e8dff7",
        borderRadius: "20px",
        padding: "22px",
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        cursor: "pointer",
        transition: "transform 0.25s cubic-bezier(0.22,1,0.36,1), box-shadow 0.25s, border-color 0.25s",
        boxShadow: "0 2px 12px #9b6dff0a",
      }}
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(-4px) scale(1.01)";
        el.style.boxShadow = "0 12px 36px #9b6dff22";
        el.style.borderColor = "#c4b5fd";
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.transform = "translateY(0) scale(1)";
        el.style.boxShadow = "0 2px 12px #9b6dff0a";
        el.style.borderColor = "#e8dff7";
      }}
    >
      {/* Avatar + Name */}
      <div style={{ display: "flex", alignItems: "center", gap: "13px" }}>
        <div style={{
          width: 48, height: 48, borderRadius: 14,
          background: grad,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontWeight: 800, color: "#fff", fontSize: "15px",
          fontFamily: "'Nunito', sans-serif",
          flexShrink: 0,
          boxShadow: "0 4px 12px #9b6dff33",
        }}>{initials}</div>
        <div style={{ minWidth: 0 }}>
          <p style={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700, fontSize: "15px",
            color: "#2d2440", margin: 0,
            whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis",
          }}>{patient.patient_name}</p>
          <p style={{ fontSize: "12px", color: "#b3a8cc", margin: "2px 0 0", fontWeight: 500 }}>
            ID #{patient.patient_id} · Age {patient.age}
          </p>
        </div>
      </div>

      {/* Divider */}
      <div style={{ height: 1, background: "linear-gradient(to right, #e8dff7, transparent)" }} />

      {/* Badge */}
      <span style={{
        display: "inline-flex", alignItems: "center", gap: "6px",
        padding: "5px 12px", borderRadius: "999px",
        background: cfg.bg, color: cfg.text,
        border: `1px solid ${cfg.border}`,
        fontSize: "12px", fontWeight: 700,
        width: "fit-content", textTransform: "capitalize",
      }}>
        <span style={{ width: 7, height: 7, borderRadius: "50%", background: cfg.dot, flexShrink: 0 }} />
        {patient.medical_issue}
      </span>

      {/* Contact */}
      <div style={{ display: "flex", flexDirection: "column", gap: "7px", marginTop: "auto" }}>
        {contact?.email && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "13px", flexShrink: 0 }}>✉️</span>
            <span style={{ fontSize: "12px", color: "#7c6f99", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.email}</span>
          </div>
        )}
        {contact?.number && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ fontSize: "13px", flexShrink: 0 }}>📞</span>
            <span style={{ fontSize: "12px", color: "#7c6f99" }}>{contact.number}</span>
          </div>
        )}
        {contact?.address && (
          <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
            <span style={{ fontSize: "13px", flexShrink: 0 }}>📍</span>
            <span style={{ fontSize: "12px", color: "#7c6f99", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{contact.address}</span>
          </div>
        )}
      </div>
    </div>
  );
}