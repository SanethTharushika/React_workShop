import { useState } from "react";
import { useEffect } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx"; 
import ProductCard from "../components/productCard.jsx";

export default function ProductsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

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

    return (
        <div className="w-full bg-primary flex justify-center items-center gap-6 p-20 flex-wrap">
           {
                loading && <LoadingScreen/>
           }

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