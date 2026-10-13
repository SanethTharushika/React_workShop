import { useState } from "react";

const ITEM_H = 44; // height of each category row (px)
const GAP = 4;     // space between rows (px)

export default function CategorySidebar({ categories, products, selected, onSelect }) {
    const [open, setOpen] = useState(false);

    const items = ["All", ...categories];

    const countFor = (cat) =>
        cat === "All" ? products.length : products.filter((p) => p.category === cat).length;

    const activeIndex = Math.max(0, items.indexOf(selected));

    const list = (
        <div className="relative">
            {/* Sliding highlight */}
            <div
                className="absolute left-0 top-0 w-full rounded-xl bg-white shadow-lg"
                style={{
                    height: ITEM_H,
                    transform: `translateY(${activeIndex * (ITEM_H + GAP)}px)`,
                    transition: "transform 400ms cubic-bezier(0.34, 1.56, 0.64, 1)",
                }}
            />

            <ul className="relative flex flex-col" style={{ gap: GAP }}>
                {items.map((cat, i) => {
                    const active = selected === cat;
                    const count = countFor(cat);
                    return (
                        <li
                            key={cat}
                            style={{
                                animation: "sbSlideIn 450ms cubic-bezier(0.22, 1, 0.36, 1) both",
                                animationDelay: `${i * 70}ms`,
                            }}
                        >
                            <button
                                onClick={() => {
                                    onSelect(cat);
                                    setOpen(false);
                                }}
                                style={{ height: ITEM_H }}
                                className={`group flex w-full items-center justify-between rounded-xl px-4 text-sm
                                            transition-all duration-300
                                            ${active
                                        ? "font-semibold text-accent"
                                        : "text-white/70 hover:translate-x-1 hover:text-white"}`}
                            >
                                <span className="flex items-center gap-2 capitalize">
                                    <span
                                        className={`text-xs transition-all duration-300
                                                    ${active
                                                ? "translate-x-0 opacity-100"
                                                : "-translate-x-2 opacity-0 group-hover:translate-x-0 group-hover:opacity-100"}`}
                                    >
                                        ➜
                                    </span>
                                    {cat === "All" ? "All Products" : cat}
                                </span>

                                <span
                                    key={`${cat}-${count}`}
                                    style={{ animation: "sbPop 350ms ease-out" }}
                                    className={`rounded-full px-2 py-0.5 text-xs font-medium transition-colors duration-300
                                                ${active
                                            ? "bg-accent text-white"
                                            : "bg-white/15 text-white/80 group-hover:bg-white/25"}`}
                                >
                                    {count}
                                </span>
                            </button>
                        </li>
                    );
                })}
            </ul>
        </div>
    );

    return (
        <>
            <style>{`
                @keyframes sbSlideIn {
                    from { opacity: 0; transform: translateX(-24px); }
                    to   { opacity: 1; transform: translateX(0); }
                }
                @keyframes sbPop {
                    0%   { transform: scale(0.6); }
                    60%  { transform: scale(1.25); }
                    100% { transform: scale(1); }
                }
            `}</style>

            {/* Mobile: open button */}
            <button
                onClick={() => setOpen(true)}
                className="m-4 self-start rounded-lg bg-accent px-4 py-2 text-sm font-medium text-white
                           transition-all duration-200 hover:brightness-110 active:scale-95 lg:hidden"
            >
                ☰ Categories
            </button>

            {/* Desktop sidebar */}
            <aside className="sticky top-0 hidden h-screen w-64 shrink-0 overflow-y-auto bg-accent p-4 shadow-xl lg:block">
                <h3 className="mb-5 px-4 pt-2 text-m font-semibold uppercase tracking-widest text-white">
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
                    className={`absolute left-0 top-0 h-full w-72 bg-accent p-4 shadow-2xl
                                transition-transform duration-300
                                ${open ? "translate-x-0" : "-translate-x-full"}`}
                    style={{ transitionTimingFunction: "cubic-bezier(0.22, 1, 0.36, 1)" }}
                >
                    <div className="mb-5 flex items-center justify-between px-4 pt-2">
                        <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                            Categories
                        </h3>
                        <button
                            onClick={() => setOpen(false)}
                            className="text-xl text-white/70 transition-all duration-200 hover:rotate-90 hover:text-white"
                        >
                            ✕
                        </button>
                    </div>
                    {/* key makes the staggered entrance replay every time the drawer opens */}
                    <div key={String(open)}>{list}</div>
                </div>
            </div>
        </>
    );
}