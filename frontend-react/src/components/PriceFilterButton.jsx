import { useEffect, useRef, useState } from "react";
import { FiChevronDown, FiSliders, FiX } from "react-icons/fi";
import { getFormattedPrice } from "../utils/price-formatter.jsx";
import PriceRangeFilter from "./PriceRangeFilter.jsx";

export default function PriceFilterButton({ bounds, value, onChange, className = "" }) {

    const [open, setOpen] = useState(false);
    const wrapperRef = useRef(null);
    const buttonRef = useRef(null);
    const panelRef = useRef(null);

    function close(restoreFocus = false) {
        setOpen(false);
        if (restoreFocus) buttonRef.current?.focus();
    }

    // Outside click / touch and Esc close the popover
    useEffect(() => {
        if (!open) return;

        const onPointer = (e) => {
            if (!wrapperRef.current?.contains(e.target)) setOpen(false);
        };
        const onKey = (e) => {
            if (e.key === "Escape") {
                setOpen(false);
                buttonRef.current?.focus();
            }
        };

        document.addEventListener("mousedown", onPointer);
        document.addEventListener("touchstart", onPointer);
        document.addEventListener("keydown", onKey);

        return () => {
            document.removeEventListener("mousedown", onPointer);
            document.removeEventListener("touchstart", onPointer);
            document.removeEventListener("keydown", onKey);
        };
    }, [open]);

    // Move focus into the popover when it opens
    useEffect(() => {
        if (!open) return;
        const timer = setTimeout(() => panelRef.current?.focus(), 30);
        return () => clearTimeout(timer);
    }, [open]);

    // Nothing to filter (no products, or every product has the same price)
    if (!bounds || bounds.max <= bounds.min) return null;

    const active = Boolean(value);
    const label = active
        ? `Price: ${getFormattedPrice(value[0])} – ${getFormattedPrice(value[1])}`
        : "Price";

    return (
        <div
            ref={wrapperRef}
            className={`relative ${className}`}
            onBlur={(e) => {
                // Tabbing out of the popover closes it
                if (open && e.relatedTarget && !wrapperRef.current?.contains(e.relatedTarget)) {
                    setOpen(false);
                }
            }}
        >

            {/* Pill: Price button (+ clear button when a range is active) */}
            <div
                className={`flex h-12 w-full items-center rounded-full border shadow-md transition-all duration-300 sm:h-14
                            ${active
                        ? "border-accent bg-accent text-white hover:brightness-110"
                        : `border-gray-200 bg-white text-gray-700 hover:shadow-lg
                           ${open ? "border-accent ring-4 ring-blue-100" : ""}`}`}
            >
                <button
                    ref={buttonRef}
                    type="button"
                    aria-haspopup="dialog"
                    aria-expanded={open}
                    aria-controls="price-filter-popover"
                    onClick={() => (open ? close(false) : setOpen(true))}
                    className={`flex h-full min-w-0 flex-1 items-center justify-center gap-2 rounded-full pl-4 text-sm font-medium
                                focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent
                                focus-visible:ring-offset-2 ${active ? "pr-2" : "pr-4"}`}
                >
                    <FiSliders className="shrink-0 text-lg" />
                    <span className="max-w-[170px] truncate sm:max-w-[230px]">{label}</span>
                    {!active && (
                        <FiChevronDown
                            className={`shrink-0 transition-transform duration-300 ${open ? "rotate-180" : ""}`}
                        />
                    )}
                </button>

                {active && (
                    <button
                        type="button"
                        aria-label="Clear price range"
                        title="Clear price range"
                        onClick={() => onChange(null)}
                        className="mr-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full transition-all
                                   duration-200 hover:rotate-90 hover:bg-white/20 focus-visible:outline-none
                                   focus-visible:ring-2 focus-visible:ring-white"
                    >
                        <FiX />
                    </button>
                )}
            </div>

            {/* Backdrop (mobile bottom sheet only) */}
            <div
                aria-hidden="true"
                onClick={() => close(true)}
                className={`fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-300 sm:hidden
                            ${open ? "opacity-100" : "pointer-events-none opacity-0"}`}
            />

            {/* Popover on desktop, bottom sheet on mobile (above the bottom navigation bar) */}
            <div
                ref={panelRef}
                id="price-filter-popover"
                role="dialog"
                aria-label="Price range filter"
                tabIndex={-1}
                className={`z-[70] bg-white shadow-2xl outline-none transition-[opacity,transform,visibility] duration-300
                            fixed inset-x-0 bottom-0 max-h-[85vh] overflow-y-auto rounded-t-3xl px-5 pt-3
                            pb-[calc(1.25rem_+_env(safe-area-inset-bottom))]
                            sm:absolute sm:inset-x-auto sm:bottom-auto sm:right-0 sm:top-full sm:mt-2 sm:max-h-none
                            sm:w-80 sm:overflow-visible sm:rounded-2xl sm:border sm:border-gray-100 sm:p-5
                            sm:shadow-xl sm:duration-200
                            ${open
                        ? "visible translate-y-0 opacity-100"
                        : "pointer-events-none invisible translate-y-full opacity-0 sm:translate-y-2"}`}
            >
                {/* Drag handle look (mobile) */}
                <div className="mx-auto mb-4 h-1.5 w-10 rounded-full bg-gray-200 sm:hidden" />

                <PriceRangeFilter variant="light" bounds={bounds} value={value} onChange={onChange} />

                <button
                    type="button"
                    onClick={() => close(true)}
                    className="mt-5 w-full rounded-xl bg-accent px-4 py-3 text-sm font-semibold text-white transition-all
                               duration-200 hover:brightness-110 active:scale-95"
                >
                    Done
                </button>
            </div>
        </div>
    );
}