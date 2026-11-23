import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { FiBox, FiEdit2, FiPlus } from "react-icons/fi";
import api from "../../utils/api";
import { getFormattedPrice } from "../../utils/price-formatter.jsx";
import ProductDeleteButton from "../../components/productDeleteButton.jsx";
import AdminPageHeader from "../../components/admin/AdminPageHeader.jsx";
import SearchInput from "../../components/admin/SearchInput.jsx";
import StatusBadge from "../../components/admin/StatusBadge.jsx";
import Pagination from "../../components/admin/Pagination.jsx";
import TableSkeleton, { CardSkeleton } from "../../components/admin/TableSkeleton.jsx";
import EmptyState from "../../components/admin/EmptyState.jsx";

const FALLBACK_IMAGE = "/default-product-1.png";
const LOW_STOCK = 5;

const isAvailable = (product) => product.isAvailable === true || product.isAvailable === "true";

const categoryLabel = (category) => String(category || "").replace(/-/g, " ");

/* Product picture with a fallback if it is missing or fails to load */
function Thumb({ product, className = "h-14 w-14" }) {
    const [failed, setFailed] = useState(false);

    return (
        <img
            src={failed ? FALLBACK_IMAGE : product?.image?.[0] || FALLBACK_IMAGE}
            alt={product.name || "Product"}
            loading="lazy"
            onError={() => setFailed(true)}
            className={`${className} shrink-0 rounded-xl border border-slate-200 bg-slate-100 object-cover`}
        />
    );
}

function StockCell({ product }) {
    const stock = Number(product.stock);

    if (product.stock === undefined || product.stock === null || product.stock === "" || Number.isNaN(stock)) {
        return <span className="text-slate-400">—</span>;
    }

    if (stock <= 0) return <StatusBadge tone="red">Out of stock</StatusBadge>;
    if (stock <= LOW_STOCK) return <StatusBadge tone="amber">Low · {stock}</StatusBadge>;

    return <span className="font-semibold text-slate-700">{stock}</span>;
}

function PriceCell({ product }) {
    const price = Number(product.price);
    const labelled = Number(product.labelledPrice);
    const hasDiscount = labelled > price && price > 0;

    return (
        <div>
            <p className="font-semibold text-slate-800">{getFormattedPrice(price)}</p>
            {hasDiscount && (
                <p className="text-xs text-slate-400 line-through">{getFormattedPrice(labelled)}</p>
            )}
        </div>
    );
}

function CategoryPill({ category }) {
    if (!category) return <span className="text-slate-400">—</span>;

    return (
        <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold capitalize text-accent">
            {categoryLabel(category)}
        </span>
    );
}

function AvailabilityBadge({ product }) {
    return isAvailable(product)
        ? <StatusBadge tone="green">Available</StatusBadge>
        : <StatusBadge tone="gray">Unavailable</StatusBadge>;
}

