import { IoIosAdd } from "react-icons/io";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../utils/api";
import toast from "react-hot-toast";
import LoadingScreen from "../../components/loadingScreen.jsx";
import ProductDeleteButton from "../../components/productDeleteButton.jsx";
import { CiEdit } from "react-icons/ci";
import { getFormattedPrice } from "../../utils/price-formatter.jsx";

export default function AdminProductPage() {

    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        if (!loading) return;

        const token = localStorage.getItem("token");
        api.get("/products", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })
            .then((response) => {
                console.log(response.data);
                setProducts(response.data);
            })
            .catch((error) => {
                console.error("Failed to load products:", error);
                if (error?.response?.status === 401) {
                    localStorage.removeItem("token");
                    toast.error("Session expired. Please sign in again.");
                    navigate("/signin");
                    return;
                }

                toast.error(error?.response?.data?.message || "Failed to load products");
                setProducts([]);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [loading, navigate]);


    return (
        <div className="w-full h-full p-5">
            {
                loading && <LoadingScreen />
            }

        
            <div className="w-full h-[100px] bg-gray-300 shadow-2xl mb-10 rounded-lg flex p-4 items-center justify-between">

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
                                return <tr key={product._id || product.productId} className="odd:bg-gray-300">
                                    <td>
                                        <img src={product?.image?.[0] || "/default-product-1.png"} alt={product.name} className="w-16 h-16 object-cover" />
                                    </td>
                                    <td>{product.productId}</td>
                                    <td>{product.name}</td>
                                    <td>{getFormattedPrice(product.price)}</td>
                                    <td>{getFormattedPrice(product.labelledPrice)}</td>
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

                                        <div className="w-full flex justify-center items-center gap-4 ">

                                            <Link to="/admin/edit-product" state={product}><CiEdit className="text-blue-600 text-xl hover:text-3xl"></CiEdit></Link>
                                            

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
