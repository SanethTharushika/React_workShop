import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { FiEye, FiX } from "react-icons/fi";
import toast from "react-hot-toast";
import api from "../utils/api";
import { getFormattedPrice } from "../utils/price-formatter.jsx";
import StatusBadge, { orderStatusTone } from "./admin/StatusBadge.jsx";

const STATUS_OPTIONS = ["pending", "processing", "shipped", "delivered"];
const FALLBACK_IMAGE = "/default-product-1.png";

/* The order item's product image can be a single URL or an array of URLs */
function firstImage(product) {
    const image = Array.isArray(product?.image) ? product.image[0] : product?.image;
    return image || FALLBACK_IMAGE;
}

function ItemImage({ product }) {
    const [failed, setFailed] = useState(false);

    return (
        <img
            src={failed ? FALLBACK_IMAGE : firstImage(product)}
            alt={product?.name || "Product"}
            loading="lazy"
            onError={() => setFailed(true)}
            className="h-16 w-16 shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover"
        />
    );
}

function Detail({ label, children }) {
    return (
        <div className="min-w-0">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">{label}</p>
            <p className="mt-0.5 break-words text-sm font-medium text-slate-800">{children || "N/A"}</p>
        </div>
    );
}

export default function AdminOrderDataModel({ order, refresh, isAdmin }) {

    const [isOpen, setIsOpen] = useState(false);
    const [visible, setVisible] = useState(false);
    const [updating, setUpdating] = useState(false);
    const closeRef = useRef(null);

    const firstItem = order?.items?.[0];
    const currentStatus = firstItem?.status || "";

    // Local copy of the status so the select reacts instantly (and can revert on failure)
    const [statusValue, setStatusValue] = useState(currentStatus);

    useEffect(() => {
        setStatusValue(currentStatus);
    }, [currentStatus]);

    // Play the exit animation, then unmount
    function closeModal() {
        setVisible(false);
        setTimeout(() => setIsOpen(false), 200);
    }

    // Enter animation, Esc to close, focus the close button, lock the page scroll
    useEffect(() => {
        if (!isOpen) return;

        const frame = requestAnimationFrame(() => {
            setVisible(true);
            closeRef.current?.focus();
        });

        const previousOverflow = document.body.style.overflow;
        document.body.style.overflow = "hidden";

        const onKey = (e) => {
            if (e.key === "Escape") closeModal();
        };
        window.addEventListener("keydown", onKey);

        return () => {
            cancelAnimationFrame(frame);
            window.removeEventListener("keydown", onKey);
            document.body.style.overflow = previousOverflow;
        };
    }, [isOpen]);

    async function updateOrderStatus(newStatus) {

        const previous = statusValue;
        const token = localStorage.getItem("token");

        setStatusValue(newStatus);
        setUpdating(true);

        try {
            await api.put("/orders/" + order.orderId, {
                status: newStatus
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            toast.success("Order status updated successfully");
            refresh?.();

        } catch (error) {
            console.error("Failed to update order status:", error);
            setStatusValue(previous);
            toast.error("Failed to update order status");

        } finally {
            setUpdating(false);
        }
    }

    const items = order?.items || [];

    // Keep the current status selectable even if it is not one of the standard options
    const options =
        statusValue && !STATUS_OPTIONS.includes(statusValue) ? [statusValue, ...STATUS_OPTIONS] : STATUS_OPTIONS;

    const modal = (
        <div
            onClick={closeModal}
            className={`fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 backdrop-blur-sm
                        transition-opacity duration-200 ${visible ? "opacity-100" : "opacity-0"}`}
        >
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="order-details-title"
                onClick={(e) => e.stopPropagation()}
                style={{ transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
                className={`flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl bg-white shadow-2xl
                            transition-all duration-300
                            ${visible ? "translate-y-0 scale-100 opacity-100" : "translate-y-6 scale-95 opacity-0"}`}
            >

                {/* Header */}
                <div className="border-b border-slate-100 p-5">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">Order details</p>
                            <h2 id="order-details-title" className="truncate text-xl font-bold text-slate-900">
                                {order?.orderId || "N/A"}
                            </h2>
                        </div>

                        <button
                            ref={closeRef}
                            type="button"
                            aria-label="Close order details"
                            onClick={closeModal}
                            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xl text-slate-400
                                       transition-all duration-200 hover:rotate-90 hover:bg-slate-100 hover:text-slate-700
                                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                        >
                            <FiX />
                        </button>
                    </div>

                    {/* Status */}
                    <div className="mt-4 flex flex-wrap items-center gap-3">
                        <span className="text-sm font-semibold text-slate-600">Status</span>

                        {isAdmin ? (
                            <select
                                aria-label="Order status"
                                value={statusValue || ""}
                                disabled={updating}
                                onChange={(e) => updateOrderStatus(e.target.value)}
                                className="h-10 rounded-lg border border-slate-200 bg-white px-3 text-sm capitalize text-slate-800
                                           outline-none transition focus:border-accent focus:ring-4 focus:ring-blue-100
                                           disabled:cursor-wait disabled:opacity-60"
                            >
                                <option value="" disabled>Select status</option>
                                {options.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        ) : (
                            <StatusBadge tone={orderStatusTone(statusValue)}>
                                <span className="capitalize">{statusValue || "N/A"}</span>
                            </StatusBadge>
                        )}

                        {updating && (
                            <span className="h-4 w-4 animate-spin rounded-full border-2 border-accent/30 border-t-accent" />
                        )}
                    </div>
                </div>

                {/* Scrollable body */}
                <div className="flex-1 overflow-y-auto bg-slate-50 p-5">

                    {/* Customer */}
                    <div className="rounded-xl border border-slate-200 bg-white p-4">
                        <h3 className="mb-3 text-sm font-semibold text-slate-800">Customer</h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <Detail label="Name">
                                {firstItem ? `${firstItem.firstName || ""} ${firstItem.lastName || ""}`.trim() : ""}
                            </Detail>
                            <Detail label="Email">{firstItem?.email}</Detail>
                            <Detail label="Phone">{firstItem?.phone}</Detail>
                            <Detail label="City">{firstItem?.city}</Detail>
                            <Detail label="Address">{firstItem?.addressLine1}</Detail>
                            <Detail label="Date">
                                {firstItem?.date ? new Date(firstItem.date).toLocaleDateString() : ""}
                            </Detail>
                        </div>
                    </div>

                    {/* Items */}
                    <h3 className="mb-3 mt-5 text-sm font-semibold text-slate-800">Items ({items.length})</h3>

                    <div className="space-y-3">
                        {items.map((item, index) => {

                            const product = item?.product;
                            const quantity = item?.quantity || 0;
                            const unitPrice = product?.price || 0;

                            return (
                                <div
                                    key={index}
                                    className="flex gap-4 rounded-xl border border-slate-200 bg-white p-4"
                                >
                                    <ItemImage product={product} />

                                    <div className="min-w-0 flex-1">
                                        <p className="truncate font-semibold text-slate-800">
                                            {product?.name || "No product name"}
                                        </p>
                                        <p className="truncate text-xs text-slate-500">
                                            {product?.productId || "N/A"}
                                        </p>
                                        <p className="mt-1 text-sm text-slate-500">
                                            {quantity} × {getFormattedPrice(unitPrice)}
                                        </p>
                                    </div>

                                    <p className="shrink-0 text-right font-bold text-slate-900">
                                        {getFormattedPrice(unitPrice * quantity)}
                                    </p>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-slate-100 bg-white p-5">
                    <span className="font-semibold text-slate-600">Total amount</span>
                    <span className="text-xl font-bold text-accent">{getFormattedPrice(order?.totalAmount || 0)}</span>
                </div>

            </div>
        </div>
    );

    return (
        <>
            <button
                type="button"
                title="View order details"
                aria-label={`View order ${order?.orderId || ""}`}
                onClick={() => setIsOpen(true)}
                className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-lg
                           text-slate-600 transition-colors duration-200 hover:border-accent hover:bg-blue-50
                           hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
            >
                <FiEye />
            </button>

            {/* Rendered on document.body so the dimmed table can't affect it */}
            {isOpen && createPortal(modal, document.body)}
        </>
    );
}