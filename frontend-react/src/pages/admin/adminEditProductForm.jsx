import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import uploadMedia from "../../utils/mediaUpload";
import api from "../../utils/api";

const inputClass =
    "w-full h-11 px-3 rounded-lg border border-gray-300 bg-white text-gray-800 " +
    "placeholder-gray-400 transition-all duration-200 " +
    "hover:border-gray-400 focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100 " +
    "disabled:bg-gray-100 disabled:text-gray-500 disabled:cursor-not-allowed";

function Field({ label, hint, className = "", children }) {
    return (
        <div className={`flex flex-col gap-1.5 ${className}`}>
            <label className="text-sm font-semibold text-gray-700">
                {label}
                {hint && <span className="ml-1 font-normal italic text-gray-400">{hint}</span>}
            </label>
            {children}
        </div>
    );
}

function Card({ title, subtitle, children }) {
    return (
        <section className="w-full bg-white rounded-xl shadow-md p-6 transition-shadow duration-300 hover:shadow-lg">
            <div className="mb-5 pb-3 border-b border-gray-100">
                <h2 className="text-lg font-semibold text-gray-800">{title}</h2>
                {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-6 gap-5">{children}</div>
        </section>
    );
}

export default function AdminEditProductForm() {
    const location = useLocation();
    const navigate = useNavigate();

    const [productId, setProductId] = useState(location.state.productId);
    const [name, setName] = useState(location.state.name);
    const [altNames, setAltNames] = useState(location.state.altNames.join(","));
    const [description, setDescription] = useState(location.state.description);
    const [price, setPrice] = useState(location.state.price);
    const [labelledPrice, setLabelledPrice] = useState(location.state.labelledPrice);
    const [image, setImage] = useState([]);
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const [stock, setStock] = useState(location.state.stock);
    const [brand, setBrand] = useState(location.state.brand);
    const [model, setModel] = useState(location.state.model);
    const [isloading, setIsLoading] = useState(false);
    const [newPreviews, setNewPreviews] = useState([]);

    // Preview newly selected images
    useEffect(() => {
        const urls = Array.from(image).map((file) => URL.createObjectURL(file));
        setNewPreviews(urls);
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [image]);

    const currentImages = newPreviews.length > 0 ? newPreviews : location.state.image || [];

    async function editProduct() {
        setIsLoading(true);

        const token = localStorage.getItem("token");

        if (token == null) {
            toast.error("You are not logged in");
            setIsLoading(false);
            navigate("/signin");
            return;
        }

        try {
            const imageUploadPromises = [];

            for (let i = 0; i < image.length; i++) {
                imageUploadPromises.push(uploadMedia(image[i]));
            }

            let imageUrls = await Promise.all(imageUploadPromises);

            if (imageUrls.length == 0) {
                imageUrls = location.state.image;
            }

            const altNamesArray = altNames.split(",");

            const requestBody = {
                name: name,
                altNames: altNamesArray,
                description: description,
                price: price,
                labelledPrice: labelledPrice,
                image: imageUrls,
                isAvailable: isAvailable,
                category: category,
                stock: stock,
                brand: brand,
                model: model,
            };

            await api.put("/products/" + productId, requestBody, {
                headers: {
                    Authorization: "Bearer " + token,
                },
            });

            toast.success("Product updated successfully");
            navigate("/admin/products");

            setIsLoading(false);
        } catch (error) {
            toast.error(error?.response?.data?.message || error?.message || "Failed to update product");
            setIsLoading(false);
        }
    }

    return (
        <div className="w-full h-full flex flex-col gap-5 overflow-y-auto pb-6">
            {/* Header */}
            <div className="sticky top-0 z-10 w-full bg-white/90 backdrop-blur shadow-lg rounded-xl px-6 py-4 flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                    <p className="text-sm text-gray-500">
                        Editing <span className="font-medium text-blue-600">{productId}</span>
                    </p>
                </div>

                <div className="flex items-center gap-3">
                    <Link
                        to="/admin/products"
                        className="px-5 py-2 rounded-lg border border-red-200 text-red-600 font-medium
                                   transition-all duration-200 hover:bg-red-600 hover:text-white hover:shadow-md active:scale-95"
                    >
                        Cancel
                    </Link>
                    <button
                        disabled={isloading}
                        onClick={editProduct}
                        className="min-w-[110px] px-5 py-2 rounded-lg bg-blue-600 text-white font-medium
                                   transition-all duration-200 hover:bg-blue-700 hover:shadow-md hover:-translate-y-0.5
                                   active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed disabled:hover:translate-y-0"
                    >
                        {isloading ? "Saving..." : "Save changes"}
                    </button>
                </div>
            </div>

            {/* Basic info */}
            <Card title="Basic information" subtitle="Name, identifiers and description">
                <Field label="Product ID" className="md:col-span-2">
                    <input
                        disabled
                        value={productId}
                        onChange={(e) => setProductId(e.target.value)}
                        className={inputClass}
                        type="text"
                        placeholder="PD-001"
                    />
                </Field>

                <Field label="Product name" className="md:col-span-4">
                    <input
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className={inputClass}
                        type="text"
                        placeholder="Enter product name"
                    />
                </Field>

                <Field label="Alternative names" hint="(comma-separated)" className="md:col-span-6">
                    <input
                        value={altNames}
                        onChange={(e) => setAltNames(e.target.value)}
                        className={inputClass}
                        type="text"
                        placeholder="VGA,CPU,Graphics Card"
                    />
                </Field>

                <Field label="Description" className="md:col-span-6">
                    <textarea
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        rows={4}
                        className={`${inputClass} h-auto py-2 resize-y`}
                        placeholder="Enter description"
                    />
                </Field>
            </Card>

            {/* Pricing & stock */}
            <Card title="Pricing and stock" subtitle="What customers pay and what you have on hand">
                <Field label="Price" className="md:col-span-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                        <input
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            className={`${inputClass} pl-10`}
                            type="number"
                            min="0"
                            placeholder="0.00"
                        />
                    </div>
                </Field>

                <Field label="Labelled price" className="md:col-span-2">
                    <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">Rs.</span>
                        <input
                            value={labelledPrice}
                            onChange={(e) => setLabelledPrice(e.target.value)}
                            className={`${inputClass} pl-10`}
                            type="number"
                            min="0"
                            placeholder="0.00"
                        />
                    </div>
                </Field>

                <Field label="Stock" className="md:col-span-1">
                    <input
                        value={stock}
                        onChange={(e) => setStock(e.target.value)}
                        className={inputClass}
                        type="number"
                        min="0"
                        placeholder="0"
                    />
                </Field>

                <Field label="Availability" className="md:col-span-1">
                    <button
                        type="button"
                        onClick={() => setIsAvailable(!(isAvailable === true || isAvailable === "true"))}
                        className={`h-11 rounded-lg font-medium text-sm border transition-all duration-300 active:scale-95
                            ${
                                isAvailable === true || isAvailable === "true"
                                    ? "bg-green-50 text-green-700 border-green-300 hover:bg-green-100"
                                    : "bg-red-50 text-red-600 border-red-300 hover:bg-red-100"
                            }`}
                    >
                        {isAvailable === true || isAvailable === "true" ? "Available" : "Unavailable"}
                    </button>
                </Field>
            </Card>

            {/* Classification */}
            <Card title="Classification" subtitle="Help customers find this product">
                <Field label="Category" className="md:col-span-2">
                    <select value={category} onChange={(e) => setCategory(e.target.value)} className={inputClass}>
                        <option value="motherboard">Motherboard</option>
                        <option value="graphic-card">Graphic Card</option>
                        <option value="ram">RAM</option>
                        <option value="processor">Processor</option>
                        <option value="storage">Storage</option>
                    </select>
                </Field>

                <Field label="Brand" className="md:col-span-2">
                    <select value={brand} onChange={(e) => setBrand(e.target.value)} className={inputClass}>
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
                </Field>

                <Field label="Model" className="md:col-span-2">
                    <input
                        value={model}
                        onChange={(e) => setModel(e.target.value)}
                        className={inputClass}
                        type="text"
                        placeholder="RTX 5090"
                    />
                </Field>
            </Card>

            {/* Images */}
            <Card title="Images" subtitle="Upload new images to replace the current ones">
                <Field label="Upload images" className="md:col-span-6">
                    <label
                        className="flex flex-col items-center justify-center gap-1 h-28 rounded-lg border-2 border-dashed border-gray-300
                                   text-gray-500 cursor-pointer transition-all duration-200
                                   hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"
                    >
                        <span className="font-medium">Click to choose images</span>
                        <span className="text-xs">
                            {image.length > 0 ? `${image.length} new file(s) selected` : "Leave empty to keep current images"}
                        </span>
                        <input multiple={true} onChange={(e) => setImage(e.target.files)} type="file" accept="image/*" className="hidden" />
                    </label>
                </Field>

                {currentImages.length > 0 && (
                    <div className="md:col-span-6 flex flex-wrap gap-3">
                        {currentImages.map((src, index) => (
                            <img
                                key={index}
                                src={src}
                                alt={`Product ${index + 1}`}
                                className="w-24 h-24 object-cover rounded-lg border border-gray-200 shadow-sm
                                           transition-transform duration-300 hover:scale-110 hover:shadow-md"
                            />
                        ))}
                    </div>
                )}
            </Card>
        </div>
    );
}