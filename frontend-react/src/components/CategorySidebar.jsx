import { useState } from "react";

export default function CategorySidebar({ categories, products, selected, onSelect }) {
    const [open, setOpen] = useState(false);

    const countFor = (cat) =>
        cat === "All" ? products.length : products.filter((p) => p.category === cat).length;

    const list = (
        <ul className="space-y-1">
            {["All", ...categories].map((cat) => {
                const active = selected === cat;
                return (
                    <li key={cat}>
                        <button
                            onClick={() => {
                                onSelect(cat);
                                setOpen(false);
                            }}
                            className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-sm
                                        transition-all duration-200
                                        ${active
                                    ? "bg-accent font-semibold text-white shadow-md"
                                    : "text-gray-600 hover:translate-x-1 hover:bg-gray-100"}`}
                        >
                            <span className="capitalize">{cat === "All" ? "All Products" : cat}</span>
                            <span
                                className={`rounded-full px-2 py-0.5 text-xs
                                            ${active ? "bg-white/20 text-white" : "bg-gray-100 text-gray-500"}`}
                            >
                                {countFor(cat)}
                            </span>
                        </button>
                    </li>
                );
            })}
        </ul>
    );

    return (
        <>
            {/* Mobile: open button */}
            <button
                onClick={() => setOpen(true)}
                className="m-4 self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                           transition-all active:scale-95 lg:hidden"
            >
                ☰ Categories
            </button>

            {/* Desktop: full-height navigation sidebar on the left edge */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto border-r border-gray-200
                              bg-white p-4 shadow-lg lg:block">
                <h3 className="mb-4 px-3 pt-2 text-xs font-semibold uppercase tracking-wider text-gray-400">
                    Categories
                </h3>
                {list}
            </aside>

            {/* Mobile drawer */}
            <div
                className={`fixed inset-0 z-50 lg:hidden ${open ? "pointer-events-auto" : "pointer-events-none"}`}
            >
                <div
                    onClick={() => setOpen(false)}
                    className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300
                                ${open ? "opacity-100" : "opacity-0"}`}
                />
                <div
                    className={`absolute left-0 top-0 h-full w-72 bg-white p-4 shadow-2xl
                                transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}
                >
                    <div className="mb-3 flex items-center justify-between px-3">
                        <h3 className="text-xs font-semibold uppercase tracking-wider text-gray-400">
                            Categories
                        </h3>
                        <button onClick={() => setOpen(false)} className="text-xl text-gray-500">
                            ✕
                        </button>
                    </div>
                    {list}
                </div>
            </div>
        </>
    );
}