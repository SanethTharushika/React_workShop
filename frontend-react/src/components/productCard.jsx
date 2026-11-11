import { useState } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { getFormattedPrice } from "../utils/price-formatter.jsx";

const FALLBACK_IMAGE = "/default-product-1.png";

export default function ProductCard({ product }) {

    const [imageFailed, setImageFailed] = useState(false);

    if (!product) return null;

    const price = Number(product.price);
    const labelledPrice = Number(product.labelledPrice);

    // A discount exists only when the labelled price is higher than the selling price
    const hasDiscount = labelledPrice > price && price > 0;
    const discountPercent = hasDiscount
        ? Math.round(((labelledPrice - price) / labelledPrice) * 100)
        : 0;

    // Stock status (products with no stock value are treated as in stock)
    const stock = product.stock == null || product.stock === "" ? null : Number(product.stock);
    const unavailable = product.isAvailable === false || product.isAvailable === "false";
    const outOfStock = unavailable || (stock !== null && stock <= 0);
    const lowStock = !outOfStock && stock !== null && stock <= 5;

    const imageSrc = imageFailed ? FALLBACK_IMAGE : product.image?.[0] || FALLBACK_IMAGE;
    const categoryLabel = (product.category || "").replace(/-/g, " ");

    return (
        <Link
            to={"/overview/" + product.productId}
            state={{ product }}
            className="group flex w-72 flex-col overflow-hidden rounded-2xl bg-white shadow-md
                       transition-all duration-300 hover:-translate-y-1.5 hover:shadow-xl
                       focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
        >

            {/* Image */}
            <div className="relative aspect-[4/3] w-full overflow-hidden bg-gray-100">

                <img
                    src={imageSrc}
                    alt={product.name || "Product image"}
                    loading="lazy"
                    onError={() => setImageFailed(true)}
                    className={`h-full w-full object-cover transition-transform duration-500 group-hover:scale-110
                                ${outOfStock ? "grayscale" : ""}`}
                />

                {/* Discount badge */}
                {hasDiscount && !outOfStock && (
                    <span className="absolute left-3 top-3 rounded-full bg-red-500 px-3 py-1 text-xs font-bold text-white shadow-md">
                        -{discountPercent}%
                    </span>
                )}

                {/* Out of stock overlay */}
                {outOfStock && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                        <span className="rounded-full bg-white px-4 py-1.5 text-sm font-semibold text-gray-800 shadow-lg">
                            Out of stock
                        </span>
                    </div>
                )}

                {/* Low stock badge */}
                {lowStock && (
                    <span className="absolute bottom-3 left-3 rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-white shadow-md">
                        Only {stock} left
                    </span>
                )}
            </div>

            {/* Details */}
            <div className="flex flex-1 flex-col gap-2 p-4">

                {/* Category and brand */}
                <p className="h-4 truncate text-xs font-medium uppercase tracking-wider text-gray-400">
                    {categoryLabel}
                    {categoryLabel && product.brand ? " · " : ""}
                    {product.brand}
                </p>

                {/* Name (max 2 lines, always reserves the same height) */}
                <h2 className="line-clamp-2 min-h-[3rem] text-base font-semibold leading-6 text-gray-800">
                    {product.name}
                </h2>

                {/* Prices */}
                <div className="mt-auto flex items-end justify-between gap-2 pt-1">

                    <div>
                        <p className="h-5 text-sm text-gray-400 line-through decoration-2">
                            {hasDiscount ? getFormattedPrice(labelledPrice) : ""}
                        </p>
                        <p className="text-lg font-bold text-accent">
                            {getFormattedPrice(price)}
                        </p>
                    </div>

                    <span
                        className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-50 text-accent
                                   transition-all duration-300 group-hover:bg-accent group-hover:text-white"
                    >
                        <FiArrowRight className="transition-transform duration-300 group-hover:translate-x-0.5" />
                    </span>

                </div>
            </div>

        </Link>
    );
}