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

    // Used to ignore old responses when a newer search or a clear happens
    const requestId = useRef(0);

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

    function searchProducts() {

        const text = query.trim();
        const id = ++requestId.current;

        // empty search: show the full list again, no request needed
        if (text === "") {
            setProducts(allProducts);
            setSearching(false);
            return;
        }

        setSearching(true);
        api.get("/products/search/" + encodeURIComponent(text))
            .then((response) => {
                if (id === requestId.current) setProducts(response.data);
            })
            .catch((error) => {
                console.error("Error searching products:", error);
            })
            .finally(() => {
                if (id === requestId.current) setSearching(false);
            });

    }

    function clearSearch() {
        requestId.current++;
        setQuery("");
        setSearching(false);
        setProducts(allProducts);
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
                    onSearch={searchProducts}
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
                                <p>
                                    {priceRange
                                        ? "No products found in this price range."
                                        : "No products found."}
                                </p>

                                {priceRange && (
                                    <button
                                        type="button"
                                        onClick={() => setPriceRange(null)}
                                        className="mt-4 rounded-lg bg-accent px-5 py-2 text-sm font-medium text-white
                                                   transition-all duration-200 hover:brightness-110 active:scale-95"
                                    >
                                        Reset price range
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