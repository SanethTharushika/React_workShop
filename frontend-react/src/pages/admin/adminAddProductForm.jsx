import { useState } from "react";
import { Link } from "react-router-dom";

export default function AdminAddProductForm() {


    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");
    const [image, setImage] = useState([]);
    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");



    return (
        <div className="w-[100%] h-full flex items-start flex-col ">

            <div className="w-full h-[100px] bg-white shadow-2xl rounded-lg flex p-4 items-center justify-between">

                <h1 className="text-2xl font-semibold">Add New Product</h1>

                <div className="h-full gap-4 flex items-center">

                    <Link to="/admin/products" className="w-[100px] bg-red-600 rounded-lg text-white px-4 py-2  text-center">Cancel</Link>
                    <Link to="/admin/products" className="w-[100px] bg-green-600 rounded-lg text-white px-4 py-2  text-center">Save</Link>
                </div>
            </div>

            <div className="w-full h-[300px] flex border p-4 items-start gap-6">
                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Product ID</label>
                    <input value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="PD-001" />

                </div>




                <div className="w-[65%] h-[70px] flex items-start">
                    <div className="w-[50%] h-[70px] flex flex-col ">
                        <label className="text-black text-semibold">Product Name</label>
                        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Product Name" />

                    </div>

                    <div className="w-[95%] h-[70px] flex items-start ml-6 flex-col">
                    {/* <div className="w-[50%] h-[70px] flex flex-col border"> */}
                        <label className="text-black text-semibold">Alternative Names <span className="text-gray-400 italic">(comma-separated)</span></label>
                        <input value={altNames} onChange={(e) => setAltNames(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="VGA,CPU,Graphics Card" />

                    {/* </div> */}

                    </div>




                </div>
            </div>

        </div>
    )
}