import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";

const sampleProducts = [
    {
        productId: "1",
        name: "Product 1",
        price: 19.99
    },
    {
        productId: "2",
        name: "Product 2",
        price: 29.99
    },
    {
        productId: "3",
        name: "Product 3",
        price: 39.99
    }
];

export default function AdminProductPage() {

    const [products] = useState(sampleProducts);

    return (
        <div className="w-full h-full p-5">

            {products.map((product) => (
                <div
                    key={product.productId}
                    className="bg-white shadow-md rounded-lg p-4 mb-3"
                >
                    <p><strong>Product ID:</strong> {product.productId}</p>
                    <p><strong>Name:</strong> {product.name}</p>
                    <p><strong>Price:</strong> ${product.price}</p>
                </div>
            ))}

            <Link
                to="/admin/add-product"
                className="bg-accent w-[80px] h-[80px] rounded-full text-white text-4xl flex justify-center items-center fixed bottom-5 right-5 shadow-2xl hover:bg-black"
            >
                <IoIosAdd />
            </Link>

        </div>
    );
}