import { Link, Routes, Route } from "react-router-dom"
import { FiShoppingCart } from "react-icons/fi";
import { BsGift } from "react-icons/bs";
import { FaRegUser } from "react-icons/fa";
import AdminProductPage from "./admin/adminProductPage";
import AdminAddProductForm from "./admin/adminAddProductForm";
import AdminEditProductForm from "./admin/adminEditProductForm";
import AdminOrdersPage from "./admin/adminOrdersPage";
import { useState, useEffect } from "react";
import api from "../utils/api.js";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingScreen from "../components/loadingScreen.jsx";


export default function AdminPage() {

    const [user, setUser] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {

        const token = localStorage.getItem("token");

        if (token != null) {

            api.get("/users/me", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
                .then((response) => {
                    if (response.data.isAdmin) {
                        setUser(response.data);
                    } else {
                        toast.error("You are not authorized to access this page.");
                        navigate("/login");

                    }
                })
                .catch((error) => {
                    console.error("Failed to load user data:", error);
                    setUser(null);
                });

        } else {
            toast.error("You are not authorized to access this page.");
            navigate("/login");

        }

    }, []);

    return (
        <div className="w-full min-h-screen bg-primary flex">


            <div className="w-[300px] min-h-screen bg-white flex flex-col shadow-2xl">
                <div className="w-full h-[100px] ">

                    <img src="/logo.jpg" className="w-full h-full object-cover rounded-lg" />

                </div>

                <Link to="/admin" className="w-full m-5 text-xl text-gray-500 flex  justify-center items-center gap-2">
                    <FiShoppingCart />
                    <span className="w-full h-full block ">Orders</span>
                </Link>

                <Link to="/admin/products" className="w-full m-5 text-xl text-gray-500 flex  justify-center items-center gap-2">
                    <BsGift />
                    <span className="w-full h-full block ">Products</span>
                </Link>

                <Link to="/admin/users" className="w-full m-5 text-xl text-gray-500 flex  justify-center items-center gap-2">
                    <FaRegUser />
                    <span className="w-full h-full block ">Users</span>
                </Link>


            </div>

            <div className="w-[calc(100%-300px)] min-h-screen p-4 flex">

                {user == null ? <LoadingScreen /> :
                    <Routes>
                        <Route index element={<AdminOrdersPage />} />
                        <Route path="products" element={<AdminProductPage />} />
                        <Route path="users" element={<h1>Users-page</h1>} />
                        <Route path="add-product" element={<AdminAddProductForm />} />
                        <Route path="edit-product" element={<AdminEditProductForm />} />
                    </Routes>}

            </div>

        </div>
    )

}