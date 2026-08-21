import { useState } from "react";
import { useEffect } from "react";
import api from "../api/api.js";
import LoadingScreen from "../components/loadingScreen.jsx"; 

export default function productsPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loading) {
           
            api.get("/products")
            .then((response) => {
                setProducts(response.data);
                setLoading(false);
            })
            .catch((error) => {
                console.error("Error fetching products:", error);
                setLoading(false);
            });
        }
    }, [loading]);

    return (
        <div className="w-full min-h-screen bg-primary text-secondary">
           {
                loading && <LoadingScreen/>
           }

           {
                !loading && <>
                    {
                        products.map((product)   => {
                            return (
                                
                            )
                        }
                    )}
                
                
                </>
           }
        </div>
    )
}