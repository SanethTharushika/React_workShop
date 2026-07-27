import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import api from "../../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/loadingScreen.jsx";
import ProductDeleteButton from "../../components/productDeleteButton.jsx";

const sampleProducts = [
    {
        productId: "1",
        name: "Product 1",
        price: 19.99,
        labelledPrice: 24.99,
        brand: "Brand 1",
        model: "Model 1",
        category: "Category 1",
        isAvailable: true,
        stock: 10
    },
    {
        productId: "2",
        name: "Product 2",
        price: 29.99,
        labelledPrice: 34.99,
        brand: "Brand 2",
        model: "Model 2",
        category: "Category 2",
        isAvailable: false,
        stock: 0
    },
    {
        productId: "3",
        name: "Product 3",
        price: 39.99,
        labelledPrice: 44.99,
        brand: "Brand 3",
        model: "Model 3",
        category: "Category 3",
        isAvailable: true,
        stock: 5
    }
];

export default function AdminProductPage() {

    const [products, setProducts] = useState(sampleProducts);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        if (loading) {

            const token = localStorage.getItem("token");
            api.get("/products", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }).then((response) => {
                console.log(response.data);
                setProducts(response.data);
                setLoading(false);
            });

        }
    }, [loading]);


    return (
        <div className="w-full h-full p-5">
            {
                loading && <LoadingScreen />
            }

        
            <div className="w-full h-[100px] bg-white shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">

                <h1 className="text-2xl font-semibold">All Product</h1>

                <div className="h-full gap-4 flex items-center">
                    {products.length} Products

                </div>
            </div>

            <table className="w-full text-center overflow-hidden rounded-lg">
                <thead className="h-[40px] bg-accent text-white font-semibold ">
                    <tr>
                        <td className="w-[5%]"></td>
                        <td className="w-[7%]">Product Id</td>
                        <td className="w-[18%]">Name</td>
                        <td className="w-[8%]">Price</td>
                        <td className="w-[11%]">Labelled Price</td>
                        <td className="w-[8%]">Brand</td>
                        <td className="w-[8%]">Model</td>
                        <td className="w-[8%]">Category</td>
                        <td className="w-[10%]">Availability</td>
                        <td className="w-[5%]">Stock</td>
                        <td className="w-[12%]">Actions</td>
                    </tr>
                </thead>

                <tbody>
                    {
                        products.map(
                            (product) => {
                                return <tr className="odd:bg-gray-300">
                                    <td>
                                        <img src={product.image} alt={product.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td>{product.productId}</td>
                                    <td>{product.name}</td>
                                    <td>${product.price}</td>
                                    <td>{product.labelledPrice}</td>
                                    <td>{product.brand}</td>
                                    <td>{product.model}</td>
                                    <td>{product.category}</td>
                                    <td>{product.isAvailable ? "Available" : "Out of Stock"}</td>
                                    <td>{product.stock}</td>
                                    <td>
                                        {/* <button className="w-[100px] bg-red-500 text-white p-2 rounded-full hover:bg-red-800"
                                            onClick={
                                                () => {
                                                    toast.success(product.productId);
                                                    const token = localStorage.getItem("token");

                                                    api.delete("/products/" + product.productId, {
                                                        headers: {
                                                            Authorization: `Bearer ${token}`
                                                        }
                                                    }).then(() => {
                                                        toast.success("Product deleted successfully");
                                                        setLoading(true);
                                                    })
                                                        .catch(() => {
                                                            toast.error("Failed to delete product");
                                                        });
                                                }
                                            }
                                        >Delete</button> */}

                                        <div className="w-full flex justify-center items-center ">

                                            <ProductDeleteButton productId={product.productId} refresh={() => setLoading(true)} />


                                        </div>

                                        
                                    </td>
                                </tr>


                            }
                        )

                    }
                </tbody>

            </table>

            <Link
                to="/admin/add-product"
                className="bg-accent w-[80px] h-[80px] rounded-full text-white text-4xl flex justify-center items-center fixed bottom-5 right-5 shadow-2xl hover:bg-black"
            >
                <IoIosAdd />
            </Link>

        </div>
    );
}
