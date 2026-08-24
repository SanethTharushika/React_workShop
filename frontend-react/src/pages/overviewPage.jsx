import { Link, Navigate, useLocation } from "react-router-dom";
import { getFormattedPrice } from "../utils/price-formatter.jsx";

export default function OverviewPage() {
    const location = useLocation();
    const product = location.state?.product;

    if (!product) {
        return <Navigate to="/products" replace />;
    }

    return (
        <div className="w-full min-h-screen bg-primary p-8 md:p-12">
            <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-xl overflow-hidden">
                <div className="grid grid-cols-1 md:grid-cols-2">
                    <img
                        src={product?.image?.[0] || "/default-product-1.png"}
                        alt={product.name}
                        className="w-full h-80 md:h-full object-cover"
                    />

                    <div className="p-6 md:p-8 flex flex-col gap-4">
                        <h1 className="text-3xl font-bold text-secondary">{product.name}</h1>
                        <p className="text-gray-700">{product.description}</p>

                        <div className="text-lg text-secondary">
                            <p>
                                <span className="font-semibold">Category:</span> {product.category}
                            </p>
                            <p>
                                <span className="font-semibold">Brand:</span> {product.brand || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Model:</span> {product.model || "N/A"}
                            </p>
                            <p>
                                <span className="font-semibold">Stock:</span> {product.stock}
                            </p>
                        </div>

                        {Number(product.labelledPrice) > Number(product.price) && (
                            <p className="text-gray-500 line-through decoration-2">
                                {getFormattedPrice(product.labelledPrice)}
                            </p>
                        )}

                        <p className="text-2xl font-bold text-accent">{getFormattedPrice(product.price)}</p>

                        <Link
                            to="/products"
                            className="w-fit mt-2 px-4 py-2 rounded-md bg-accent text-white hover:bg-secondary"
                        >
                            Back to Products
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
