import { useEffect, useState } from "react";
import { getFormattedPrice } from "../utils/price-formatter.jsx";

function clamp(value, low, high) {
    return Math.min(Math.max(value, low), high);
}

export default function PriceRangeFilter({ bounds, value, onChange }) {

    const { min, max, step } = bounds;

    // Applied range (what the product list uses). null means no price filter.
    const appliedLo = value ? value[0] : min;
    const appliedHi = value ? value[1] : max;

    // Draft range (what the slider and boxes show while moving)
    const [draft, setDraft] = useState([appliedLo, appliedHi]);
    const [minText, setMinText] = useState(String(appliedLo));
    const [maxText, setMaxText] = useState(String(appliedHi));

    // Follow the applied range (bounds loaded, or reset from outside)
    useEffect(() => {
        setDraft([appliedLo, appliedHi]);
    }, [appliedLo, appliedHi]);

    // Keep the text boxes in step with the draft
    useEffect(() => {
        setMinText(String(draft[0]));
        setMaxText(String(draft[1]));
    }, [draft]);

    // Apply after a short pause so the list doesn't flicker while dragging
    useEffect(() => {
        if (draft[0] === appliedLo && draft[1] === appliedHi) return;

        const timer = setTimeout(() => {
            if (draft[0] <= min && draft[1] >= max) {
                onChange(null);
            } else {
                onChange([draft[0], draft[1]]);
            }
        }, 300);

        return () => clearTimeout(timer);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [draft]);

    if (max <= min) return null;

    function moveMin(e) {
        setDraft([Math.min(Number(e.target.value), draft[1]), draft[1]]);
    }

    function moveMax(e) {
        setDraft([draft[0], Math.max(Number(e.target.value), draft[0])]);
    }

    function commitMin() {
        let v = Number(minText);
        if (minText.trim() === "" || Number.isNaN(v)) v = draft[0];
        v = clamp(v, min, draft[1]);
        setDraft([v, draft[1]]);
        setMinText(String(v));
    }

    function commitMax() {
        let v = Number(maxText);
        if (maxText.trim() === "" || Number.isNaN(v)) v = draft[1];
        v = clamp(v, draft[0], max);
        setDraft([draft[0], v]);
        setMaxText(String(v));
    }

    const range = max - min;
    const left = ((draft[0] - min) / range) * 100;
    const right = ((draft[1] - min) / range) * 100;

    // When both thumbs overlap, keep the one that can still move on top
    const minOnTop = draft[0] > min + range / 2;

    const boxClass =
        "w-full rounded-lg border border-white/20 bg-white/10 px-2 py-1.5 text-sm text-white outline-none " +
        "transition focus:border-white/60 focus:bg-white/15";

    return (
        <div>
            <style>{`
                .price-range {
                    -webkit-appearance: none;
                    appearance: none;
                    background: transparent;
                    pointer-events: none;
                }
                .price-range::-webkit-slider-runnable-track { background: transparent; }
                .price-range::-moz-range-track { background: transparent; }
                .price-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    appearance: none;
                    pointer-events: auto;
                    height: 20px;
                    width: 20px;
                    border-radius: 9999px;
                    background: #fff;
                    cursor: grab;
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.35);
                    transition: transform 150ms;
                }
                .price-range::-moz-range-thumb {
                    pointer-events: auto;
                    height: 20px;
                    width: 20px;
                    border: none;
                    border-radius: 9999px;
                    background: #fff;
                    cursor: grab;
                    box-shadow: 0 0 0 3px rgba(255,255,255,0.3), 0 2px 6px rgba(0,0,0,0.35);
                }
                .price-range:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.15); }
                .price-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(255,255,255,0.6); }
                .price-range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(255,255,255,0.6); }
            `}</style>

            {/* Heading + reset */}
            <div className="mb-4 flex items-center justify-between px-4">
                <h3 className="text-xs font-semibold uppercase tracking-widest text-white/50">
                    Price Range
                </h3>

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className="text-xs font-medium text-white/70 transition hover:text-white"
                    >
                        Reset
                    </button>
                )}
            </div>

            <div className="px-4">

                {/* Selected range label */}
                <p className="mb-4 text-xs font-medium text-white/90">
                    {getFormattedPrice(draft[0])} – {getFormattedPrice(draft[1])}
                </p>

                {/* Dual-handle slider */}
                <div className="relative mb-5 h-5">
                    <div className="absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/20" />
                    <div
                        className="absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white"
                        style={{ left: `${left}%`, width: `${right - left}%` }}
                    />

                    <input
                        type="range"
                        aria-label="Minimum price"
                        min={min}
                        max={max}
                        step={step}
                        value={draft[0]}
                        onChange={moveMin}
                        className={`price-range absolute inset-0 h-5 w-full ${minOnTop ? "z-20" : "z-10"}`}
                    />
                    <input
                        type="range"
                        aria-label="Maximum price"
                        min={min}
                        max={max}
                        step={step}
                        value={draft[1]}
                        onChange={moveMax}
                        className={`price-range absolute inset-0 h-5 w-full ${minOnTop ? "z-10" : "z-20"}`}
                    />
                </div>

                {/* Min / Max boxes */}
                <div className="flex items-center gap-2">
                    <input
                        type="number"
                        aria-label="Minimum price"
                        inputMode="numeric"
                        value={minText}
                        onChange={(e) => setMinText(e.target.value)}
                        onBlur={commitMin}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        className={boxClass}
                    />
                    <span className="text-white/50">–</span>
                    <input
                        type="number"
                        aria-label="Maximum price"
                        inputMode="numeric"
                        value={maxText}
                        onChange={(e) => setMaxText(e.target.value)}
                        onBlur={commitMax}
                        onKeyDown={(e) => e.key === "Enter" && e.currentTarget.blur()}
                        className={boxClass}
                    />
                </div>
            </div>
        </div>
    );
}