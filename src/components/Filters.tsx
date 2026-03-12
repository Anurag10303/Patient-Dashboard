"use client";

const ISSUES = [
  "allergic reaction","broken arm","ear infection","fever",
  "headache","rash","sinusitis","sore throat","sprained ankle","stomach ache",
];

const selectStyle: React.CSSProperties = {
  background: "#faf7ff",
  border: "1.5px solid #e8dff7",
  color: "#7c6f99",
  borderRadius: "12px",
  padding: "9px 12px",
  fontSize: "13px",
  outline: "none",
  cursor: "pointer",
  fontFamily: "'Nunito', sans-serif",
  fontWeight: 600,
  transition: "border-color 0.2s",
};

interface FiltersProps {
  issue: string; minAge: string; maxAge: string;
  sortBy: string; sortOrder: string;
  onIssueChange: (v: string) => void;
  onMinAgeChange: (v: string) => void;
  onMaxAgeChange: (v: string) => void;
  onSortByChange: (v: string) => void;
  onSortOrderChange: (v: string) => void;
}

export default function Filters({
  issue, minAge, maxAge, sortBy, sortOrder,
  onIssueChange, onMinAgeChange, onMaxAgeChange, onSortByChange, onSortOrderChange,
}: FiltersProps) {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "10px", alignItems: "center" }}>
      <select value={issue} onChange={(e) => onIssueChange(e.target.value)} style={selectStyle}>
        <option value="">All Conditions</option>
        {ISSUES.map(i => <option key={i} value={i}>{i.charAt(0).toUpperCase() + i.slice(1)}</option>)}
      </select>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <input type="number" value={minAge} onChange={(e) => onMinAgeChange(e.target.value)}
          placeholder="Min age" min={0} max={120}
          style={{ ...selectStyle, width: "90px" }} />
        <span style={{ color: "#c4b5fd", fontWeight: 700 }}>—</span>
        <input type="number" value={maxAge} onChange={(e) => onMaxAgeChange(e.target.value)}
          placeholder="Max age" min={0} max={120}
          style={{ ...selectStyle, width: "90px" }} />
      </div>

      <select value={sortBy} onChange={(e) => onSortByChange(e.target.value)} style={selectStyle}>
        <option value="patient_name">Sort: Name</option>
        <option value="age">Sort: Age</option>
      </select>

      <button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        style={{
          ...selectStyle,
          color: "#9b6dff", background: "#f5f0ff",
          borderColor: "#ddd6fe", fontWeight: 800,
          padding: "9px 16px", cursor: "pointer",
          transition: "all 0.2s",
        }}
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}