import { useState } from "react";
import { useEffect } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx"; 
import ProductCard from "../components/productCard.jsx";


export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");
    const [searching, setSearching] = useState(false);

    function loadProducts() {
        setLoading(true);
        api.get("/products")
            .then((response) => {
                setProducts(response.data);
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

        setSearching(true);
        api.get("/products/search/" + query).then((response) => {
            setProducts(response.data);
            setSearching(false);
            
        }).catch((error) => {
            console.error("Error searching products:", error);
            setSearching(false);
            
        });

    }

    return (
        <div className="w-full bg-primary flex justify-center items-center gap-6 p-20 flex-wrap">
           {
                loading && <LoadingScreen/>
           }
           {
                searching && <LoadingScreen/>
           }

           <div className="w-full h-[70px] justify-center items-center flex gap-4">

                <input type="text" placeholder="Search products..." className="w-[400px] h-[40px] rounded-md p-2 border border-black" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="w-[120px] h-[40px] bg-accent text-white px-4 py-2 rounded-md" onClick={searchProducts} disabled={searching}>
                    {searching ? "Searching..." : "Search"}
                </button>
                <button onClick={() => {
                    setQuery("");
                    loadProducts();
                }} className="w-[120px] h-[40px] bg-accent text-white px-4 py-2 rounded-md">All Products</button>

           </div>

           {
                !loading && <>
                    {
                        products.map((product) => {
                            return (
                                <ProductCard key={product._id || product.productId} product={product} />
                            );
                        })
                    }
                
                
                </>
           }
        </div>
    )
}