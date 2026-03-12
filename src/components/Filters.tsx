"use client";

const MEDICAL_ISSUES = [
  "allergic reaction",
  "broken arm",
  "ear infection",
  "fever",
  "headache",
  "rash",
  "sinusitis",
  "sore throat",
  "sprained ankle",
  "stomach ache",
];

interface FiltersProps {
  issue: string;
  minAge: string;
  maxAge: string;
  sortBy: string;
  sortOrder: string;
  onIssueChange: (val: string) => void;
  onMinAgeChange: (val: string) => void;
  onMaxAgeChange: (val: string) => void;
  onSortByChange: (val: string) => void;
  onSortOrderChange: (val: string) => void;
}

export default function Filters({
  issue, minAge, maxAge, sortBy, sortOrder,
  onIssueChange, onMinAgeChange, onMaxAgeChange,
  onSortByChange, onSortOrderChange,
}: FiltersProps) {
  return (
    <div className="flex flex-wrap gap-3 items-center">
      {/* Medical Issue Filter */}
      <select
        value={issue}
        onChange={(e) => onIssueChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="">All Conditions</option>
        {MEDICAL_ISSUES.map((i) => (
          <option key={i} value={i}>
            {i.charAt(0).toUpperCase() + i.slice(1)}
          </option>
        ))}
      </select>

      {/* Age Range Filter */}
      <div className="flex items-center gap-2">
        <input
          type="number"
          value={minAge}
          onChange={(e) => onMinAgeChange(e.target.value)}
          placeholder="Min age"
          min={0}
          max={120}
          className="w-24 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <span className="text-gray-400 text-sm">–</span>
        <input
          type="number"
          value={maxAge}
          onChange={(e) => onMaxAgeChange(e.target.value)}
          placeholder="Max age"
          min={0}
          max={120}
          className="w-24 px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Sort By */}
      <select
        value={sortBy}
        onChange={(e) => onSortByChange(e.target.value)}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="patient_name">Sort by Name</option>
        <option value="age">Sort by Age</option>
      </select>

      {/* Sort Order */}
      <button
        onClick={() => onSortOrderChange(sortOrder === "asc" ? "desc" : "asc")}
        className="px-3 py-2 rounded-lg border border-gray-300 bg-white text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {sortOrder === "asc" ? "↑ Asc" : "↓ Desc"}
      </button>
    </div>
  );
}