// Placeholder rows: use inside <tbody> on desktop
export default function TableSkeleton({ rows = 6, columns = 5 }) {
    return (
        <>
            {Array.from({ length: rows }).map((_, r) => (
                <tr key={r} className="border-t border-slate-100">
                    {Array.from({ length: columns }).map((_, c) => (
                        <td key={c} className="px-4 py-4">
                            <div
                                className="h-4 animate-pulse rounded-md bg-slate-100"
                                style={{ width: `${55 + ((r + c) % 4) * 12}%` }}
                            />
                        </td>
                    ))}
                </tr>
            ))}
        </>
    );
}

// Placeholder cards: use in the mobile layout
export function CardSkeleton({ count = 4 }) {
    return (
        <div className="space-y-3">
            {Array.from({ length: count }).map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
                    <div className="mb-3 h-4 w-1/2 animate-pulse rounded-md bg-slate-100" />
                    <div className="mb-2 h-3 w-3/4 animate-pulse rounded-md bg-slate-100" />
                    <div className="h-3 w-1/3 animate-pulse rounded-md bg-slate-100" />
                </div>
            ))}
        </div>
    );
}