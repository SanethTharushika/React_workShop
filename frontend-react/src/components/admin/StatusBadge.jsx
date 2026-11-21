const tones = {
    green: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    red: "bg-red-50 text-red-700 ring-red-200",
    amber: "bg-amber-50 text-amber-700 ring-amber-200",
    blue: "bg-blue-50 text-blue-700 ring-blue-200",
    purple: "bg-violet-50 text-violet-700 ring-violet-200",
    gray: "bg-slate-100 text-slate-600 ring-slate-200",
};

const dots = {
    green: "bg-emerald-500",
    red: "bg-red-500",
    amber: "bg-amber-500",
    blue: "bg-blue-500",
    purple: "bg-violet-500",
    gray: "bg-slate-400",
};

export default function StatusBadge({ tone = "gray", children }) {
    return (
        <span
            className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-1 text-xs
                        font-semibold ring-1 ring-inset ${tones[tone] || tones.gray}`}
        >
            <span className={`h-1.5 w-1.5 rounded-full ${dots[tone] || dots.gray}`} />
            {children}
        </span>
    );
}

// Picks a badge color from an order status text.
// Adjust the words to match the statuses your backend really uses.
export function orderStatusTone(status) {
    const s = String(status || "").toLowerCase();

    if (s.includes("cancel") || s.includes("reject") || s.includes("return") || s.includes("fail")) return "red";
    if (s.includes("deliver") || s.includes("complete") || s.includes("paid")) return "green";
    if (s.includes("ship") || s.includes("process") || s.includes("dispatch")) return "blue";
    if (s.includes("pending") || s.includes("hold") || s.includes("wait")) return "amber";

    return "gray";
}