import { useState } from "react";
import { useEffect } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx"; 
import ProductCard from "../components/productCard.jsx";


export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [query, setQuery] = useState("");

    useEffect(() => {
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
    }, []);

    function searchProducts() {
        setLoading(true);
    }

    return (
        <div className="w-full bg-primary flex justify-center items-center gap-6 p-20 flex-wrap">
           {
                loading && <LoadingScreen/>
           }

           <div className="w-full h-[70px] justify-center items-center flex gap-4">

                <input type="text" placeholder="Search products..." className="w-[400px] h-[40px] rounded-md p-2" value={query} onChange={(e) => setQuery(e.target.value)} />
                <button className="w-[120px] h-[40px] bg-secondary text-white px-4 py-2 rounded-md" onClick={searchProducts}>Search</button>
                <button onClick={() => {
                    setQuery("");
                    setLoading(true);
                }} className="w-[120px] h-[40px] bg-secondary text-white px-4 py-2 rounded-md">All Products</button>

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