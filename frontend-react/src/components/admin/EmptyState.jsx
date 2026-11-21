export default function EmptyState({ icon, title, message, action }) {
    return (
        <div className="flex flex-col items-center justify-center px-6 py-16 text-center">
            <span className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-3xl text-slate-300">
                {icon}
            </span>
            <h3 className="text-base font-semibold text-slate-700">{title}</h3>
            {message && <p className="mt-1 max-w-sm text-sm text-slate-500">{message}</p>}
            {action && <div className="mt-5">{action}</div>}
        </div>
    );
}