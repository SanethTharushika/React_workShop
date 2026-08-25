import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import api from "../utils/api.js";
import LoadingScreen from "../components/loadingScreen.jsx";
import ProductImageSlideShow from "../components/productImageSlideShow.jsx";
import { getFormattedPrice } from "../utils/price-formatter.jsx";



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

                    <div className="w-1/2  h-full flex flex-col p-6 ">
                    <span className="text-gray-500 text-sm italic mb-4">Product ID: {product.productId}</span>
                    <p className="text-gray-500 text-sm italic mb-4">{product.brand+ " " + product.model}</p>

                    <h1 className="text-3xl font-semibold mb-6">{product.name}</h1>
                        {
                            product.altNames.map(
                                (altNames, index) => {
                                    return (
                                        <span key={index} className="text-gray-500">{" | " + altNames}</span>
                                    )
                                }
                            )
                        }

                        {
                            product.price > product.labelledPrice && <p className="text-gray-500 line-through decoration-2 mb-2 text-lg ">{getFormattedPrice(product.labelledPrice)}</p>

                        }
                        <p className="text-xl text-accent font-semibold">{getFormattedPrice(product.price)}</p>
                        <p className="text-gray-700 mt-6">{product.description}</p>
                        <div className="flex">
                            <button className="w-[220px] p-2 text-white bg-accent rounded-sm hover:bg-accent/80 mt-6 shadow-lg shadow-accent/30 transition-shadow">Add to Cart</button>
                            <button className="w-[220px] p-2 text-gray-700 bg-gray-300 rounded-sm hover:bg-gray-400 mt-6 ml-4 shadow-lg shadow-gray-400/40 transition-shadow">Buy Now</button>

                        </div>
                    </div>


                
            
                
                </>
            }
        </div>
        
    )
}
