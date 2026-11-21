export default function AdminPageHeader({ title, subtitle, count, countLabel, action }) {
    return (
        <div
            className="mb-6 flex flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm
                       sm:flex-row sm:items-center sm:justify-between"
        >
            <div>
                <h1 className="text-2xl font-bold tracking-tight text-slate-900">{title}</h1>
                {subtitle && <p className="mt-1 text-sm text-slate-500">{subtitle}</p>}
            </div>

            <div className="flex flex-wrap items-center gap-3">
                {count != null && (
                    <span className="rounded-full bg-blue-50 px-4 py-1.5 text-sm font-semibold text-accent">
                        {count} {countLabel}
                    </span>
                )}
                {action}
            </div>
        </div>
    );
}