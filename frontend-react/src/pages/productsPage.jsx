import { useState, useEffect, useMemo, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import { FiX } from "react-icons/fi";
import api from "../utils/api.js";
import { getFormattedPrice } from "../utils/price-formatter.jsx";
import LoadingScreen from "../components/loadingScreen.jsx";
import ProductCard from "../components/productCard.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";
import ProductSearchBar from "../components/ProductSearchBar.jsx";

export default function ProductsPage() {

    const [searchParams] = useSearchParams();
    const categoryFromUrl = searchParams.get("category") || "All";

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(categoryFromUrl);

    // null = no price filter, otherwise [min, max]
    const [priceRange, setPriceRange] = useState(null);

    const timerRef = useRef(null);
    const controllerRef = useRef(null);

    function loadProducts() {
        setLoading(true);
        api.get("/products")
            .then((response) => {
                setProducts(response.data);
                setAllProducts(response.data);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
            })
            .finally(() => {
                setLoading(false);
            });
    }

    useEffect(() => {
        loadProducts();
    }, []);

    // Keep the selected category in sync when the URL changes
    useEffect(() => {
        setSelectedCategory(categoryFromUrl);
    }, [categoryFromUrl]);

    function runSearch(text) {

        // cancel any request that is still running
        controllerRef.current?.abort();

        const trimmed = text.trim();

        // empty search: restore the full list instantly, no request, no loading flash
        if (trimmed === "") {
            setProducts(allProducts);
            setSearching(false);
            return;
        }

        const controller = new AbortController();
        controllerRef.current = controller;
        setSearching(true);

        api.get("/products/search/" + encodeURIComponent(trimmed), { signal: controller.signal })
            .then((response) => {
                setProducts(response.data);
            })
            .catch((error) => {
                // a cancelled request is expected, not an error
                if (error?.code === "ERR_CANCELED") return;
                console.error("Error searching products:", error);
            })
            .finally(() => {
                // only the latest request is allowed to turn the spinner off
                if (controllerRef.current === controller) setSearching(false);
            });
    }

    // Live search: run 300 ms after the user stops typing
    useEffect(() => {
        // skip until the full product list has loaded
        if (allProducts.length === 0) return;

        if (query.trim() === "") {
            runSearch("");
            return;
        }

        timerRef.current = setTimeout(() => runSearch(query), 300);

        return () => clearTimeout(timerRef.current);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [query, allProducts]);

    // Cancel anything still running when leaving the page
    useEffect(() => {
        return () => {
            clearTimeout(timerRef.current);
            controllerRef.current?.abort();
        };
    }, []);

    // Enter key: search right away, without waiting for the pause
    function searchNow() {
        clearTimeout(timerRef.current);
        runSearch(query);
    }

    // The ✕ button: emptying the query triggers the effect above, which restores the list
    function clearSearch() {
        setQuery("");
    }

    const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];

    // Slider limits come from the full product list, so they don't shrink after a search
    const priceBounds = useMemo(() => {
        const prices = allProducts
            .map((p) => Number(p.price))
            .filter((n) => Number.isFinite(n) && n >= 0);

        if (prices.length === 0) return { min: 0, max: 0, step: 1 };

        const rawMin = Math.min(...prices);
        const rawMax = Math.max(...prices);
        const span = rawMax - rawMin;
        const step = span >= 100000 ? 1000 : span >= 10000 ? 100 : span >= 1000 ? 10 : 1;

        return {
            min: Math.floor(rawMin / step) * step,
            max: Math.ceil(rawMax / step) * step,
            step,
        };
    }, [allProducts]);

    // An unknown category in the URL falls back to "All"
    const activeCategory =
        selectedCategory === "All" || categories.includes(selectedCategory)
            ? selectedCategory
            : "All";

    // 1) search results  ->  2) price range  ->  3) category
    const priceFiltered = priceRange
        ? products.filter((p) => {
            const price = Number(p.price);
            return price >= priceRange[0] && price <= priceRange[1];
        })
        : products;

    const visibleProducts = priceFiltered.filter(
        (p) => activeCategory === "All" || p.category === activeCategory
    );

    const trimmedQuery = query.trim();

    // Message for the empty state
    let emptyMessage = "No products found.";
    if (trimmedQuery) {
        emptyMessage = `No products found for "${trimmedQuery}"${priceRange ? " in this price range" : ""}.`;
    } else if (priceRange) {
        emptyMessage = "No products found in this price range.";
    }

    const emptyButtonClass =
        "rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white transition-all duration-200 " +
        "hover:brightness-110 active:scale-95";

    return (
        <div className="flex min-h-screen w-full flex-col bg-primary lg:flex-row">

            {loading && <LoadingScreen />}

            {/* Left navigation sidebar (category counts follow the price range) */}
            <CategorySidebar
                categories={categories}
                products={priceFiltered}
                selected={activeCategory}
                onSelect={setSelectedCategory}
                priceBounds={priceBounds}
                priceRange={priceRange}
                onPriceChange={setPriceRange}
            />

            {/* Main content */}
            <main className="min-w-0 flex-1 px-4 pb-28 pt-10 lg:px-10 lg:pb-10">

                {/* Search bar */}
                <ProductSearchBar
                    value={query}
                    onChange={setQuery}
                    onSearch={searchNow}
                    onClear={clearSearch}
                    searching={searching}
                />

                {/* Active price filter chip */}
                {priceRange && (
                    <div className="mb-6 flex justify-center">
                        <button
                            type="button"
                            onClick={() => setPriceRange(null)}
                            title="Clear price range"
                            className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-1.5 text-sm
                                       font-medium text-accent shadow-md transition-all duration-200
                                       hover:shadow-lg active:scale-95"
                        >
                            Price: {getFormattedPrice(priceRange[0])} – {getFormattedPrice(priceRange[1])}
                            <FiX />
                        </button>
                    </div>
                )}

                {/* Products */}
                {!loading && (
                    <div className="flex flex-wrap content-start justify-center gap-6">
                        {visibleProducts.length > 0 ? (
                            visibleProducts.map((product) => (
                                <ProductCard
                                    key={product._id || product.productId}
                                    product={product}
                                />
                            ))
                        ) : (
                            <div className="w-full py-20 text-center text-gray-500">
                                <p>{emptyMessage}</p>

                                <div className="mt-4 flex flex-wrap items-center justify-center gap-3">
                                    {trimmedQuery && (
                                        <button type="button" onClick={clearSearch} className={emptyButtonClass}>
                                            Clear search
                                        </button>
                                    )}

                                    {priceRange && (
                                        <button
                                            type="button"
                                            onClick={() => setPriceRange(null)}
                                            className={emptyButtonClass}
                                        >
                                            Reset price range
                                        </button>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}