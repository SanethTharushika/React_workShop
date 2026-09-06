import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FiArrowLeft,
    FiBox,
    FiDollarSign,
    FiImage,
    FiLayers,
    FiSave,
    FiUploadCloud
} from "react-icons/fi";

import uploadMedia from "../../utils/mediaUpload";
import toast from "react-hot-toast";
import api from "../../utils/api";

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

        if (token == null) {
            toast.error("You are not logged in");
            navigate("/signin");
            setIsLoading(false);
            return;
        }

        const imageUploadPromises = [];

        for (let i = 0; i < image.length; i++) {
            imageUploadPromises.push(
                uploadMedia(image[i])
            );
        }

        try {

            const imageUrls = await Promise.all(
                imageUploadPromises
            );

            const altNamesArray =
                altNames.split(",");

            const requestBody = {
                productId: productId,
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
                model: model
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

            toast.error(
                error?.response?.data?.message ||
                error?.message ||
                "Failed to add product"
            );

            setIsLoading(false);
        }
    }

    return (
        <div className="w-full min-h-full p-2 md:p-4">

            {/* Top Header */}
            <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between">

                <div>

                    <h1 className="mt-2 text-3xl font-bold tracking-tight text-accent">
                        Add New Product
                    </h1>

                    <p className="mt-2 text-sm text-slate-900">
                        Add the product information, pricing, inventory and images.
                    </p>

                </div>


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


            {/* Main Form */}
            <div className="grid gap-6 xl:grid-cols-[minmax(0,1.65fr)_minmax(320px,0.85fr)]">

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


                    {/* Product Images */}
                    <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">

                        <SectionHeader
                            icon={<FiImage />}
                            title="Product Images"
                            description="Upload the images used for the product."
                        />

                        <label className="flex min-h-[180px] cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 text-center transition hover:border-accent hover:bg-blue-50/40">

                            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-accent">
                                <FiUploadCloud className="text-2xl" />
                            </div>

                            <span className="text-sm font-semibold text-slate-800">
                                Choose Product Images
                            </span>

                            <span className="mt-1 text-xs text-slate-400">
                                PNG or JPG
                            </span>

                            <input
                                multiple
                                type="file"
                                accept="image/*"
                                className="sr-only"
                                onChange={(e) => {
                                    setImage(
                                        e.target.files
                                    );
                                }}
                            />

                        </label>


                        {
                            image.length > 0 && (

                                <div className="mt-4 rounded-xl bg-blue-50 px-4 py-3 text-center">

                                    <p className="text-sm font-semibold text-accent">
                                        {image.length}
                                        {" "}
                                        image
                                        {image.length > 1 ? "s" : ""}
                                        {" "}
                                        selected
                                    </p>

                                </div>

                            )
                        }

                    </section>

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