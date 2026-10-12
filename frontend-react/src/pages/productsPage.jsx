import { useState, useEffect } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import ProductCard from "../components/productCard.jsx";
import CategorySidebar from "../components/CategorySidebar.jsx";

export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState("All");

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

    function searchProducts() {

        if (query.trim() === "") {
            loadProducts();
            return;
        }

        setSearching(true);
        api.get("/products/search/" + encodeURIComponent(query.trim()))
            .then((response) => {
                setProducts(response.data);
                setSearching(false);
            })
            .catch((error) => {
                console.error("Error searching products:", error);
                setSearching(false);
            });

    }

    const categories = [...new Set(allProducts.map((p) => p.category).filter(Boolean))];

    const visibleProducts = products.filter(
        (p) => selectedCategory === "All" || p.category === selectedCategory
    );

    return (
        <div className="flex min-h-screen w-full flex-col bg-primary lg:flex-row">

            {loading && <LoadingScreen />}
            {searching && <LoadingScreen />}

            {/* Left navigation sidebar */}
            <CategorySidebar
                categories={categories}
                products={products}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />

            {/* Main content */}
            <main className="min-w-0 flex-1 px-4 py-10 lg:px-10">

                {/* Search bar */}
                <div className="mb-8 flex w-full flex-wrap items-center justify-center gap-3">
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="h-[40px] w-full rounded-md border border-black p-2 sm:w-[400px]"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") searchProducts();
                        }}
                    />
                    <button
                        className="h-[40px] w-[120px] rounded-md bg-accent px-4 py-2 text-white
                                   transition-all duration-200 hover:brightness-110 active:scale-95"
                        onClick={searchProducts}
                        disabled={searching}
                    >
                        {searching ? "Searching..." : "Search"}
                    </button>
                    <button
                        onClick={() => {
                            setQuery("");
                            setSelectedCategory("All");
                            loadProducts();
                        }}
                        className="h-[40px] w-[120px] rounded-md bg-accent px-4 py-2 text-white
                                   transition-all duration-200 hover:brightness-110 active:scale-95"
                    >
                        All Products
                    </button>
                </div>

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