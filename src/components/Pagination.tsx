interface PaginationProps {
  page: number; totalPages: number; total: number;
  limit: number; onPageChange: (p: number) => void;
}

export default function Pagination({ page, totalPages, total, limit, onPageChange }: PaginationProps) {
  const from = (page - 1) * limit + 1;
  const to = Math.min(page * limit, total);

  const getPages = (): (number | "...")[] => {
    if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
    if (page <= 4) return [1, 2, 3, 4, 5, "...", totalPages];
    if (page >= totalPages - 3) return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    return [1, "...", page - 1, page, page + 1, "...", totalPages];
  };

  const base: React.CSSProperties = {
    height: "36px", minWidth: "36px", borderRadius: "10px",
    border: "1.5px solid #e8dff7", background: "#faf7ff",
    color: "#7c6f99", fontSize: "13px", fontWeight: 700,
    cursor: "pointer", transition: "all 0.2s",
    fontFamily: "'Nunito', sans-serif", padding: "0 10px",
  };

  const active: React.CSSProperties = {
    ...base,
    background: "linear-gradient(135deg, #9b6dff, #c084fc)",
    color: "#fff", border: "none",
    boxShadow: "0 4px 14px #9b6dff44",
  };

  return (
    <div style={{
      display: "flex", alignItems: "center",
      justifyContent: "space-between", marginTop: "32px",
      paddingTop: "20px", borderTop: "1px solid #e8dff7",
    }}>
      <p style={{ fontSize: "13px", color: "#b3a8cc", fontWeight: 500 }}>
        Showing{" "}
        <span style={{ color: "#7c6f99", fontWeight: 700 }}>{from}–{to}</span>
        {" "}of{" "}
        <span style={{ color: "#9b6dff", fontWeight: 700 }}>{total}</span> patients
      </p>

      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        <button onClick={() => onPageChange(page - 1)} disabled={page === 1}
          style={{ ...base, opacity: page === 1 ? 0.35 : 1 }}>←</button>

        {getPages().map((p, i) =>
          p === "..." ? (
            <span key={`e${i}`} style={{ color: "#c4b5fd", padding: "0 4px", fontSize: "16px" }}>…</span>
          ) : (
            <button key={p} onClick={() => onPageChange(p as number)}
              style={p === page ? active : base}>{p}</button>
          )
        )}

        <button onClick={() => onPageChange(page + 1)} disabled={page === totalPages}
          style={{ ...base, opacity: page === totalPages ? 0.35 : 1 }}>→</button>
      </div>
    </div>
  );
}