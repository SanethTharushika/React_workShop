import { useEffect, useRef, useState } from "react";
import { FiAlertTriangle, FiInfo } from "react-icons/fi";

export default function ConfirmDialog({
    title,
    message,
    children,
    confirmText = "Confirm",
    cancelText = "Cancel",
    variant = "default", // "default" or "danger"
    loading = false,
    onConfirm,
    onCancel,
}) {
    const [visible, setVisible] = useState(false);
    const cancelRef = useRef(null);
    const danger = variant === "danger";

    // Play exit animation, then unmount
    const handleClose = () => {
        if (loading) return;
        setVisible(false);
        setTimeout(onCancel, 200);
    };

    // Move focus into the dialog when it opens
    useEffect(() => {
        cancelRef.current?.focus();
    }, []);

    // Enter animation + Esc key support
    useEffect(() => {
        const frame = requestAnimationFrame(() => setVisible(true));
        const onKey = (e) => {
            if (e.key === "Escape") handleClose();
        };
        window.addEventListener("keydown", onKey);
        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("keydown", onKey);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [loading]);

    return (
        <div
            onClick={handleClose}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm
                        transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="confirm-dialog-title"
                onClick={(e) => e.stopPropagation()}
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                className={`w-[90%] max-w-sm rounded-2xl bg-white p-6 shadow-2xl transition-all duration-300
                            ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-90 opacity-0"}`}
            >
                {/* Animated icon */}
                <div className="relative mx-auto mb-4 flex h-14 w-14 items-center justify-center">
                    <span
                        className={`absolute inset-0 animate-ping rounded-full opacity-75
                                    ${danger ? "bg-red-100" : "bg-blue-100"}`}
                    />
                    <span
                        className={`relative flex h-14 w-14 items-center justify-center rounded-full text-2xl
                                    ${danger ? "bg-red-50 text-red-600" : "bg-blue-50 text-accent"}`}
                    >
                        {danger ? <FiAlertTriangle /> : <FiInfo />}
                    </span>
                </div>

                <h2 id="confirm-dialog-title" className="mb-1 text-center text-lg font-semibold text-gray-800">
                    {title}
                </h2>

                {message && <p className="mb-2 text-center text-sm text-gray-500">{message}</p>}
                {children && <div className="mb-2 text-center text-sm text-gray-500">{children}</div>}

                <div className="mt-6 flex gap-3">
                    <button
                        ref={cancelRef}
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 rounded-xl border border-gray-200 px-4 py-2.5 font-medium text-gray-600
                                   transition-all duration-200 hover:-translate-y-0.5 hover:bg-gray-100
                                   active:scale-95 disabled:opacity-50"
                    >
                        {cancelText}
                    </button>

                    <button
                        type="button"
                        onClick={onConfirm}
                        disabled={loading}
                        className={`flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 font-medium text-white
                                    transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg active:scale-95
                                    disabled:opacity-70
                                    ${danger
                                ? "bg-gradient-to-r from-red-500 to-red-600 hover:shadow-red-500/30"
                                : "bg-accent hover:brightness-110"}`}
                    >
                        {loading ? (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                        ) : (
                            confirmText
                        )}
                    </button>
                </div>
            </div>
        </div>
    );
}