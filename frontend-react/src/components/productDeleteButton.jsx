import { CiTrash } from "react-icons/ci";
import { useState } from "react";
import { IoClose } from "react-icons/io5";
import api from "../utils/api";
import toast from "react-hot-toast";

export default function ProductDeleteButton(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);


    const refresh = props.refresh;
    const productId = props.productId;

    return (

        <>
            <CiTrash className="text-red-600 text-xl hover:text-3xl" onClick={() => setIsModalVisible(true)} />
            {

                isModalVisible && (
                    <div className="w-screen h-screen bg-black/70 fixed left-0 right-0 z-50 flex justify-center items-center">

                        <div className="w-[400px] h-[200px] bg-white  rounded-lg flex flex-col overflow-hidden justify-between">
                            <div className="w-full h-[40px] bg-accent flex justify-between items-center px-4">
                                <h1 className="text-white text-lg font-semibold p-2">Confirm Deletion</h1>
                                <IoClose className="text-white hover:bg-red-600 cursor-pointer" onClick={
                                    () => setIsModalVisible(false)
                                } />

                            </div>
                            <p className="text-black text-lg  p-2">Are you sure you want to delete this product with ID {productId}?</p>

                            <div className="w-full  flex  p-2 justify-center items-center gap-4">
                                
                                <button className="w-[100px] p-2 text-white font-semibold bg-gray-600 rounded-sm flex justify-center items-center hover:bg-gray-800" onClick={() => {
                                    setIsModalVisible(false);
                                }}>Cancel</button>

                                <button className="w-[100px] p-2 text-white font-semibold bg-red-600 rounded-sm flex justify-center items-center hover:bg-red-800" onClick={() => {
                                    const token = localStorage.getItem("token");
                                    api.delete("/products/" + productId, {
                                        headers: {
                                            Authorization: `Bearer ${token}`
                                        }
                                    }).then(() => {
                                        setIsModalVisible(false);
                                        refresh();
                                    }).catch(() => {
                                        toast.error("Failed to delete product");
                                    });
                                    
                                }}>Delete</button>
                            </div>



                        </div>

                    </div>

                )
            }


        </>
    )
}