import { CiTrash } from "react-icons/ci";
import { useState } from "react";
import { IoClose } from "react-icons/io5";

export default function ProductDeleteButton(props) {

    const [isModalVisible, setIsModalVisible] = useState(false);


    const refresh = props.refresh;
    const productId = props.productId;

    return (

        <>
        <CiTrash  className="text-red-600" onClick={() => setIsModalVisible(true)}/>
        {

            isModalVisible && (
                <div className="w-screen h-screen bg-black/70 fixed left-0 right-0 z-50 flex justify-center items-center">

                    <div className="w-[400px] h-[200px] bg-white p-4 rounded-lg flex flex-col overflow-hidden">
                        <div className="w-full h-[40px] bg-accent">
                            <h1 className="text-white text-lg font-semibold p-2">Confirm Deletion</h1>
                            <IoClose />
                        </div>


                    </div>
                
                </div>

            )
        }
    

        </>
    )
}