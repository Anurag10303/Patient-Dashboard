import { NextRequest, NextResponse } from "next/server";
import { readFileSync } from "fs";
import path from "path";
import { Patient, PatientQueryParams } from "@/types/patient";

// Read JSON once at module level (cached between requests)
const loadPatients = (): Patient[] => {
  const filePath = path.join(process.cwd(), "data", "MOCK_DATA.json");
  const fileContent = readFileSync(filePath, "utf-8");
  return JSON.parse(fileContent) as Patient[];
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

    let patients = loadPatients();

    // 1. Search — by name or email
    if (params.search) {
      const query = params.search.toLowerCase();
      patients = patients.filter(
        (p) =>
          p.patient_name.toLowerCase().includes(query) ||
          p.contact[0]?.email?.toLowerCase().includes(query)
      );
    }

    // 2. Filter by medical issue
    if (params.issue) {
      patients = patients.filter((p) => p.medical_issue === params.issue);
    }

    // 3. Filter by age range
    if (params.minAge) {
      patients = patients.filter((p) => p.age >= parseInt(params.minAge!));
    }
    if (params.maxAge) {
      patients = patients.filter((p) => p.age <= parseInt(params.maxAge!));
    }

    // 4. Sort
    const sortOrder = params.sortOrder === "desc" ? -1 : 1;
    patients = patients.sort((a, b) => {
      if (params.sortBy === "age") {
        return (a.age - b.age) * sortOrder;
      }
      // default: sort by name
      return a.patient_name.localeCompare(b.patient_name) * sortOrder;
    });

    // 5. Pagination
    const total = patients.length;
    const page = parseInt(params.page!);
    const limit = parseInt(params.limit!);
    const totalPages = Math.ceil(total / limit);
    const offset = (page - 1) * limit;
    const paginated = patients.slice(offset, offset + limit);

    return NextResponse.json({
      data: paginated,
      total,
      page,
      totalPages,
    });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Failed to load patient data" },
      { status: 500 }
    );
  }
}

