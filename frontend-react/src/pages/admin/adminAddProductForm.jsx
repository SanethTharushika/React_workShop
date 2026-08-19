import { useState } from "react";
import { Link } from "react-router-dom";
import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiBox, FiDollarSign, FiImage, FiLayers, FiSave, FiUploadCloud } from "react-icons/fi";



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
    const [isloading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    async function addProduct() {

        setIsLoading(true);

        const token = localStorage.getItem("token");

        if(token == null) {

            toast.error("You are not logged in");
            navigate("/signin");
            return;

        }
        

        const imageUploadPromises =[]

        for(let i=0; i<image.length; i++){
            imageUploadPromises.push(uploadMedia(image[i]))

    }

    try {

        const imageUrls = await Promise.all(imageUploadPromises);

        const altNamesArray = altNames.split(",");

        const requestBody = {
            productId : productId,
            name : name,
            altNames : altNamesArray,
            description : description,
            price : price,
            labelledPrice : labelledPrice,
            image : imageUrls,
            isAvailable : isAvailable,
            category : category,
            stock : stock,
            brand : brand,
            model : model
        }

        await api.post("/products", requestBody , 
            {
                headers : {
                    Authorization : "Bearer " + token
                }
            }
        )  
        
        toast.success("Product added successfully");
        navigate("/admin/products");

        setIsLoading(false);

    }catch (error) {
        
        toast.error(error?.response?.data?.message || error?.message || "Failed to add product");
        setIsLoading(false);
    }
     
}



    return (
        <div className="w-full min-h-full pb-8">
            <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
                <div>
                    <Link to="/admin/products" className="mb-3 inline-flex items-center gap-2 text-sm font-medium text-slate-500 transition hover:text-accent"><FiArrowLeft /> Back to products</Link>
                    <p className="mb-1 text-xs font-bold uppercase tracking-[0.2em] text-accent">Product catalogue</p>
                    <h1 className="text-3xl font-bold tracking-tight text-slate-900">Add new product</h1>
                    <p className="mt-1 text-sm text-slate-500">Create a clear, complete listing for your store.</p>
                </div>
                <div className="flex gap-3">
                    <Link to="/admin/products" className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:text-red-600">Cancel</Link>
                    <button disabled={isloading} onClick={addProduct} className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-900/15 transition hover:bg-slate-900 disabled:cursor-not-allowed disabled:opacity-60"><FiSave /> {isloading ? "Saving..." : "Save product"}</button>
                </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7 lg:p-8">
                <div className="grid gap-x-10 gap-y-8 xl:grid-cols-[minmax(0,1.65fr)_minmax(280px,0.85fr)]">
                    <div className="space-y-8">
                    <section className="border-b border-slate-100 pb-8">
                        <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-accent"><FiBox /></span><div><h2 className="font-bold text-slate-900">Basic information</h2><p className="text-xs text-slate-500">The details customers see first.</p></div></div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Product ID" value={productId} onChange={setProductId} placeholder="PD-001" />
                            <Field label="Product name" value={name} onChange={setName} placeholder="Enter product name" />
                            <div className="sm:col-span-2"><Field label="Alternative names" hint="comma-separated" value={altNames} onChange={setAltNames} placeholder="VGA, CPU, Graphics Card" /></div>
                            <div className="sm:col-span-2"><label className="mb-2 block text-sm font-semibold text-slate-700">Description</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} className="min-h-32 w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100" placeholder="Describe the product, its benefits, and what is included..." /></div>
                        </div>
                    </section>

                    <section>
                        <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600"><FiDollarSign /></span><div><h2 className="font-bold text-slate-900">Pricing & inventory</h2><p className="text-xs text-slate-500">Set the commercial details for this item.</p></div></div>
                        <div className="grid gap-5 sm:grid-cols-2">
                            <Field label="Selling price" value={price} onChange={setPrice} placeholder="0.00" type="number" />
                            <Field label="Labelled price" value={labelledPrice} onChange={setLabelledPrice} placeholder="0.00" type="number" />
                            <Field label="Stock quantity" value={stock} onChange={setStock} placeholder="0" type="number" />
                            <div><label className="mb-2 block text-sm font-semibold text-slate-700">Availability</label><select value={String(isAvailable)} onChange={(e) => setIsAvailable(e.target.value === "true")} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100"><option value="true">Available</option><option value="false">Not available</option></select></div>
                        </div>
                    </section>
                </div>

                    <div className="space-y-8">
                    <section className="border-b border-slate-100 pb-8">
                        <div className="mb-6 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600"><FiLayers /></span><div><h2 className="font-bold text-slate-900">Classification</h2><p className="text-xs text-slate-500">Help shoppers find it quickly.</p></div></div>
                        <div className="space-y-5">
                            <SelectField label="Category" value={category} onChange={setCategory} options={[["motherboard", "Motherboard"], ["graphic-card", "Graphic Card"], ["ram", "RAM"], ["processor", "Processor"], ["storage", "Storage"]]} />
                            <SelectField label="Brand" value={brand} onChange={setBrand} options={[["asus", "Asus"], ["gigabyte", "Gigabyte"], ["msi", "MSI"], ["amd", "AMD"], ["intel", "Intel"], ["kingston", "Kingston"], ["corsair", "Corsair"], ["samsung", "Samsung"], ["seagate", "Seagate"], ["apple", "Apple"], ["dell", "Dell"], ["hp", "HP"], ["lenovo", "Lenovo"], ["", "No Brand"]]} />
                            <Field label="Model" value={model} onChange={setModel} placeholder="RTX 5090" />
                        </div>
                    </section>

                    <section className="border-t border-dashed border-slate-200 pt-8">
                        <div className="mb-5 flex items-center gap-3"><span className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-accent shadow-sm"><FiImage /></span><div><h2 className="font-bold text-slate-900">Product images</h2><p className="text-xs text-slate-500">Use clear images with a clean background.</p></div></div>
                        <label className="flex min-h-36 cursor-pointer flex-col items-center justify-center rounded-xl border border-slate-200 bg-white px-4 text-center transition hover:border-accent hover:bg-blue-50/40"><FiUploadCloud className="mb-2 text-2xl text-accent" /><span className="text-sm font-semibold text-slate-700">Choose product images</span><span className="mt-1 text-xs text-slate-400">PNG, JPG up to 10MB each</span><input multiple onChange={(e) => setImage(e.target.files)} type="file" accept="image/*" className="sr-only" /></label>
                        {image.length > 0 && <p className="mt-3 text-center text-xs font-medium text-accent">{image.length} image{image.length > 1 ? "s" : ""} selected</p>}
                    </section>
                    </div>
                </div>
            </div>
        </div>
    )
}

function Field({ label, hint, value, onChange, placeholder, type = "text" }) {
    return <div><label className="mb-2 block text-sm font-semibold text-slate-700">{label} {hint && <span className="font-normal italic text-slate-400">({hint})</span>}</label><input value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100" type={type} placeholder={placeholder} /></div>
}

function SelectField({ label, value, onChange, options }) {
    return <div><label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label><select value={value} onChange={(e) => onChange(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100">{options.map(([optionValue, optionLabel]) => <option key={optionValue || "none"} value={optionValue}>{optionLabel}</option>)}</select></div>
}