import { useState } from "react";
import { IoMdEye } from "react-icons/io";

export default function AdminOrderDataModel(props) {


    const [isOpen, setIsOpen] = useState(false);
    const order = props.order;
    const refresh = props.refresh;

    return (

        <>
            <IoMdEye className="text-2xl text-gray-500 cursor-pointer" onClick={() => setIsOpen(true)} />
            
            {
                isOpen && <div className="w-screen h-screen fixed left-0 top-0 bg-black/70  flex justify-center items-center z-50">
                        <div className="w-[600px] max-h-screen flex flex-col bg-primary rounded-xl">

                            <div className="w-full h-[200px] bg-white"></div>

                            <div className= "w-full h-[400px] p-4 flex flex-col gap-4 overflow-y-scroll">
                                {
                                    order.items.map((item, index) => {
                                        return (
                                            <div key={index} className="w-full h-[100px] bg-white rounded-lg flex gap-4 p-4">
                                                <div className="w-[100px] h-full">
                                                    <img src={item.productImage} className="w-full h-full object-cover rounded-lg" />
                                                </div>
                                                <div className="w-full h-full flex flex-col justify-between">
                                                    <h3 className="font-bold text-lg">{item.productName}</h3>
                                                    <p className="text-gray-500">Quantity: {item.quantity}</p>
                                                    <p className="font-bold">${(item.price * item.quantity).toFixed(2)}</p>
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                           </div>    

                        </div>
                </div>
                    
                        
            }
           
        </>

    )





}