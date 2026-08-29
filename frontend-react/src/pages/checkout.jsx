import { useState } from "react";
import { useLocation } from "react-router-dom";
import {  getTotal } from "../utils/cart.js";
import { getFormattedPrice } from "../utils/price-formatter.jsx";
import { getCart } from "../utils/cart.js";
import CreateOrder from "../components/creatOrder.jsx";


export default function CheckoutPage() {

    const location = useLocation();
    const [cart, setCart] = useState(location.state ?? getCart());


    return (
        <div className="w-full h-full overflow-y-scroll flex items-center flex-col">
            {
                cart.map(
                    (cartItem, index) => {
                        return (
                            <div className="w-[600px] h-[150px] shadow-2xl my-4 flex flex-row relative" key={index}>
                                <img src={cartItem.product.image} className="h-full aspect-square object-cover" />

                                <div className="h-full w-[450px] flex flex-col   p-4">
                                    <h1 className="text-xl font-semibold">{cartItem.product.name}</h1>
                                    <p className="text-gray-500 text-sm line-through">{getFormattedPrice(cartItem.product.labelledPrice)}</p>
                                    <p className="text-sm font-semibold text-accent">{getFormattedPrice(cartItem.product.price)}</p>
                                    <div className="h-[30px] w-[100px] border border-accent rounded-4xl mt-2 flex flex-row justify-center items-center overflow-hidden">
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                            onClick={() => {
                                                const newCart = [...cart];

                                                const newQuantity = newCart[index].quantity - 1;

                                                if (newQuantity > 0) {
                                                    newCart[index].quantity = newQuantity;
                                                    setCart(newCart);
                                                } 

                                        
                                            }
                                            }>
                                            -
                                        </button>
                                        <span className="w-[40px] h-full flex justify-center items-center">{cartItem.quantity}</span>
                                        <button className="w-[30px] h-full hover:bg-accent hover:text-white"
                                            onClick={() => {
                                                const newCart = [...cart];
                                                //const newCart = {...cart}; JSON type 

                                                newCart[index].quantity = newCart[index].quantity + 1;

                                                setCart(newCart);
                                                
                                            }
                                            }>
                                            +
                                        </button>
                                    </div>
                                </div>

                                
                                <span className="absolute bottom-2 right-2 text-accent font-semibold text-xl">
                                    {getFormattedPrice(cartItem.product.price * cartItem.quantity)}
                                </span>

                            </div>
                        )
                    }
                )
            }

            <div className="w-[600px] h-[150px] shadow-2xl bg-white my-4 flex flex-row justify-between items-center p-4 sticky bottom-0">
                <CreateOrder cart={cart} />
                <div className="flex justify-end h-full items-center">
                    <span className="text-gray-500 text-lg mr-4">Total:</span>
                    <span className="text-accent text-2xl font-semibold">
                        {getFormattedPrice(getTotal(cart))}
                    </span>
                </div>
            </div>
        </div>
    )
}