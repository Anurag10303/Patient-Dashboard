"use client";

import { useEffect, useState, useCallback } from "react";
import { Patient, PatientsApiResponse } from "@/types/patient";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import PatientCard from "@/components/PatientCard";
import PatientRow from "@/components/PatientRow";
import Pagination from "@/components/Pagination";

interface FilterState {
  search: string; issue: string; minAge: string; maxAge: string;
  sortBy: string; sortOrder: string; page: number; limit: number;
}

const INITIAL_FILTERS: FilterState = {
  search: "", issue: "", minAge: "", maxAge: "",
  sortBy: "patient_name", sortOrder: "asc", page: 1, limit: 20,
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [view, setView] = useState<"card" | "row">("card");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const buildQuery = useCallback((f: FilterState) => {
    const p = new URLSearchParams();
    if (f.search) p.set("search", f.search);
    if (f.issue)  p.set("issue", f.issue);
    if (f.minAge) p.set("minAge", f.minAge);
    if (f.maxAge) p.set("maxAge", f.maxAge);
    p.set("sortBy", f.sortBy); p.set("sortOrder", f.sortOrder);
    p.set("page", String(f.page)); p.set("limit", String(f.limit));
    return p.toString();
  }, []);

  useEffect(() => {
    const fetch_ = async () => {
      setLoading(true); setError(null);
      try {
        const res = await fetch(`/api/patients?${buildQuery(filters)}`);
        if (!res.ok) throw new Error();
        const json: PatientsApiResponse = await res.json();
        setPatients(json.data); setTotal(json.total); setTotalPages(json.totalPages);
      } catch { setError("Failed to load patients. Please try again."); }
      finally { setLoading(false); }
    };
    fetch_();
  }, [filters, buildQuery]);

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) =>
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));

  const resetFilters = () => setFilters(INITIAL_FILTERS);
  const hasActive = filters.search || filters.issue || filters.minAge || filters.maxAge;

  return (
    <main style={{ minHeight: "100vh", padding: "36px 24px 60px" }}>
      {/* Decorative blobs */}
      <div className="blob1" style={{
        position: "fixed", top: "-80px", right: "-80px", width: "400px", height: "400px",
        borderRadius: "50%", background: "radial-gradient(circle, #ddd6fe66, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />
      <div className="blob2" style={{
        position: "fixed", bottom: "-60px", left: "-60px", width: "350px", height: "350px",
        borderRadius: "50%", background: "radial-gradient(circle, #fbcfe866, transparent 70%)",
        pointerEvents: "none", zIndex: 0,
      }} />

      <div style={{ maxWidth: "1400px", margin: "0 auto", position: "relative", zIndex: 1 }}>

        {/* ── Header ── */}
        <div className="header-enter" style={{ marginBottom: "32px" }}>
          {/* Pill tag */}
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "6px",
            background: "#ede9fe", border: "1px solid #c4b5fd",
            borderRadius: "999px", padding: "4px 14px",
            fontSize: "12px", fontWeight: 700, color: "#7c3aed",
            letterSpacing: "0.06em", textTransform: "uppercase",
            marginBottom: "12px",
          }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#7c3aed", display: "inline-block" }} />
            Medical Records
          </div>

          <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h1 style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(28px, 4vw, 42px)",
                fontWeight: 800,
                color: "#2d2440",
                lineHeight: 1.15,
                margin: 0,
                letterSpacing: "-0.02em",
              }}>
                Patient Dashboard
                <span style={{
                  display: "inline-block", marginLeft: "12px",
                  background: "linear-gradient(135deg, #9b6dff, #ff7eb3)",
                  borderRadius: "12px", padding: "2px 14px",
                  fontSize: "clamp(14px, 2vw, 20px)", fontWeight: 700,
                  color: "#fff", verticalAlign: "middle",
                  fontFamily: "'Nunito', sans-serif",
                }}>
                  {total > 0 ? total.toLocaleString() : "—"}
                </span>
              </h1>
              <p style={{ color: "#9c8db8", fontSize: "15px", marginTop: "6px", fontWeight: 500 }}>
                Search, filter and manage all patient records
              </p>
            </div>

            {/* View toggle */}
            <div style={{
              display: "flex", background: "#ede9fe",
              border: "1px solid #c4b5fd", borderRadius: "14px",
              padding: "5px", gap: "4px",
            }}>
              {(["card", "row"] as const).map((v) => (
                <button key={v} onClick={() => setView(v)} style={{
                  padding: "8px 18px", borderRadius: "10px",
                  fontSize: "13px", fontWeight: 700, border: "none",
                  cursor: "pointer", transition: "all 0.2s",
                  fontFamily: "'Nunito', sans-serif",
                  background: view === v ? "linear-gradient(135deg, #9b6dff, #c084fc)" : "transparent",
                  color: view === v ? "#fff" : "#7c6f99",
                  boxShadow: view === v ? "0 4px 12px #9b6dff44" : "none",
                }}>
                  {v === "card" ? "⊞ Cards" : "☰ List"}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* ── Controls ── */}
        <div className="controls-enter" style={{
          background: "rgba(255,255,255,0.75)",
          backdropFilter: "blur(16px)",
          border: "1px solid #e8dff7",
          borderRadius: "20px",
          padding: "18px 22px",
          marginBottom: "28px",
          display: "flex", flexWrap: "wrap",
          gap: "12px", alignItems: "center",
          boxShadow: "0 4px 24px #9b6dff0d",
        }}>
          <SearchBar value={filters.search} onChange={(v) => updateFilter("search", v)} />
          <Filters
            issue={filters.issue} minAge={filters.minAge} maxAge={filters.maxAge}
            sortBy={filters.sortBy} sortOrder={filters.sortOrder}
            onIssueChange={(v) => updateFilter("issue", v)}
            onMinAgeChange={(v) => updateFilter("minAge", v)}
            onMaxAgeChange={(v) => updateFilter("maxAge", v)}
            onSortByChange={(v) => updateFilter("sortBy", v)}
            onSortOrderChange={(v) => updateFilter("sortOrder", v)}
          />
          {hasActive && (
            <button onClick={resetFilters} style={{
              background: "#fff0f5", border: "1px solid #fbb6ce",
              color: "#e05a8a", borderRadius: "10px",
              padding: "8px 16px", fontSize: "13px",
              fontWeight: 700, cursor: "pointer",
              fontFamily: "'Nunito', sans-serif",
              transition: "all 0.2s",
            }}>
              ✕ Clear
            </button>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#fff0f5", border: "1px solid #fbb6ce",
            borderRadius: "20px", padding: "40px",
            textAlign: "center",
          }}>
            <p style={{ fontSize: "40px", marginBottom: "12px" }}>⚠️</p>
            <p style={{ color: "#be185d", fontSize: "16px", fontWeight: 600 }}>{error}</p>
            <button onClick={() => setFilters(f => ({ ...f }))} style={{
              marginTop: "16px", background: "linear-gradient(135deg, #f472b6, #ec4899)",
              color: "#fff", border: "none", borderRadius: "12px",
              padding: "10px 24px", fontSize: "14px",
              fontWeight: 700, cursor: "pointer",
            }}>Retry</button>
          </div>
        )}

        {/* ── Loading Skeletons ── */}
        {loading && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "18px" }}>
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.8)", border: "1px solid #e8dff7",
                borderRadius: "20px", padding: "22px", height: "210px",
              }}>
                <div style={{ display: "flex", gap: "12px", marginBottom: "18px" }}>
                  <div className="skeleton" style={{ width: 48, height: 48, borderRadius: 14, flexShrink: 0 }} />
                  <div style={{ flex: 1 }}>
                    <div className="skeleton" style={{ height: 13, width: "70%", marginBottom: 8 }} />
                    <div className="skeleton" style={{ height: 11, width: "45%" }} />
                  </div>
                </div>
                <div className="skeleton" style={{ height: 26, width: "45%", borderRadius: 999, marginBottom: 18 }} />
                <div className="skeleton" style={{ height: 11, width: "90%", marginBottom: 8 }} />
                <div className="skeleton" style={{ height: 11, width: "60%" }} />
              </div>
            ))}
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && patients.length === 0 && (
          <div style={{ textAlign: "center", padding: "80px 0" }}>
            <div style={{ fontSize: "56px", marginBottom: "16px" }}>🔍</div>
            <h3 style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "24px", color: "#2d2440", marginBottom: "8px",
            }}>No patients found</h3>
            <p style={{ color: "#9c8db8", fontSize: "15px", marginBottom: "24px" }}>
              Try adjusting your search or filters
            </p>
            <button onClick={resetFilters} style={{
              background: "linear-gradient(135deg, #9b6dff, #c084fc)",
              color: "#fff", border: "none", borderRadius: "14px",
              padding: "12px 28px", fontSize: "15px",
              fontWeight: 700, cursor: "pointer",
              boxShadow: "0 6px 20px #9b6dff33",
              fontFamily: "'Nunito', sans-serif",
            }}>Clear all filters</button>
          </div>
        )}

        {/* ── Card View ── */}
        {!loading && !error && patients.length > 0 && view === "card" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(270px, 1fr))", gap: "18px" }}>
            {patients.map((p, i) => <PatientCard key={p.patient_id} patient={p} index={i} />)}
          </div>
        )}

        {/* ── Row View ── */}
        {!loading && !error && patients.length > 0 && view === "row" && (
          <div style={{
            background: "rgba(255,255,255,0.8)",
            backdropFilter: "blur(16px)",
            border: "1px solid #e8dff7",
            borderRadius: "20px", overflow: "hidden",
            boxShadow: "0 4px 24px #9b6dff0d",
            animation: "fadeIn 0.4s ease both",
          }}>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse" }}>
                <thead>
                  <tr style={{ background: "linear-gradient(135deg, #f5f0ff, #fdf4ff)", borderBottom: "1px solid #e8dff7" }}>
                    {["Patient", "Age", "Condition", "Email", "Phone", "Address"].map((h) => (
                      <th key={h} style={{
                        padding: "14px 20px", textAlign: "left",
                        fontSize: "11px", fontWeight: 800,
                        letterSpacing: "0.08em", color: "#9b6dff",
                        textTransform: "uppercase",
                        fontFamily: "'Nunito', sans-serif",
                      }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {patients.map((p, i) => <PatientRow key={p.patient_id} patient={p} index={i} />)}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* ── Pagination ── */}
        {!loading && !error && patients.length > 0 && (
          <Pagination
            page={filters.page} totalPages={totalPages} total={total}
            limit={filters.limit}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        )}
      </div>
    </main>
  );
}