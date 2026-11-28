import { useEffect, useRef } from "react";
import { FiSearch, FiX } from "react-icons/fi";

export default function ProductSearchBar({ value, onChange, onSearch, onClear, searching = false }) {

    const inputRef = useRef(null);

    // Press "/" anywhere on the page to jump to the search bar
    useEffect(() => {
        function onKey(e) {
            const tag = e.target.tagName;
            const typing =
                tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;

            if (e.key === "/" && !typing) {
                e.preventDefault();
                inputRef.current?.focus();
            }
        }

        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    return (
        <form
            role="search"
            onSubmit={(e) => {
                e.preventDefault();
                onSearch();
            }}
            className="w-full"
        >
            <div
                className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white pl-5 pr-4 shadow-md
                           transition-all duration-300 hover:shadow-lg
                           focus-within:-translate-y-0.5 focus-within:border-accent focus-within:shadow-xl
                           focus-within:ring-4 focus-within:ring-blue-100"
            >
                {/* Search icon */}
                <FiSearch
                    className="shrink-0 text-xl text-gray-400 transition-colors duration-300 group-focus-within:text-accent"
                />

                {/* Input */}
                <input
                    ref={inputRef}
                    type="text"
                    aria-label="Search products"
                    placeholder="Search RAM, graphic cards, processors..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="h-14 min-w-0 flex-1 bg-transparent px-2 text-sm text-gray-800 outline-none
                               placeholder:text-gray-400 sm:text-base"
                />

                {/* Right side: spinner while searching, otherwise clear button or shortcut hint */}
                {searching ? (
                    <span
                        role="status"
                        aria-label="Searching"
                        className="h-5 w-5 shrink-0 animate-spin rounded-full border-2 border-accent/30 border-t-accent"
                    />
                ) : value ? (
                    <button
                        type="button"
                        aria-label="Clear search"
                        onClick={() => {
                            onClear();
                            inputRef.current?.focus();
                        }}
                        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-gray-400
                                   transition-all duration-200 hover:rotate-90 hover:bg-gray-100 hover:text-gray-600"
                    >
                        <FiX />
                    </button>
                ) : (
                    <kbd>
                        
                    </kbd>
                )}
            </div>
        </form>
    );
}