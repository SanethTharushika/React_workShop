import { useState } from "react";
import { getCart } from "../utils/cart.js";
export default function CartPage() {

    const [cart, setCart] = useState(getCart());
    

    return (
        <div className="w-full h-full flex  items-center flex-col">
            {
                cart.map(
                    (cartItem, index) => {
                        return (
                            <div className="w-[400px] h-[150px] bg-red-900 shadow-md my-4">
                                </div>
                        )
                    }
                )
            }
        </div>
    )
}