import { useEffect, useRef, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiBox,
    FiDollarSign,
    FiImage,
    FiLayers,
    FiSave,
    FiUploadCloud,
    FiX
} from "react-icons/fi";

import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";

const ALLOWED_TYPES = ["image/png", "image/jpeg"];
const MAX_SIZE = 5 * 1024 * 1024; // 5 MB

function formatSize(bytes) {
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export default function AdminAddProductForm() {

    const [productId, setProductId] = useState("");
    const [name, setName] = useState("");
    const [altNames, setAltNames] = useState("");
    const [description, setDescription] = useState("");
    const [price, setPrice] = useState("");
    const [labelledPrice, setLabelledPrice] = useState("");

    // Each item: { file, name, size, url }
    const [imageItems, setImageItems] = useState([]);
    const [activeIndex, setActiveIndex] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const imageInputRef = useRef(null);
    const itemsRef = useRef([]);

    const [isAvailable, setIsAvailable] = useState(true);
    const [category, setCategory] = useState("");
    const [stock, setStock] = useState(0);
    const [brand, setBrand] = useState("");
    const [model, setModel] = useState("");
    const [isloading, setIsLoading] = useState(false);

    const navigate = useNavigate();

    useEffect(() => {
        itemsRef.current = imageItems;
    }, [imageItems]);

    useEffect(() => {
        return () => {
            itemsRef.current.forEach((item) => {
                URL.revokeObjectURL(item.url);
            });
        };
    }, []);

    async function addProduct() {

        setIsLoading(true);

        const token = localStorage.getItem("token");

        if (token == null) {
            toast.error("You are not logged in");
            navigate("/signin");
            setIsLoading(false);
            return;
        }

        if (!category) {
            toast.error("Please choose a product category");
            setIsLoading(false);
            return;
        }

        const imageUploadPromises = [];

        for (let i = 0; i < imageItems.length; i++) {
            imageUploadPromises.push(
                uploadMedia(imageItems[i].file)
            );
        }

        try {

            const imageUrls = await Promise.all(
                imageUploadPromises
            );

            const altNamesArray =
                altNames
                    .split(",")
                    .map((value) => value.trim())
                    .filter(Boolean);

            const requestBody = {
                productId: productId.trim(),
                name: name.trim(),
                altNames: altNamesArray,
                description: description.trim(),
                price: Number(price),
                labelledPrice: Number(labelledPrice),
                image: imageUrls,
                isAvailable: isAvailable,
                category: category.trim(),
                stock: Number(stock),
                brand: brand.trim(),
                model: model.trim()
            };

            await api.post(
                "/products",
                requestBody,
                {
                    headers: {
                        Authorization:
                            "Bearer " + token
                    }
                }
            );

            toast.success(
                "Product added successfully"
            );

            navigate(
                "/admin/products"
            );

            setIsLoading(false);

        } catch (error) {

            const validationErrors = error?.response?.data?.errors;
            const errorMessage = Array.isArray(validationErrors)
                ? validationErrors
                    .map((item) => `${item.field}: ${item.message}`)
                    .join(", ")
                : error?.response?.data?.message ||
                  error?.message ||
                  "Failed to add product";

            toast.error(
                errorMessage
            );

            setIsLoading(false);
        }
    }

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
                url: URL.createObjectURL(file)
            });
        });

        if (valid.length === 0) return;

        // show the first newly added image in the preview
        setActiveIndex(imageItems.length);
        setImageItems((prev) => [...prev, ...valid]);
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

    function removeImage(index) {

        URL.revokeObjectURL(imageItems[index].url);

        const newLength = imageItems.length - 1;

        setImageItems((prev) => prev.filter((_, i) => i !== index));
        setActiveIndex((prev) =>
            Math.max(0, Math.min(prev >= index ? prev - 1 : prev, newLength - 1))
        );
    }

    function clearAllImages() {
        imageItems.forEach((item) => URL.revokeObjectURL(item.url));
        setImageItems([]);
        setActiveIndex(0);
    }

    const activeItem = imageItems[activeIndex];

    return (
        <div className="flex h-full min-h-0 w-full flex-col p-2 md:p-4">

            <style>{`
                @keyframes previewIn {
                    from { opacity: 0; transform: scale(0.96); }
                    to   { opacity: 1; transform: scale(1); }
                }
            `}</style>

            <div className="mb-8 shrink-0 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-accent">
                        Add New Product
                    </h1>

                    <p className="mt-2 text-sm text-slate-900">
                        Add the product information, pricing, inventory and images.
                    </p>

                </div>

            </div>


            {/* Main Form */}
            <div className="min-h-0 flex-1 overflow-y-auto pr-1">
                <div className="mx-auto w-full max-w-4xl space-y-6">

                {/* Left Column */}
                <div className="space-y-6">

                    {/* Basic Information */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            icon={<FiBox />}
                            title="Basic Information"
                            description="Core product details shown in the catalogue."
                        />

                        <div className="grid gap-5 md:grid-cols-2">

                            <Field
                                label="Product ID"
                                value={productId}
                                onChange={setProductId}
                                placeholder="PD-001"
                            />

                            <Field
                                label="Product Name"
                                value={name}
                                onChange={setName}
                                placeholder="Enter product name"
                            />

                            <div className="md:col-span-2">

                                <Field
                                    label="Alternative Names"
                                    hint="comma-separated"
                                    value={altNames}
                                    onChange={setAltNames}
                                    placeholder="VGA, CPU, Graphics Card"
                                />

                            </div>

                            <div className="md:col-span-2">

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Description
                                </label>

                                <textarea
                                    value={description}
                                    onChange={(e) => {
                                        setDescription(
                                            e.target.value
                                        );
                                    }}
                                    placeholder="Describe the product..."
                                    className="min-h-[150px] w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100"
                                />

                            </div>

                        </div>

                    </section>


                    {/* Pricing and Inventory */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            icon={<FiDollarSign />}
                            title="Pricing & Inventory"
                            description="Configure selling price, labelled price and stock."
                            iconStyle="bg-emerald-50 text-emerald-600"
                        />

                        <div className="grid gap-5 md:grid-cols-2">

                            <Field
                                label="Selling Price"
                                value={price}
                                onChange={setPrice}
                                placeholder="0.00"
                                type="number"
                            />

                            <Field
                                label="Labelled Price"
                                value={labelledPrice}
                                onChange={setLabelledPrice}
                                placeholder="0.00"
                                type="number"
                            />

                            <Field
                                label="Stock Quantity"
                                value={stock}
                                onChange={setStock}
                                placeholder="0"
                                type="number"
                            />

                            <div>

                                <label className="mb-2 block text-sm font-semibold text-slate-700">
                                    Availability
                                </label>

                                <select
                                    value={String(isAvailable)}
                                    onChange={(e) => {
                                        setIsAvailable(
                                            e.target.value === "true"
                                        );
                                    }}
                                    className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100"
                                >
                                    <option value="true">
                                        Available
                                    </option>

                                    <option value="false">
                                        Not Available
                                    </option>
                                </select>

                            </div>

                        </div>

                    </section>

                </div>


                {/* Right Column */}
                <div className="space-y-6">

                    {/* Classification */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            icon={<FiLayers />}
                            title="Classification"
                            description="Organize the product by category and brand."
                            iconStyle="bg-amber-50 text-amber-600"
                        />

                        <div className="space-y-5">

                            <SelectField
                                label="Category"
                                value={category}
                                onChange={setCategory}
                                placeholder="Choose a category"
                                options={[
                                    ["motherboard", "Motherboard"],
                                    ["graphic-card", "Graphic Card"],
                                    ["ram", "RAM"],
                                    ["processor", "Processor"],
                                    ["storage", "Storage"]
                                ]}
                            />

                            <SelectField
                                label="Brand"
                                value={brand}
                                onChange={setBrand}
                                options={[
                                    ["asus", "Asus"],
                                    ["gigabyte", "Gigabyte"],
                                    ["msi", "MSI"],
                                    ["amd", "AMD"],
                                    ["intel", "Intel"],
                                    ["kingston", "Kingston"],
                                    ["corsair", "Corsair"],
                                    ["samsung", "Samsung"],
                                    ["seagate", "Seagate"],
                                    ["apple", "Apple"],
                                    ["dell", "Dell"],
                                    ["hp", "HP"],
                                    ["lenovo", "Lenovo"],
                                    ["", "No Brand"]
                                ]}
                            />

                            <Field
                                label="Model"
                                value={model}
                                onChange={setModel}
                                placeholder="RTX 5090"
                            />

                        </div>

                    </section>


                    {/* Product Images: upload (left) + preview (right) */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            icon={<FiImage />}
                            title="Product Images"
                            description="Upload the images used for the product."
                        />

                        <div className="grid gap-4 md:grid-cols-2">

                            {/* LEFT: upload area */}
                            <button
                                type="button"
                                onClick={() => imageInputRef.current?.click()}
                                onDragOver={(e) => {
                                    e.preventDefault();
                                    setIsDragging(true);
                                }}
                                onDragLeave={() => setIsDragging(false)}
                                onDrop={handleDrop}
                                className={`flex min-h-[260px] w-full cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed px-6 text-center transition-all duration-300
                                    ${isDragging
                                        ? "scale-[1.02] border-accent bg-blue-50"
                                        : "border-slate-200 bg-slate-50 hover:border-accent hover:bg-blue-50/40"}`}
                            >

                                <div
                                    className={`mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-accent transition-transform duration-300
                                        ${isDragging ? "-translate-y-1 scale-110" : ""}`}
                                >
                                    <FiUploadCloud className="text-2xl" />
                                </div>

                                <span className="text-sm font-semibold text-slate-800">
                                    {isDragging ? "Drop images here" : "Choose Product Images"}
                                </span>

                                <span className="mt-1 text-xs text-slate-400">
                                    Click or drag &amp; drop
                                </span>

                                <span className="mt-1 text-xs text-slate-400">
                                    PNG or JPG, up to 5 MB each
                                </span>

                            </button>

                            <input
                                ref={imageInputRef}
                                multiple
                                type="file"
                                accept="image/png,image/jpeg"
                                className="hidden"
                                onChange={handleImageChange}
                            />


                            {/* RIGHT: preview area */}
                            <div className="flex min-h-[260px] flex-col rounded-2xl border border-slate-200 bg-slate-50 p-3">

                                {activeItem ? (

                                    <>
                                        {/* Main preview */}
                                        <div className="group relative flex-1 overflow-hidden rounded-xl bg-white">

                                            <img
                                                key={activeItem.url}
                                                src={activeItem.url}
                                                alt="Selected product preview"
                                                style={{ animation: "previewIn 300ms ease-out" }}
                                                className="h-full max-h-[260px] min-h-[180px] w-full object-cover"
                                            />

                                            <button
                                                type="button"
                                                onClick={() => removeImage(activeIndex)}
                                                title="Remove image"
                                                className="absolute right-2 top-2 flex h-8 w-8 items-center justify-center rounded-full bg-black/60 text-white opacity-100 transition hover:bg-red-600 md:opacity-0 md:group-hover:opacity-100"
                                            >
                                                <FiX />
                                            </button>

                                        </div>

                                        {/* File info */}
                                        <div className="mt-2 flex items-center justify-between gap-2 px-1">
                                            <p className="truncate text-xs font-medium text-slate-600">
                                                {activeItem.name}
                                            </p>
                                            <p className="shrink-0 text-xs text-slate-400">
                                                {formatSize(activeItem.size)}
                                            </p>
                                        </div>

                                        {/* Thumbnails (only when more than one image) */}
                                        {imageItems.length > 1 && (
                                            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
                                                {imageItems.map((item, index) => (
                                                    <button
                                                        type="button"
                                                        key={item.url}
                                                        onClick={() => setActiveIndex(index)}
                                                        className={`h-14 w-14 shrink-0 overflow-hidden rounded-lg border-2 transition-all duration-200
                                                            ${index === activeIndex
                                                                ? "border-accent shadow-md"
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

                                        {/* Footer: count + clear all */}
                                        <div className="mt-2 flex items-center justify-between px-1">
                                            <p className="text-xs font-semibold text-accent">
                                                {imageItems.length} image
                                                {imageItems.length > 1 ? "s" : ""} selected
                                            </p>

                                            <button
                                                type="button"
                                                onClick={clearAllImages}
                                                className="text-xs font-medium text-slate-400 transition hover:text-red-600"
                                            >
                                                Clear all
                                            </button>
                                        </div>
                                    </>

                                ) : (

                                    /* Empty state */
                                    <div className="flex flex-1 flex-col items-center justify-center text-center">

                                        <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100 text-2xl text-slate-300">
                                            <FiImage />
                                        </div>

                                        <p className="text-sm font-semibold text-slate-500">
                                            No image selected
                                        </p>

                                        <p className="mt-1 text-xs text-slate-400">
                                            Your preview will appear here
                                        </p>

                                    </div>

                                )}

                            </div>

                        </div>

                    </section>

                    <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                        <div className="flex items-center gap-3">

                            <Link
                                to="/admin/products"
                                className="rounded-xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-600 shadow-sm transition hover:border-red-200 hover:bg-red-50 hover:text-red-600"
                            >
                                Cancel
                            </Link>

                            <button
                                disabled={isloading}
                                onClick={addProduct}
                                className="inline-flex items-center gap-2 rounded-xl bg-accent px-5 py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                                <FiSave />

                                {
                                    isloading
                                        ? "Saving..."
                                        : "Save Product"
                                }
                            </button>

                        </div>

                    </div>

                </div>

            </div>

        </div>

        </div>

    );
}


function SectionHeader({
    icon,
    title,
    description,
    iconStyle = "bg-blue-50 text-accent"
}) {

    return (
        <div className="mb-6 flex items-center gap-3">

            <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl text-lg ${iconStyle}`}
            >
                {icon}
            </div>

            <div>

                <h2 className="font-bold text-slate-900">
                    {title}
                </h2>

                <p className="mt-0.5 text-xs text-slate-500">
                    {description}
                </p>

            </div>

        </div>
    );
}


function Field({
    label,
    hint,
    value,
    onChange,
    placeholder,
    type = "text"
}) {

    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">

                {label}

                {
                    hint && (
                        <span className="ml-1 font-normal italic text-slate-400">
                            ({hint})
                        </span>
                    )
                }

            </label>

            <input
                value={value}
                type={type}
                placeholder={placeholder}
                onChange={(e) => {
                    onChange(
                        e.target.value
                    );
                }}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition placeholder:text-slate-400 focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100"
            />

        </div>
    );
}


function SelectField({
    label,
    value,
    onChange,
    placeholder,
    options
}) {

    return (
        <div>

            <label className="mb-2 block text-sm font-semibold text-slate-700">
                {label}
            </label>

            <select
                value={value}
                onChange={(e) => {
                    onChange(
                        e.target.value
                    );
                }}
                className="h-12 w-full rounded-xl border border-slate-200 bg-slate-50 px-4 text-sm outline-none transition focus:border-accent focus:bg-white focus:ring-4 focus:ring-blue-100"
            >
                {placeholder && (
                    <option value="" disabled>
                        {placeholder}
                    </option>
                )}

                {
                    options.map(
                        ([optionValue, optionLabel]) => {

                            return (
                                <option
                                    key={optionValue || "none"}
                                    value={optionValue}
                                >
                                    {optionLabel}
                                </option>
                            );

                        }
                    )
                }

            </select>

        </div>
    );
}