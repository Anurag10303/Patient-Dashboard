"use client";
import { useEffect, useRef } from "react";

export default function SearchBar({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => onChange(e.target.value), 300);
  };

  useEffect(() => () => { if (debounceRef.current) clearTimeout(debounceRef.current); }, []);

  return (
    <div style={{ position: "relative" }}>
      <svg style={{ position: "absolute", left: 12, top: "50%", transform: "translateY(-50%)", width: 15, height: 15 }}
        fill="none" stroke="#b3a8cc" strokeWidth="2.5" viewBox="0 0 24 24">
        <circle cx="11" cy="11" r="8" /><path d="m21 21-4.35-4.35" />
      </svg>
      <input
        type="text"
        defaultValue={value}
        onChange={handleChange}
        placeholder="Search by name or email..."
        style={{
          background: "#faf7ff",
          border: "1.5px solid #e8dff7",
          color: "#2d2440",
          borderRadius: "12px",
          padding: "9px 14px 9px 36px",
          fontSize: "13px",
          width: "250px",
          outline: "none",
          fontFamily: "'Nunito', sans-serif",
          fontWeight: 500,
          transition: "border-color 0.2s, box-shadow 0.2s",
        }}
        onFocus={(e) => {
          e.target.style.borderColor = "#9b6dff";
          e.target.style.boxShadow = "0 0 0 3px #9b6dff18";
        }}
        onBlur={(e) => {
          e.target.style.borderColor = "#e8dff7";
          e.target.style.boxShadow = "none";
        }}
      />
    </div>
  );
}