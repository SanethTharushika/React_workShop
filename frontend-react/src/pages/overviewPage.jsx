import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import ProductImageSlideShow from "../components/productImageSlideShow.jsx";



export default function OverviewPage() {
    const parameters = useParams();
    const navigate = useNavigate();
    const [product, setProduct] = useState(null);

    useEffect(() => {
        if (!parameters.productId) {
            navigate("/products");
            return;
        }

        api.get("/products/" + parameters.productId).then((response) => {
            console.log(response.data);
            setProduct(response.data);
        }).catch((error) => {
            console.error("Failed to load product:", error);
            navigate("/products");
        })
    }, [navigate, parameters.productId])
    
    

    return (
        <div className="w-full h-full flex justify-center items-center">
            {
                product == null && <LoadingScreen/>
            }

            {
                product != null && <>

                    <div className="w-1/2  h-full flex justify-center items-center">

                        <ProductImageSlideShow images={product.image}/>
                    
                    </div>

                    <div className="w-1/2 bg-blue-900 h-full">
                    
                    </div>


                
            
                
                </>
            }
        </div>
        
    )
}
