import { useState } from "react";
import { getCart } from "../utils/cart.js";
export default function CartPage() {

    const [cart, setCart] = useState(getCart());
    

    return (
        <div className="w-full h-full overflow-y-scroll flex items-center flex-col"> 
            {
                cart.map(
                    (cartItem, index) => {
                        return (
                            <div className="w-[600px] h-[150px] shadow-2xl my-4 flex-row"key={index}>
                                <img src={cartItem.product.image}/>
                                </div>
                        )
                    }
                )
            }
        </div>
    )
}