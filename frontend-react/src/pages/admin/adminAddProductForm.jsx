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

            <div className="w-full flex  p-4 items-start gap-4 flex-wrap">
                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Product ID</label>
                    <input value={productId} onChange={(e) => setProductId(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="PD-001" />

                </div>


                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Product Name</label>
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Product Name" />

                </div>

                <div className="w-[45%] h-[70px] flex items-start  flex-col">
                    
                    <label className="text-black text-semibold">Alternative Names <span className="text-gray-400 italic">(comma-separated)</span></label>
                    <input value={altNames} onChange={(e) => setAltNames(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="VGA,CPU,Graphics Card" />



                </div>

                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Price</label>
                    <input value={price} onChange={(e) => setPrice(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Price" />

                </div>

                 <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Labelled Price </label>
                    <input value={labelledPrice} onChange={(e) => setLabelledPrice(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Labelled Price" />

                </div>

                 <div className="w-full h-[100px] flex flex-col ">
                    <label className="text-black text-semibold">Description</label>
                    <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Description" />

                </div>

                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Images</label>
                    <input multiple={true} onChange={(e) => setImages(e.target.file)} type="file" className="w-full h-[40px] border rounded-lg px-2"  placeholder="Upload Images" />

                </div>

                 {/* <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Availability</label>
                    <input type="checkbox" checked={isAvailable} onChange={(e) => setIsAvailable(e.target.checked)} className="w-full h-[40px] border rounded-lg px-2"  placeholder="Enter Availability" />

                </div> */}

                 <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Availability</label>
                    <select value={isAvailable} onChange={(e) => setIsAvailable(e.target.value)} className="w-full h-[40px] border rounded-lg px-2"  placeholder="Enter Availability">
                        <option value={true}>Available</option>
                        <option value={false}>Not Available</option>
                    </select>

                </div>

                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Stock</label>
                    <input value={stock} onChange={(e) => setStock(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="Enter Stock" />

                </div>

                

                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Category</label>
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className="w-full h-[40px] border rounded-lg px-2"  placeholder="Enter Category">
                        <option value="motherboard">Motherboard</option>
                        <option value="graphic-card">Graphic Card</option>
                        <option value="ram">RAM</option>
                        <option value="processor">Processor</option>
                        <option value="storage">Storage</option>
                    </select>

                </div>

                <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Brand</label>
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className="w-full h-[40px] border rounded-lg px-2"  placeholder="Enter Brand">
                        <option value="asus">Asus</option>
                        <option value="gigabyte">Gigabyte</option>
                        <option value="msi">MSI</option>
                        <option value="amd">AMD</option>
                        <option value="intel">Intel</option>
                        <option value="kingston">Kingston</option>
                        <option value="corsair">Corsair</option>
                        <option value="samsung">Samsung</option>
                        <option value="seagate">Seagate</option>
                        <option value="apple">Apple</option>
                        <option value="dell">Dell</option>
                        <option value="hp">HP</option>
                        <option value="lenovo">Lenovo</option>
                        <option value="">No Brand</option>
                    </select>
                </div>

                    <div className="w-[25%] h-[70px] flex flex-col ">
                    <label className="text-black text-semibold">Model</label>
                    <input value={model} onChange={(e) => setModel(e.target.value)} className="w-full h-[40px] border rounded-lg px-2" type="text" placeholder="RTX 5090" />

                </div>


                







                
            </div>

        </div>
    )
}