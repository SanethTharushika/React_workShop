export default function Pagination({
    pageNumber,
    pageSize,
    totalItems,
    totalPages,
    onPageChange,
    onPageSizeChange,
    pageSizeOptions = [5, 10, 20, 50],
}) {
    const from = totalItems === 0 ? 0 : (pageNumber - 1) * pageSize + 1;
    const to = Math.min(pageNumber * pageSize, totalItems);

    const buttonClass =
        "rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-600 transition-all " +
        "duration-200 hover:-translate-y-0.5 hover:border-accent hover:text-accent active:scale-95 " +
        "disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0 " +
        "disabled:hover:border-slate-200 disabled:hover:text-slate-600";

    return (
        <div
            className="mt-4 flex flex-col gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-sm
                       sm:flex-row sm:items-center sm:justify-between"
        >
            <p className="text-sm text-slate-500">
                Showing <span className="font-semibold text-slate-800">{from}–{to}</span> of{" "}
                <span className="font-semibold text-slate-800">{totalItems}</span>
            </p>

            <div className="flex flex-wrap items-center gap-3">
                <select
                    aria-label="Rows per page"
                    value={pageSize}
                    onChange={(e) => onPageSizeChange(Number(e.target.value))}
                    className="h-10 rounded-lg border border-slate-200 bg-white px-2 text-sm text-slate-700 outline-none
                               transition focus:border-accent focus:ring-4 focus:ring-blue-100"
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size} per page
                        </option>
                    ))}
                </select>

                <button
                    type="button"
                    disabled={pageNumber <= 1}
                    onClick={() => onPageChange(pageNumber - 1)}
                    className={buttonClass}
                >
                    Previous
                </button>

                <span className="text-sm font-medium text-slate-600">
                    Page {pageNumber} of {totalPages}
                </span>

                <button
                    type="button"
                    disabled={pageNumber >= totalPages}
                    onClick={() => onPageChange(pageNumber + 1)}
                    className={buttonClass}
                >
                    Next
                </button>
            </div>
        </div>
    );
}