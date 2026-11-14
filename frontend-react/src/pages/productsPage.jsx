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
    // (for example clicking "Products" in the navbar while on /products?category=ram)
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
                    onSearch={searchProducts}
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
                            <p className="w-full py-20 text-center text-gray-500">
                                No products found.
                            </p>
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}