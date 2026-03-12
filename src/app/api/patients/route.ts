import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { Patient, PatientQueryParams } from "@/types/patient";

const loadPatients = (): Patient[] => {
  const filePath = path.join(process.cwd(), "data", "MOCK_DATA.json");
  return JSON.parse(readFileSync(filePath, "utf-8")) as Patient[];
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const params: PatientQueryParams = {
      page: searchParams.get("page") ?? "1",
      limit: searchParams.get("limit") ?? "20",
      search: searchParams.get("search") ?? "",
      issue: searchParams.get("issue") ?? "",
      minAge: searchParams.get("minAge") ?? "",
      maxAge: searchParams.get("maxAge") ?? "",
      sortBy: searchParams.get("sortBy") ?? "patient_name",
      sortOrder: searchParams.get("sortOrder") ?? "asc",
    };

    const allPatients = loadPatients();
    let patients = [...allPatients];

    // Search
    if (params.search) {
      const q = params.search.toLowerCase();
      patients = patients.filter(p =>
        p.patient_name.toLowerCase().includes(q) ||
        p.contact[0]?.email?.toLowerCase().includes(q)
      );
    }

    // Filter by issue
    if (params.issue) patients = patients.filter(p => p.medical_issue === params.issue);

    // Filter by age
    if (params.minAge) patients = patients.filter(p => p.age >= parseInt(params.minAge!));
    if (params.maxAge) patients = patients.filter(p => p.age <= parseInt(params.maxAge!));

    // Sort
    const order = params.sortOrder === "desc" ? -1 : 1;
    patients.sort((a, b) =>
      params.sortBy === "age"
        ? (a.age - b.age) * order
        : a.patient_name.localeCompare(b.patient_name) * order
    );

    // Pagination
    const total = patients.length;
    const page = parseInt(params.page!);
    const limit = parseInt(params.limit!);
    const totalPages = Math.ceil(total / limit);
    const paginated = patients.slice((page - 1) * limit, page * limit);

    // --- Stats (computed from ALL 1000 records, not filtered) ---
    const avgAge = Math.round(allPatients.reduce((s, p) => s + p.age, 0) / allPatients.length);
    const issueCounts = allPatients.reduce<Record<string, number>>((acc, p) => {
      acc[p.medical_issue] = (acc[p.medical_issue] ?? 0) + 1;
      return acc;
    }, {});
    const topCondition = Object.entries(issueCounts).sort((a, b) => b[1] - a[1])[0][0];
    const noContact = allPatients.filter(p =>
      !p.contact[0]?.email && !p.contact[0]?.number
    ).length;

    return NextResponse.json({
      data: paginated,
      total,
      page,
      totalPages,
      stats: {
        totalAll: allPatients.length,
        avgAge,
        topCondition,
        noContact,
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: "Failed to load patient data" }, { status: 500 });
  }
}