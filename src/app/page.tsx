"use client";

import { useEffect, useState, useCallback } from "react";
import { Patient, PatientsApiResponse } from "@/types/patient";
import SearchBar from "@/components/SearchBar";
import Filters from "@/components/Filters";
import PatientCard from "@/components/PatientCard";
import PatientRow from "@/components/PatientRow";
import Pagination from "@/components/Pagination";

interface FilterState {
  search: string;
  issue: string;
  minAge: string;
  maxAge: string;
  sortBy: string;
  sortOrder: string;
  page: number;
  limit: number;
}

const INITIAL_FILTERS: FilterState = {
  search: "",
  issue: "",
  minAge: "",
  maxAge: "",
  sortBy: "patient_name",
  sortOrder: "asc",
  page: 1,
  limit: 20,
};

export default function Home() {
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTERS);
  const [view, setView] = useState<"card" | "row">("card");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Build query string from filters
  const buildQuery = useCallback((f: FilterState) => {
    const params = new URLSearchParams();
    if (f.search) params.set("search", f.search);
    if (f.issue) params.set("issue", f.issue);
    if (f.minAge) params.set("minAge", f.minAge);
    if (f.maxAge) params.set("maxAge", f.maxAge);
    params.set("sortBy", f.sortBy);
    params.set("sortOrder", f.sortOrder);
    params.set("page", String(f.page));
    params.set("limit", String(f.limit));
    return params.toString();
  }, []);

  // Fetch patients whenever filters change
  useEffect(() => {
    const fetchPatients = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`/api/patients?${buildQuery(filters)}`);
        if (!res.ok) throw new Error("Failed to fetch patients");
        const json: PatientsApiResponse = await res.json();
        setPatients(json.data);
        setTotal(json.total);
        setTotalPages(json.totalPages);
      } catch (err) {
        setError("Something went wrong. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [filters, buildQuery]);

  // Helper: update a single filter and reset to page 1
  const updateFilter = <K extends keyof FilterState>(
    key: K,
    value: FilterState[K]
  ) => {
    setFilters((prev) => ({ ...prev, [key]: value, page: 1 }));
  };

  const resetFilters = () => setFilters(INITIAL_FILTERS);

  const hasActiveFilters =
    filters.search || filters.issue || filters.minAge || filters.maxAge;

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">

        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Patient Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and view all patient records
          </p>
        </div>

        {/* Controls Bar */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 flex flex-wrap gap-4 items-center justify-between">
          {/* Left: Search + Filters */}
          <div className="flex flex-wrap gap-3 items-center">
            <SearchBar
              value={filters.search}
              onChange={(val) => updateFilter("search", val)}
            />
            <Filters
              issue={filters.issue}
              minAge={filters.minAge}
              maxAge={filters.maxAge}
              sortBy={filters.sortBy}
              sortOrder={filters.sortOrder}
              onIssueChange={(val) => updateFilter("issue", val)}
              onMinAgeChange={(val) => updateFilter("minAge", val)}
              onMaxAgeChange={(val) => updateFilter("maxAge", val)}
              onSortByChange={(val) => updateFilter("sortBy", val)}
              onSortOrderChange={(val) => updateFilter("sortOrder", val)}
            />
            {/* Reset button — only shows when filters are active */}
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="px-3 py-2 text-sm text-red-500 hover:text-red-700 hover:underline"
              >
                Clear filters
              </button>
            )}
          </div>

          {/* Right: View Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setView("card")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === "card"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ⊞ Cards
            </button>
            <button
              onClick={() => setView("row")}
              className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                view === "row"
                  ? "bg-white text-gray-900 shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
            >
              ☰ List
            </button>
          </div>
        </div>

        {/* Results count */}
        {!loading && !error && (
          <p className="text-sm text-gray-500 mb-4">
            {total} patient{total !== 1 ? "s" : ""} found
          </p>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center text-red-600">
            <p className="font-medium">{error}</p>
            <button
              onClick={() => setFilters((f) => ({ ...f }))}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-xl border border-gray-200 p-5 h-48 animate-pulse"
              >
                <div className="flex gap-3 mb-4">
                  <div className="w-12 h-12 bg-gray-200 rounded-full" />
                  <div className="flex-1 space-y-2 pt-1">
                    <div className="h-3 bg-gray-200 rounded w-3/4" />
                    <div className="h-3 bg-gray-200 rounded w-1/2" />
                  </div>
                </div>
                <div className="h-5 bg-gray-200 rounded w-1/3 mb-4" />
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-full" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && patients.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-4xl mb-3">🔍</p>
            <p className="font-medium text-gray-600">No patients found</p>
            <p className="text-sm mt-1">Try adjusting your search or filters</p>
            <button
              onClick={resetFilters}
              className="mt-4 px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700"
            >
              Clear all filters
            </button>
          </div>
        )}

        {/* Card View */}
        {!loading && !error && patients.length > 0 && view === "card" && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {patients.map((patient) => (
              <PatientCard key={patient.patient_id} patient={patient} />
            ))}
          </div>
        )}

        {/* Row / Table View */}
        {!loading && !error && patients.length > 0 && view === "row" && (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Patient</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Age</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Condition</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Email</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Phone</th>
                    <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Address</th>
                  </tr>
                </thead>
                <tbody>
                  {patients.map((patient) => (
                    <PatientRow key={patient.patient_id} patient={patient} />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Pagination */}
        {!loading && !error && patients.length > 0 && (
          <Pagination
            page={filters.page}
            totalPages={totalPages}
            total={total}
            limit={filters.limit}
            onPageChange={(p) => setFilters((prev) => ({ ...prev, page: p }))}
          />
        )}

      </div>
    </main>
  );
}