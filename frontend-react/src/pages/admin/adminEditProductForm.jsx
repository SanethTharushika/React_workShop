import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import toast from "react-hot-toast";
import uploadMedia from "../../utils/mediaUpload";
import api from "../../utils/api";

const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

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
    const [isAvailable, setIsAvailable] = useState(location.state.isAvailable);
    const [category, setCategory] = useState(location.state.category);
    const [stock, setStock] = useState(location.state.stock);
    const [brand, setBrand] = useState(location.state.brand);
    const [model, setModel] = useState(location.state.model);
    const [isloading, setIsLoading] = useState(false);

    // Newly selected images. Each item: { file, name, size, url }
    const [newItems, setNewItems] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const newItemsRef = useRef([]);

    // keep a ref of the latest items so we can clean up on unmount
    useEffect(() => {
        newItemsRef.current = newItems;
    }, [newItems]);

    useEffect(() => {
        return () => {
            newItemsRef.current.forEach((item) => URL.revokeObjectURL(item.url));
        };
    }, []);

    // Current images saved on the product
    const currentItems = (location.state.image || []).map((src, index) => ({
        url: src,
        name: `Image ${index + 1}`,
    }));

    const showingNew = newItems.length > 0;
    const displayItems = showingNew ? newItems : currentItems;
    const safeIndex = Math.min(activeIndex, Math.max(displayItems.length - 1, 0));
    const activeItem = displayItems[safeIndex];

    // Validate + add new files (used by both click-to-choose and drag & drop)
    function addFiles(fileList) {
        const files = Array.from(fileList || []);
        const valid = [];

        files.forEach((file) => {
            if (!ALLOWED_TYPES.includes(file.type)) {
                toast.error(`${file.name}: only PNG or JPG files are allowed`);
                return;
            }

            if (file.size > MAX_SIZE) {
                toast.error(`${file.name}: file is larger than 5 MB`);
                return;
            }

            valid.push({
                file,
                name: file.name,
                size: file.size,
                url: URL.createObjectURL(file),
            });
        });

        if (valid.length === 0) return;

        // show the first newly added image in the preview
        setActiveIndex(newItems.length);
        setNewItems((prev) => [...prev, ...valid]);
    }

    function handleImageChange(event) {
        addFiles(event.target.files);
        event.target.value = "";
    }

    function handleDrop(event) {
        event.preventDefault();
        setIsDragging(false);
        addFiles(event.dataTransfer.files);
    }

    function removeNewImage(index) {
        URL.revokeObjectURL(newItems[index].url);
        setNewItems((prev) => prev.filter((_, i) => i !== index));
        setActiveIndex(0);
    }

    // Discard all new images and go back to showing the current ones
    function discardNewImages() {
        newItems.forEach((item) => URL.revokeObjectURL(item.url));
        setNewItems([]);
        setActiveIndex(0);
    }

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

            for (let i = 0; i < newItems.length; i++) {
                imageUploadPromises.push(uploadMedia(newItems[i].file));
            }

            let imageUrls = await Promise.all(imageUploadPromises);

            // no new images selected: keep the current ones
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
            <style>{`
                @keyframes previewIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>

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

            {/* Images: upload (left) + preview (right) */}
            <Card title="Images" subtitle="Upload new images to replace the current ones">
                <div className="md:col-span-6 grid gap-4 md:grid-cols-2">

                    {/* LEFT: upload area */}
                    <label
                        onDragOver={(e) => {
                            e.preventDefault();
                            setIsDragging(true);
                        }}
                        onDragLeave={() => setIsDragging(false)}
                        onDrop={handleDrop}
                        className={`flex min-h-[280px] flex-col items-center justify-center gap-1 rounded-2xl border-2 border-dashed
                                    px-6 text-center cursor-pointer transition-all duration-300
                                    ${isDragging
                                ? "scale-[1.02] border-blue-500 bg-blue-50 text-blue-600"
                                : "border-gray-300 bg-gray-50 text-gray-500 hover:border-blue-500 hover:bg-blue-50 hover:text-blue-600"}`}
                    >
                        <div
                            className={`mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-2xl text-blue-600
                                        transition-transform duration-300 ${isDragging ? "-translate-y-1 scale-110" : ""}`}
                        >
                            ⬆
                        </div>

                        <span className="font-medium">
                            {isDragging ? "Drop images here" : "Click to choose images"}
                        </span>
                        <span className="text-xs">or drag &amp; drop them here</span>
                        <span className="text-xs">PNG or JPG, up to 5 MB each</span>
                        <span className="mt-2 text-xs text-gray-400">
                            {showingNew
                                ? `${newItems.length} new file(s) selected`
                                : "Leave empty to keep current images"}
                        </span>

                        <input
                            multiple
                            type="file"
                            accept="image/png,image/jpeg"
                            className="hidden"
                            onChange={handleImageChange}
                        />
                    </label>

                    {/* RIGHT: preview area */}
                    <div className="flex min-h-[280px] flex-col rounded-2xl border border-gray-200 bg-gray-50 p-3">

                        {activeItem ? (
                            <>
                                {/* Main preview */}
                                <div className="group relative flex-1 overflow-hidden rounded-xl bg-white">
                                    <img
                                        key={activeItem.url}
                                        src={activeItem.url}
                                        alt="Product preview"
                                        style={{ animation: "previewIn 300ms ease-out" }}
                                        className="h-full max-h-[280px] min-h-[190px] w-full object-cover"
                                    />

                                    {/* Current / New badge */}
                                    <span
                                        className={`absolute left-2 top-2 rounded-full px-3 py-1 text-xs font-semibold shadow
                                                    ${showingNew ? "bg-green-500 text-white" : "bg-white/90 text-gray-600"}`}
                                    >
                                        {showingNew ? "New" : "Current"}
                                    </span>

                                    {/* Remove button (only for new images) */}
                                    {showingNew && (
                                        <button
                                            type="button"
                                            onClick={() => removeNewImage(safeIndex)}
                                            title="Remove image"
                                            className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full
                                                       bg-black/60 text-white opacity-100 transition hover:bg-red-600
                                                       md:opacity-0 md:group-hover:opacity-100"
                                        >
                                            ✕
                                        </button>
                                    )}
                                </div>

                                {/* File info (new images only) */}
                                {showingNew && (
                                    <div className="mt-2 flex items-center justify-between gap-2 px-1">
                                        <p className="truncate text-xs font-medium text-gray-600">{activeItem.name}</p>
                                        <p className="shrink-0 text-xs text-gray-400">{formatSize(activeItem.size)}</p>
                                    </div>
                                )}

                                {/* Thumbnails (only when more than one image) */}
                                {displayItems.length > 1 && (
                                    <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                        {displayItems.map((item, index) => (
                                            <button
                                                type="button"
                                                key={`${item.url}-${index}`}
                                                onClick={() => setActiveIndex(index)}
                                                className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200
                                                    ${index === safeIndex
                                                        ? "border-blue-500 shadow-md"
                                                        : "border-transparent opacity-60 hover:opacity-100"}`}
                                            >
                                                <img
                                                    src={item.url}
                                                    alt={`Thumbnail ${index + 1}`}
                                                    className="h-full w-full object-cover"
                                                />
                                            </button>
                                        ))}
                                    </div>
                                )}

                                {/* Footer */}
                                <div className="mt-2 flex items-center justify-between gap-2 px-1">
                                    <p className={`text-xs font-semibold ${showingNew ? "text-green-600" : "text-blue-600"}`}>
                                        {showingNew
                                            ? `${newItems.length} new image${newItems.length > 1 ? "s" : ""} (will replace current images on save)`
                                            : `${currentItems.length} current image${currentItems.length > 1 ? "s" : ""}`}
                                    </p>

                                    {showingNew && (
                                        <button
                                            type="button"
                                            onClick={discardNewImages}
                                            className="shrink-0 text-xs font-medium text-gray-400 transition hover:text-red-600"
                                        >
                                            Discard new
                                        </button>
                                    )}
                                </div>
                            </>
                        ) : (
                            /* Empty state: no current and no new images */
                            <div className="flex flex-1 flex-col items-center justify-center text-center">
                                <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gray-100 text-2xl text-gray-300">
                                    🖼
                                </div>
                                <p className="text-sm font-semibold text-gray-500">No image</p>
                                <p className="mt-1 text-xs text-gray-400">Your preview will appear here</p>
                            </div>
                        )}
                    </div>

                </div>
            </Card>
        </div>
    );
}