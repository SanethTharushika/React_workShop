import { FiSearch, FiX } from "react-icons/fi";

export default function SearchInput({ value, onChange, placeholder = "Search...", label = "Search", className = "" }) {
    return (
        <div className={`group relative ${className}`}>
            <FiSearch
                className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-lg text-slate-400
                           transition-colors duration-300 group-focus-within:text-accent"
            />

            <input
                type="text"
                aria-label={label}
                placeholder={placeholder}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="h-11 w-full rounded-xl border border-slate-200 bg-white pl-10 pr-10 text-sm text-slate-800
                           outline-none transition placeholder:text-slate-400
                           focus:border-accent focus:ring-4 focus:ring-blue-100"
            />

            {value && (
                <button
                    type="button"
                    aria-label="Clear search"
                    onClick={() => onChange("")}
                    className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center
                               rounded-full text-slate-400 transition-all duration-200
                               hover:rotate-90 hover:bg-slate-100 hover:text-slate-600"
                >
                    <FiX />
                </button>
            )}
        </div>
    );
}