import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../utils/api.js";
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

    // An unknown category in the URL falls back to "All"
    const activeCategory =
        selectedCategory === "All" || categories.includes(selectedCategory)
            ? selectedCategory
            : "All";

    const visibleProducts = products.filter(
        (p) => activeCategory === "All" || p.category === activeCategory
    );

    return (
        <div className="flex min-h-screen w-full flex-col bg-primary lg:flex-row">

            {loading && <LoadingScreen />}

            {/* Left navigation sidebar */}
            <CategorySidebar
                categories={categories}
                products={products}
                selected={activeCategory}
                onSelect={setSelectedCategory}
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
                                <p>
                                    {query.trim()
                                        ? `No products found for "${query.trim()}".`
                                        : "No products found."}
                                </p>

                                {query.trim() && (
                                    <button
                                        type="button"
                                        onClick={clearSearch}
                                        className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white
                                                   transition-all duration-200 hover:brightness-110 active:scale-95"
                                    >
                                        Clear search
                                    </button>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}