/* Name with product id, brand and model underneath */
function ProductInfo({ product }) {
    return (
        <div className="min-w-0">
            <p className="truncate font-semibold text-slate-800">{product.name}</p>
            <p className="truncate text-xs text-slate-500">
                {product.productId}
                {(product.brand || product.model) && " · "}
                {product.brand && <span className="capitalize">{product.brand}</span>}
                {product.brand && product.model && " "}
                {product.model}
            </p>
        </div>
    );
}

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const [refreshTrigger, setRefreshTrigger] = useState(0);

    // initialLoad: first load (skeleton). fetching: any load (dims the table after a delete)
    const [initialLoad, setInitialLoad] = useState(true);
    const [fetching, setFetching] = useState(true);

    const [search, setSearch] = useState("");
    const [category, setCategory] = useState("All");
    const [pageNumber, setPageNumber] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        setFetching(true);

        api.get("/products", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {

                console.error("Failed to load products:", error);

                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin", { replace: true });
                    return;
                }

                toast.error(error?.response?.data?.message || "Failed to load products");
                setProducts([]);
            })
            .finally(() => {
                setFetching(false);
                setInitialLoad(false);
            });

    }, [navigate, refreshTrigger]);

    const categories = useMemo(
        () => [...new Set(products.map((p) => p.category).filter(Boolean))],
        [products]
    );

    // If the selected category disappears (for example after deleting its last product), fall back to "All"
    const activeCategory = category === "All" || categories.includes(category) ? category : "All";

    const term = search.trim().toLowerCase();

    const filtered = useMemo(
        () =>
            products.filter((p) => {
                if (activeCategory !== "All" && p.category !== activeCategory) return false;
                if (!term) return true;

                const text = [
                    p.productId,
                    p.name,
                    p.brand,
                    p.model,
                    p.category,
                    ...(Array.isArray(p.altNames) ? p.altNames : []),
                ]
                    .join(" ")
                    .toLowerCase();

                return text.includes(term);
            }),
        [products, activeCategory, term]
    );

    // Client-side pagination
    const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
    const safePage = Math.min(pageNumber, totalPages);
    const pageItems = filtered.slice((safePage - 1) * pageSize, safePage * pageSize);

    const filtersActive = term !== "" || activeCategory !== "All";

    function clearFilters() {
        setSearch("");
        setCategory("All");
        setPageNumber(1);
    }

    function refresh() {
        setRefreshTrigger((value) => value + 1);
    }

    function renderActions(product) {
        return (
            <div className="flex items-center gap-2">
                <Link
                    to="/admin/edit-product"
                    state={product}
                    title="Edit product"
                    aria-label={`Edit ${product.name}`}
                    className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 bg-white text-slate-600
                               transition-colors duration-200 hover:border-accent hover:bg-blue-50 hover:text-accent
                               focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
                >
                    <FiEdit2 />
                </Link>

                <ProductDeleteButton productId={product.productId} refresh={refresh} />
            </div>
        );
    }

    const noProductsAtAll = !initialLoad && products.length === 0;
    const noMatch = !initialLoad && products.length > 0 && filtered.length === 0;

    const clearFiltersButton = (
        <button
            type="button"
            onClick={clearFilters}
            className="rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-all duration-200
                       hover:brightness-110 active:scale-95"
        >
            Clear filters
        </button>
    );

    const addProductButton = (
        <Link
            to="/admin/add-product"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white
                       transition-all duration-200 hover:brightness-110 active:scale-95"
        >
            <FiPlus />
            Add product
        </Link>
    );

    return (
        <div className="mx-auto w-full max-w-7xl pb-24">

            <AdminPageHeader
                title="All Products"
                subtitle="Manage your catalogue, prices and stock."
                count={products.length}
                countLabel="Products"
            />

            {/* Search + category filter */}
            <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                <SearchInput
                    value={search}
                    onChange={(value) => {
                        setSearch(value);
                        setPageNumber(1);
                    }}
                    placeholder="Search by name, ID, brand or model"
                    label="Search products"
                    className="w-full sm:max-w-sm"
                />

                <select
                    aria-label="Filter by category"
                    value={activeCategory}
                    onChange={(e) => {
                        setCategory(e.target.value);
                        setPageNumber(1);
                    }}
                    className="h-11 rounded-xl border border-slate-200 bg-white px-3 text-sm capitalize text-slate-700
                               outline-none transition focus:border-accent focus:ring-4 focus:ring-blue-100"
                >
                    <option value="All">All categories</option>
                    {categories.map((c) => (
                        <option key={c} value={c}>
                            {categoryLabel(c)}
                        </option>
                    ))}
                </select>
            </div>

            {/* ---------- Desktop table ---------- */}
            <div className="hidden overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm md:block">
                <table className="w-full text-left text-sm">

                    <thead className="bg-slate-50 text-xs uppercase tracking-wider text-slate-500">
                        <tr>
                            <th className="px-4 py-3 font-semibold">Product</th>
                            <th className="px-4 py-3 font-semibold">Category</th>
                            <th className="px-4 py-3 font-semibold">Price</th>
                            <th className="px-4 py-3 font-semibold">Availability</th>
                            <th className="px-4 py-3 font-semibold">Stock</th>
                            <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                    </thead>

                    <tbody className={`transition-opacity duration-200 ${fetching && !initialLoad ? "opacity-50" : "opacity-100"}`}>

                        {initialLoad && <TableSkeleton rows={6} columns={6} />}

                        {!initialLoad && pageItems.map((product) => (
                            <tr
                                key={product._id || product.productId}
                                className="border-t border-slate-100 transition-colors hover:bg-slate-50"
                            >
                                <td className="px-4 py-3">
                                    <div className="flex items-center gap-3">
                                        <Thumb product={product} />
                                        <ProductInfo product={product} />
                                    </div>
                                </td>
                                <td className="px-4 py-3"><CategoryPill category={product.category} /></td>
                                <td className="px-4 py-3"><PriceCell product={product} /></td>
                                <td className="px-4 py-3"><AvailabilityBadge product={product} /></td>
                                <td className="px-4 py-3"><StockCell product={product} /></td>
                                <td className="px-4 py-3">{renderActions(product)}</td>
                            </tr>
                        ))}

                    </tbody>
                </table>

                {noProductsAtAll && (
                    <EmptyState
                        icon={<FiBox />}
                        title="No products yet"
                        message="Add your first product to start building the catalogue."
                        action={addProductButton}
                    />
                )}

                {noMatch && (
                    <EmptyState
                        icon={<FiBox />}
                        title="No matching products"
                        message="Try a different search or category."
                        action={clearFiltersButton}
                    />
                )}
            </div>

            {/* ---------- Mobile cards ---------- */}
            <div className="md:hidden">

                {initialLoad && <CardSkeleton count={4} />}

                {!initialLoad && (
                    <div className={`space-y-3 transition-opacity duration-200 ${fetching ? "opacity-50" : "opacity-100"}`}>

                        {pageItems.map((product) => (
                            <div
                                key={product._id || product.productId}
                                className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm"
                            >
                                <div className="flex items-center gap-3">
                                    <Thumb product={product} className="h-16 w-16" />
                                    <ProductInfo product={product} />
                                </div>

                                <div className="mt-3 flex flex-wrap items-center gap-2">
                                    <CategoryPill category={product.category} />
                                    <AvailabilityBadge product={product} />
                                    <StockCell product={product} />
                                </div>

                                <div className="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
                                    <PriceCell product={product} />
                                    {renderActions(product)}
                                </div>
                            </div>
                        ))}

                        {noProductsAtAll && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiBox />}
                                    title="No products yet"
                                    message="Add your first product to start building the catalogue."
                                    action={addProductButton}
                                />
                            </div>
                        )}

                        {noMatch && (
                            <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
                                <EmptyState
                                    icon={<FiBox />}
                                    title="No matching products"
                                    message="Try a different search or category."
                                    action={clearFiltersButton}
                                />
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination (under the table, not floating) */}
            {!initialLoad && filtered.length > 0 && (
                <Pagination
                    pageNumber={safePage}
                    pageSize={pageSize}
                    totalItems={filtered.length}
                    totalPages={totalPages}
                    onPageChange={setPageNumber}
                    onPageSizeChange={(size) => {
                        setPageSize(size);
                        setPageNumber(1);
                    }}
                />
            )}

            {/* Floating "Add product" button */}
            <Link
                to="/admin/add-product"
                title="Add product"
                aria-label="Add product"
                className="fixed bottom-6 right-6 z-30 flex h-14 w-14 items-center justify-center rounded-full bg-accent
                           text-2xl text-white shadow-xl transition-all duration-300 hover:-translate-y-1
                           hover:shadow-2xl hover:brightness-110 active:scale-95
                           focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-blue-200"
            >
                <FiPlus />
            </Link>

        </div>
    );
}