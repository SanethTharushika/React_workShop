import { getFormattedPrice } from "../utils/price-formatter.jsx";
import { Link } from "react-router-dom";

export default function ProductCard(props) {




    const product = props.product;
    if (!product) return null;

    const price = Number(product.price);
    const labelledPrice = Number(product.labelledPrice);

    return (
        <Link to={"/overview/"+product.productId} state={{ product }} className="bg-white rounded-lg w-72 h-96 shadow-xl flex flex-col ">
            

            <img src={product?.image?.[0] || "/default-product-1.png"} className="w-full h-[70%] object-cover rounded-tl-lg rounded-tr-lg"/>
            <div className="w-full h-[30%] p-4 flex flex-col justify-between">

                <h1 className="text-lg font-semibold">{product.name}</h1>
               
                

                {
                    product.price > product.labelledPrice && <p className="text-gray-500 line-through decoration-2">{getFormattedPrice(product.labelledPrice)}</p>
                }

                <p className="text-accent text-lg font-semibold">{getFormattedPrice(product.price)}</p>
            </div>
           
        </Link>
    )
}

