import { PatientStats } from "@/types/patient";

interface StatsBarProps {
  stats: PatientStats | null;
  loading: boolean;
}

const STAT_CARDS = (stats: PatientStats) => [
  {
    label: "Total Patients",
    value: stats.totalAll.toLocaleString(),
    icon: "👥",
    bg: "linear-gradient(135deg, #f5f0ff, #ede9fe)",
    border: "#ddd6fe",
    valueColor: "#7c3aed",
  },
  {
    label: "Average Age",
    value: `${stats.avgAge} yrs`,
    icon: "🎂",
    bg: "linear-gradient(135deg, #fdf4ff, #fae8ff)",
    border: "#f0abfc",
    valueColor: "#a21caf",
  },
  {
    label: "Top Condition",
    value: stats.topCondition,
    icon: "🩺",
    bg: "linear-gradient(135deg, #fff0f9, #fce7f3)",
    border: "#fbcfe8",
    valueColor: "#be185d",
    capitalize: true,
  },
  {
    label: "No Contact Info",
    value: stats.noContact.toLocaleString(),
    icon: "📵",
    bg: "linear-gradient(135deg, #fff7ed, #ffedd5)",
    border: "#fed7aa",
    valueColor: "#c2410c",
  },
];

export default function StatsBar({ stats, loading }: StatsBarProps) {
  if (loading || !stats) {
    return (
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
        gap: "14px",
        marginBottom: "28px",
      }}>
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.8)",
            border: "1px solid #e8dff7",
            borderRadius: "18px",
            padding: "20px",
            height: "90px",
          }}>
            <div className="skeleton" style={{ height: 11, width: "55%", marginBottom: 12 }} />
            <div className="skeleton" style={{ height: 22, width: "40%" }} />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))",
      gap: "14px",
      marginBottom: "28px",
    }}>
      {STAT_CARDS(stats).map((card, i) => (
        <div
          key={card.label}
          className="card-enter"
          style={{
            animationDelay: `${i * 80}ms`,
            background: card.bg,
            border: `1px solid ${card.border}`,
            borderRadius: "18px",
            padding: "18px 20px",
            display: "flex",
            alignItems: "center",
            gap: "14px",
            transition: "transform 0.2s, box-shadow 0.2s",
            cursor: "default",
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = "translateY(-3px)";
            e.currentTarget.style.boxShadow = "0 8px 24px #9b6dff18";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = "translateY(0)";
            e.currentTarget.style.boxShadow = "none";
          }}
        >
          <span style={{ fontSize: "28px", lineHeight: 1 }}>{card.icon}</span>
          <div style={{ minWidth: 0 }}>
            <p style={{ fontSize: "11px", fontWeight: 700, color: "#b3a8cc", textTransform: "uppercase", letterSpacing: "0.06em", margin: 0 }}>
              {card.label}
            </p>
            <p style={{
              fontSize: "18px", fontWeight: 800,
              color: card.valueColor, margin: "3px 0 0",
              fontFamily: "'Playfair Display', serif",
              textTransform: card.capitalize ? "capitalize" : "none",
              overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
            }}>
              {card.value}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}