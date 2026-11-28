import { useEffect, useState } from "react";
import { getFormattedPrice } from "../utils/price-formatter.jsx";

const styles = {
    light: {
        heading: "text-gray-400",
        reset: "text-accent hover:brightness-125",
        label: "text-gray-800",
        track: "bg-gray-200",
        fill: "bg-accent",
        thumb: "text-accent",
        dash: "text-gray-400",
        box: "border-gray-200 bg-white text-gray-800 focus:border-accent focus:ring-4 focus:ring-blue-100",
    },
    dark: {
        heading: "text-white/50",
        reset: "text-white/70 hover:text-white",
        label: "text-white/90",
        track: "bg-white/20",
        fill: "bg-white",
        thumb: "text-white",
        dash: "text-white/50",
        box: "border-white/20 bg-white/10 text-white focus:border-white/60 focus:bg-white/15",
    },
};

function clamp(value, low, high) {
    return Math.min(Math.max(value, low), high);
}

export default function PriceRangeFilter({ bounds, value, onChange, variant = "light" }) {

    const s = styles[variant] || styles.light;
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
        `w-full rounded-lg border px-2 py-2 text-sm outline-none transition ${s.box}`;

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
                    height: 22px;
                    width: 22px;
                    border-radius: 9999px;
                    background: currentColor;
                    border: 3px solid #fff;
                    cursor: grab;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.3);
                    transition: transform 150ms;
                }
                .price-range::-moz-range-thumb {
                    pointer-events: auto;
                    height: 16px;
                    width: 16px;
                    border-radius: 9999px;
                    background: currentColor;
                    border: 3px solid #fff;
                    cursor: grab;
                    box-shadow: 0 0 0 1px rgba(0,0,0,0.12), 0 2px 6px rgba(0,0,0,0.3);
                }
                .price-range:active::-webkit-slider-thumb { cursor: grabbing; transform: scale(1.15); }
                .price-range:focus-visible::-webkit-slider-thumb { box-shadow: 0 0 0 4px rgba(59,130,246,0.5); }
                .price-range:focus-visible::-moz-range-thumb { box-shadow: 0 0 0 4px rgba(59,130,246,0.5); }
            `}</style>

            {/* Heading + reset */}
            <div className="mb-3 flex items-center justify-between">
                <h3 className={`text-xs font-semibold uppercase tracking-widest ${s.heading}`}>
                    Price Range
                </h3>

                {value && (
                    <button
                        type="button"
                        onClick={() => onChange(null)}
                        className={`text-xs font-medium transition ${s.reset}`}
                    >
                        Reset
                    </button>
                )}
            </div>

            {/* Selected range label */}
            <p className={`mb-4 text-sm font-semibold ${s.label}`}>
                {getFormattedPrice(draft[0])} – {getFormattedPrice(draft[1])}
            </p>

            {/* Dual-handle slider */}
            <div className="relative mb-5 h-6">
                <div className={`absolute left-0 right-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full ${s.track}`} />
                <div
                    className={`absolute top-1/2 h-1.5 -translate-y-1/2 rounded-full ${s.fill}`}
                    style={{ left: `${left}%`, width: `${right - left}%` }}
                />

                <input
                    type="range"
                    aria-label="Minimum price slider"
                    min={min}
                    max={max}
                    step={step}
                    value={draft[0]}
                    onChange={moveMin}
                    className={`price-range absolute inset-0 h-6 w-full ${s.thumb} ${minOnTop ? "z-20" : "z-10"}`}
                />
                <input
                    type="range"
                    aria-label="Maximum price slider"
                    min={min}
                    max={max}
                    step={step}
                    value={draft[1]}
                    onChange={moveMax}
                    className={`price-range absolute inset-0 h-6 w-full ${s.thumb} ${minOnTop ? "z-10" : "z-20"}`}
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
                <span className={s.dash}>–</span>
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
    );
}