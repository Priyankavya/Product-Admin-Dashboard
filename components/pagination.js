"use client";

export default function Pagination({
  page,
  total,
  limit,
  onPageChange,
  onLimitChange,
}) {
  const totalPages = Math.max(1, Math.ceil(total / limit));

  const start = total === 0 ? 0 : (page - 1) * limit + 1;
  const end = Math.min(page * limit, total);

  function createPageNumbers() {
    const pages = [];

    const startPage = Math.max(1, page - 2);
    const endPage = Math.min(totalPages, page + 2);

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    return pages;
  }

  return (
    <div className="mt-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
      <p className="text-sm text-gray-600">
        Showing {start}–{end} of {total}
      </p>

      <div className="flex flex-wrap items-center gap-2">
        <select
          value={limit}
          onChange={(e) => onLimitChange(Number(e.target.value))}
          className="rounded-md border px-3 py-2"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>

        <button
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Previous
        </button>

        {createPageNumbers().map((pageNumber) => (
          <button
            key={pageNumber}
            onClick={() => onPageChange(pageNumber)}
            className={`rounded-md px-3 py-2 ${
              pageNumber === page
                ? "bg-blue-600 text-white"
                : "border bg-white"
            }`}
          >
            {pageNumber}
          </button>
        ))}

        <button
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="rounded-md border px-3 py-2 disabled:cursor-not-allowed disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}